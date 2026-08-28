import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'

// One job: take the site's contact form and hand it to Resend.
// No npm dependency, so this file is the whole audit surface, and there is no security
// update to track. node:http and fetch have been enough since Node 18.
//
// User facing strings stay in French: they are shown to visitors, not to developers.

const API_KEY = process.env.RESEND_API_KEY
const RECIPIENT = process.env.CONTACT_RECIPIENT ?? 'contact@nmwstudios.com'
// Address of the domain verified with Resend. The sender can never be the visitor: Resend
// would reject a domain it does not control, and it would be spoofing.
const SENDER = process.env.CONTACT_SENDER ?? 'Site NMW Studios <contact@nmwstudios.com>'
const PORT = Number(process.env.PORT ?? 8080)

if (!API_KEY) {
  console.error('RESEND_API_KEY is missing: refusing to start rather than swallowing messages.')
  process.exit(1)
}

const MAX_LENGTH = { name: 120, email: 200, message: 5000 }
const MAX_BODY_BYTES = 16_000

// In memory sliding window. Single replica, so nothing to share, and a restart that clears
// the counter has no consequence at this volume.
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5
const sent = new Map<string, number[]>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (sent.get(ip) ?? []).filter((at) => now - at < WINDOW_MS)
  sent.set(ip, recent)
  if (recent.length >= MAX_PER_WINDOW) return true
  recent.push(now)
  return false
}

// Traefik is the only caller, so read its header rather than the socket address, which
// would be the proxy's for everyone.
function clientIp(request: IncomingMessage): string {
  const forwarded = request.headers['x-forwarded-for']
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded
  return raw?.split(',')[0]?.trim() || request.socket.remoteAddress || 'unknown'
}

function reply(response: ServerResponse, status: number, body?: Record<string, string>) {
  if (!body) return response.writeHead(status).end()
  const payload = JSON.stringify(body)
  response.writeHead(status, { 'content-type': 'application/json; charset=utf-8' }).end(payload)
}

async function readBody(request: IncomingMessage): Promise<unknown> {
  let size = 0
  const chunks: Buffer[] = []
  for await (const chunk of request) {
    size += chunk.length
    // Cut while reading, not after: a 100 MB body must never sit in memory.
    if (size > MAX_BODY_BYTES) throw new Error('body too large')
    chunks.push(chunk)
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

type Enquiry = { name: string; email: string; message: string }

// Returns the validated enquiry, or why it was turned down. No exception: a badly filled
// form is not a failure of the service.
function validate(payload: unknown): { enquiry: Enquiry } | { rejected: string } {
  if (typeof payload !== 'object' || payload === null) return { rejected: 'unreadable body' }
  const { name, email, message, honeypot } = payload as Record<string, unknown>

  // Hidden field in the form: a human never sees it, a bot fills it. We still answer 204
  // further down, so it never learns it was caught.
  if (typeof honeypot === 'string' && honeypot.trim() !== '') return { rejected: 'honeypot' }

  const fields = { name, email, message }
  for (const [key, value] of Object.entries(fields)) {
    if (typeof value !== 'string' || value.trim() === '') return { rejected: `${key} is missing` }
    if (value.length > MAX_LENGTH[key as keyof typeof MAX_LENGTH]) {
      return { rejected: `${key} is too long` }
    }
  }

  const address = (email as string).trim()
  // Deliberately loose: the only check that matters is whether a reply gets through.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(address)) return { rejected: 'invalid email' }

  return {
    enquiry: {
      name: (name as string).trim(),
      email: address,
      message: (message as string).trim(),
    },
  }
}

async function send(enquiry: Enquiry): Promise<boolean> {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: SENDER,
      to: RECIPIENT,
      // Replying to the notification replies to the visitor, not to ourselves.
      reply_to: enquiry.email,
      subject: `Site : ${enquiry.name}`,
      text: `${enquiry.name} <${enquiry.email}>\n\n${enquiry.message}`,
    }),
  })

  if (!response.ok) {
    console.error('Resend rejected the message:', response.status, await response.text())
    return false
  }
  return true
}

const server = createServer(async (request, response) => {
  if (request.method === 'GET' && request.url === '/health') return reply(response, 204)
  if (request.url !== '/contact') return reply(response, 404)
  if (request.method !== 'POST') return reply(response, 405)

  let payload: unknown
  try {
    payload = await readBody(request)
  } catch {
    return reply(response, 400, { error: 'Message illisible.' })
  }

  const result = validate(payload)
  if ('rejected' in result) {
    // The honeypot answers like a success: the bot leaves happy, the inbox stays clean.
    if (result.rejected === 'honeypot') return reply(response, 204)
    return reply(response, 400, { error: 'Il manque quelque chose, ou un champ est trop long.' })
  }

  // After validation, not before: otherwise five typos in an address are enough to lock a
  // real visitor out for ten minutes.
  if (rateLimited(clientIp(request))) {
    return reply(response, 429, { error: 'Trop de messages envoyés. Réessayez dans dix minutes.' })
  }

  const delivered = await send(result.enquiry)
  if (!delivered) {
    return reply(response, 502, {
      error: 'Le message n’est pas parti. Écrivez directement à contact@nmwstudios.com.',
    })
  }
  return reply(response, 204)
})

server.listen(PORT, () => console.log(`Contact endpoint listening on ${PORT}`))
