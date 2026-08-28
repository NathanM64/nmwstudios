import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'

// Un seul travail : recevoir le formulaire de contact du site et le poster à Resend.
// Zéro dépendance npm, donc rien à auditer d'autre que ce fichier, et rien à mettre à jour
// côté sécurité. node:http et fetch suffisent depuis Node 18.

const CLE = process.env.RESEND_API_KEY
const DESTINATAIRE = process.env.CONTACT_DESTINATAIRE ?? 'contact@nmwstudios.com'
// Adresse du domaine vérifié chez Resend. L'expéditeur ne peut pas être le visiteur :
// Resend refuserait un domaine qu'il ne contrôle pas, et ce serait de l'usurpation.
const EXPEDITEUR = process.env.CONTACT_EXPEDITEUR ?? 'Site NMW Studios <contact@nmwstudios.com>'
const PORT = Number(process.env.PORT ?? 8080)

if (!CLE) {
  console.error('RESEND_API_KEY manquante : le service refuse de démarrer plutôt que d’avaler les messages.')
  process.exit(1)
}

const LIMITES = { nom: 120, email: 200, message: 5000 }
const CORPS_MAX = 16_000

// Fenêtre glissante en mémoire. Une seule réplique, donc pas de partage à prévoir, et un
// redémarrage qui remet le compteur à zéro n'a pas de conséquence à ce volume.
const FENETRE_MS = 10 * 60 * 1000
const MAX_PAR_FENETRE = 5
const envois = new Map<string, number[]>()

function tropDeMessages(ip: string): boolean {
  const maintenant = Date.now()
  const recents = (envois.get(ip) ?? []).filter((t) => maintenant - t < FENETRE_MS)
  envois.set(ip, recents)
  if (recents.length >= MAX_PAR_FENETRE) return true
  recents.push(maintenant)
  return false
}

// Traefik est le seul à parler au service : on lit son en-tête plutôt que l'adresse de la
// socket, qui serait celle du proxy pour tout le monde.
function adresse(requete: IncomingMessage): string {
  const transmis = requete.headers['x-forwarded-for']
  const brut = Array.isArray(transmis) ? transmis[0] : transmis
  return brut?.split(',')[0]?.trim() || requete.socket.remoteAddress || 'inconnue'
}

function repond(reponse: ServerResponse, code: number, corps?: Record<string, string>) {
  if (!corps) return reponse.writeHead(code).end()
  const charge = JSON.stringify(corps)
  reponse.writeHead(code, { 'content-type': 'application/json; charset=utf-8' }).end(charge)
}

async function lireCorps(requete: IncomingMessage): Promise<unknown> {
  let taille = 0
  const morceaux: Buffer[] = []
  for await (const morceau of requete) {
    taille += morceau.length
    // Couper à la lecture, pas après : un corps de 100 Mo ne doit jamais tenir en mémoire.
    if (taille > CORPS_MAX) throw new Error('corps trop long')
    morceaux.push(morceau)
  }
  return JSON.parse(Buffer.concat(morceaux).toString('utf8'))
}

type Message = { nom: string; email: string; message: string }

// Renvoie le message validé, ou la raison du refus. Pas d'exception : un formulaire mal
// rempli n'est pas une erreur du service.
function valide(charge: unknown): { message: Message } | { refus: string } {
  if (typeof charge !== 'object' || charge === null) return { refus: 'corps illisible' }
  const { nom, email, message, piege } = charge as Record<string, unknown>

  // Champ caché du formulaire : un humain ne le voit pas, un robot le remplit. On répond 204
  // quand même, plus haut, pour ne pas lui apprendre qu'il a été repéré.
  if (typeof piege === 'string' && piege.trim() !== '') return { refus: 'piège' }

  for (const [cle, valeur] of Object.entries({ nom, email, message })) {
    if (typeof valeur !== 'string' || valeur.trim() === '') return { refus: `${cle} manquant` }
    if (valeur.length > LIMITES[cle as keyof typeof LIMITES]) return { refus: `${cle} trop long` }
  }

  const adresseMail = (email as string).trim()
  // Volontairement laxiste : la seule validation qui compte est qu'un mail parte et revienne.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(adresseMail)) return { refus: 'email invalide' }

  return {
    message: {
      nom: (nom as string).trim(),
      email: adresseMail,
      message: (message as string).trim(),
    },
  }
}

async function envoie(message: Message): Promise<boolean> {
  const reponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${CLE}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: EXPEDITEUR,
      to: DESTINATAIRE,
      // Répondre au message répond au visiteur, pas à soi-même.
      reply_to: message.email,
      subject: `Site : ${message.nom}`,
      text: `${message.nom} <${message.email}>\n\n${message.message}`,
    }),
  })

  if (!reponse.ok) {
    console.error('Resend a refusé le message :', reponse.status, await reponse.text())
    return false
  }
  return true
}

const serveur = createServer(async (requete, reponse) => {
  if (requete.method === 'GET' && requete.url === '/sante') return repond(reponse, 204)
  if (requete.url !== '/contact') return repond(reponse, 404)
  if (requete.method !== 'POST') return repond(reponse, 405)

  let charge: unknown
  try {
    charge = await lireCorps(requete)
  } catch {
    return repond(reponse, 400, { erreur: 'Message illisible.' })
  }

  const resultat = valide(charge)
  if ('refus' in resultat) {
    // Le piège répond comme un succès : le robot repart content, la boîte reste vide.
    if (resultat.refus === 'piège') return repond(reponse, 204)
    return repond(reponse, 400, { erreur: 'Il manque quelque chose, ou un champ est trop long.' })
  }

  // Après la validation, pas avant : sinon cinq fautes de frappe dans son adresse suffisent
  // à bloquer un vrai visiteur pendant dix minutes.
  if (tropDeMessages(adresse(requete))) {
    return repond(reponse, 429, { erreur: 'Trop de messages envoyés. Réessayez dans dix minutes.' })
  }

  const parti = await envoie(resultat.message)
  if (!parti) {
    return repond(reponse, 502, {
      erreur: 'Le message n’est pas parti. Écrivez directement à contact@nmwstudios.com.',
    })
  }
  return repond(reponse, 204)
})

serveur.listen(PORT, () => console.log(`Contact à l’écoute sur ${PORT}`))
