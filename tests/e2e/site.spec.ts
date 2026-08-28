import { expect, test } from '@playwright/test'

const PAGES = ['/', '/renfort/', '/projet-complet/', '/reprise-et-maintenance/', '/mentions-legales/']

// The site no longer sells the absence of third parties to the reader, but the legal notice
// states it and the Caddyfile CSP enforces it. An added dependency would break both silently.
test('no third party request, no cookie', async ({ page, context }) => {
  const external: string[] = []
  page.on('request', (request) => {
    const url = new URL(request.url())
    if (url.hostname !== '127.0.0.1' && url.hostname !== 'localhost' && url.protocol !== 'data:') {
      external.push(request.url())
    }
  })

  for (const path of PAGES) {
    await page.goto(path, { waitUntil: 'networkidle' })
  }

  expect(external).toEqual([])
  expect(await context.cookies()).toEqual([])
})

// Analytics hosted on the same domain would be neither a third party request nor a cookie: the
// net above would not see it, and the legal notice would quietly become false. This one sees it.
// When it breaks, it is the "Données personnelles" paragraph to rewrite, not the test.
test('no script outside the Next bundle', async ({ page }) => {
  await page.goto('/', { waitUntil: 'load' })

  const paths = await page.evaluate(() =>
    [...document.querySelectorAll('script[src]')].map(
      (tag) => new URL((tag as HTMLScriptElement).src).pathname,
    ),
  )

  expect(paths.length).toBeGreaterThan(0)
  for (const path of paths) expect(path).toMatch(/^\/_next\/static\//)
})

// Replayed from the previous rebuild: next/font variables go on <html>, and on <body> the font
// was never applied with nothing to signal it. The test reads the computed family then hands it
// to document.fonts.check, because next/font renames the families.
test('the site fonts are actually applied', async ({ page }) => {
  await page.goto('/')

  const fonts = await page.evaluate(async () => {
    await document.fonts.ready
    const first = (list: string) => list.split(',')[0].trim().replace(/^["']|["']$/g, '')
    const heading = first(getComputedStyle(document.querySelector('h1')!).fontFamily)
    const body = first(getComputedStyle(document.body).fontFamily)
    return {
      heading,
      body,
      headingLoaded: document.fonts.check(`700 32px "${heading}"`),
      bodyLoaded: document.fonts.check(`16px "${body}"`),
    }
  })

  expect(fonts.heading).toContain('Schibsted')
  expect(fonts.body).toContain('Hanken')
  expect(fonts.headingLoaded).toBe(true)
  expect(fonts.bodyLoaded).toBe(true)
})

test('the two pages answer each other', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText("n’ont pas d’équipe")

  await page.getByRole('link', { name: 'Reprise et maintenance', exact: true }).first().click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('tout est à refaire')
})

// The three links in the proof section point at anchors on the other page: a renamed id breaks
// them silently.
test('the anchors linked from the home page exist', async ({ page }) => {
  await page.goto('/')
  const anchors = await page
    .locator('a[href*="/reprise-et-maintenance/#"]')
    .evaluateAll((links) => links.map((l) => (l as HTMLAnchorElement).hash.slice(1)))
  expect(anchors.length).toBeGreaterThan(0)

  await page.goto('/reprise-et-maintenance/')
  for (const anchor of anchors) {
    await expect(page.locator(`#${anchor}`)).toHaveCount(1)
  }
})

// The layout canonical is '/' for everyone: a new page that forgets to restate it declares
// itself a copy of the home page, and og:url goes with it. Nothing else would say so.
test('each page declares its own address', async ({ page }) => {
  for (const path of PAGES) {
    await page.goto(path)
    const head = await page.evaluate(() => ({
      canonical: document.querySelector('link[rel=canonical]')?.getAttribute('href'),
      ogUrl: document.querySelector('meta[property="og:url"]')?.getAttribute('content'),
      schemas: [...document.querySelectorAll('script[type="application/ld+json"]')].map(
        (tag) => tag.textContent ?? '',
      ),
    }))

    expect(head.canonical, path).toBe(`https://nmwstudios.com${path}`)
    expect(head.ogUrl, path).toBe(head.canonical)
    expect(head.schemas.length, path).toBeGreaterThan(0)
    for (const schema of head.schemas) expect(() => JSON.parse(schema)).not.toThrow()
  }
})

// The form is the site's only conversion path now that it replaces the bare mailto. A malformed
// payload or a swallowed error would show up nowhere else.
test('the form posts what it should and says what happens', async ({ page }) => {
  await page.goto('/')

  let payload: Record<string, string> | null = null
  await page.route('**/api/contact', async (route) => {
    payload = route.request().postDataJSON()
    await route.fulfill({ status: 204 })
  })

  await page.getByLabel('Votre nom').fill('Agence Truc')
  await page.getByLabel('Votre adresse').fill('directeur@agence.fr')
  await page.getByLabel('Ce que vous avez sur les bras').fill('Un Symfony 4 que personne ne veut.')
  await page.getByRole('button', { name: 'Envoyer' }).click()

  await expect(page.getByRole('status')).toContainText('C’est parti')
  expect(payload).toEqual({
    name: 'Agence Truc',
    email: 'directeur@agence.fr',
    message: 'Un Symfony 4 que personne ne veut.',
    honeypot: '',
  })
})

// A failed send has to leave a way out, not a mute form.
test('a failed send points back to the mail address', async ({ page }) => {
  await page.goto('/')
  await page.route('**/api/contact', (route) => route.fulfill({ status: 502, json: {} }))

  await page.getByLabel('Votre nom').fill('A')
  await page.getByLabel('Votre adresse').fill('a@b.fr')
  await page.getByLabel('Ce que vous avez sur les bras').fill('Bonjour')
  await page.getByRole('button', { name: 'Envoyer' }).click()

  // Scoped to the contact block: Next sets its own role="alert" to announce routes.
  await expect(page.locator('#contact').getByRole('alert')).toContainText('contact@nmwstudios.com')
})
