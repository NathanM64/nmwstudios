import { readFileSync } from 'node:fs'
import { globSync } from 'node:fs'
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

// Each offer declares a page in content/offers.ts, and the home page rendered the link for one
// of the three only: the other two were reachable from the navigation and nowhere else. Nothing
// failed, the link was simply never printed.
test('every offer links to its own page from the home page', async ({ page }) => {
  await page.goto('/')
  const cards = page.locator('main section:nth-of-type(2) article')
  await expect(cards).toHaveCount(3)

  for (const card of await cards.all()) {
    const title = (await card.getByRole('heading', { level: 3 }).innerText()).toLowerCase()
    await expect(card.getByRole('link', { name: `Comment ça se passe : ${title}` })).toHaveCount(1)
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

  await page.getByLabel('Prénom Nom').fill('Agence Truc')
  await page.getByLabel('Email').fill('directeur@agence.fr')
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

  await page.getByLabel('Prénom Nom').fill('A')
  await page.getByLabel('Email').fill('a@b.fr')
  await page.getByLabel('Ce que vous avez sur les bras').fill('Bonjour')
  await page.getByRole('button', { name: 'Envoyer' }).click()

  // Scoped to the contact block: Next sets its own role="alert" to announce routes.
  await expect(page.locator('#contact').getByRole('alert')).toContainText('contact@nmwstudios.com')
})

// Trois classes mortes en une journée : border-encre/12, border-blanc-vif/15. DESIGN.md nomme
// encore les jetons en français alors que le code est passé en anglais, et Tailwind laisse
// tomber une classe dont le jeton n'existe pas sans rien dire. Le séparateur disparaît, la
// construction réussit, aucun filet ne le voit. Celui-ci lit le CSS réellement produit : une
// classe utilitaire présente dans la source et absente de la feuille n'a pas été comprise.
test('aucune classe utilitaire ne vise un jeton inexistant', () => {
  const source = globSync('{app,components}/**/*.tsx')
    .map((f) => readFileSync(f, 'utf8'))
    .join('\n')
  const css = globSync('out/_next/static/**/*.css')
    .map((f) => readFileSync(f, 'utf8'))
    .join('\n')
  expect(css.length, 'aucun CSS construit, lancer yarn build').toBeGreaterThan(0)

  // Les variantes font partie du sélecteur émis : `lg:border-l` sort en `.lg\:border-l`, et
  // chercher `.border-l` ne le trouverait pas.
  const found = source.matchAll(
    /(?<![\w-])((?:[a-z][a-z0-9-]*:)*)(bg|text|border|from|via|to|fill|stroke|ring|decoration|shadow)-([a-z][a-z0-9-]*(?:\/\d+)?)(?![\w-])/g,
  )
  const utilities = new Set([...found].map((m) => `${m[1]}${m[2]}-${m[3]}`))

  const selector = (u: string) => '.' + u.replace(/[:/]/g, (c) => '\\' + c)
  const orphelines = [...utilities].filter((u) => !css.includes(selector(u)))

  // Le filet doit voir passer une vraie classe morte, sinon il ne prouve rien.
  expect(css.includes(selector('border-ink/12')), 'jeton connu introuvable').toBe(true)
  expect(css.includes(selector('border-encre/12')), 'jeton mort trouvé').toBe(false)

  expect(orphelines, 'classes absentes du CSS produit').toEqual([])
})

// Sans WebGL, le site doit rester exactement celui d'avant. Une refonte du CSS pourrait
// supprimer body::before en croyant qu'il ne sert plus, et personne ne le verrait tant que
// WebGL fonctionne chez celui qui regarde.
test('sans WebGL, le mur CSS tient encore le site', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, ...args: unknown[]) {
      const kind = args[0]
      if (kind === 'webgl' || kind === 'experimental-webgl') return null
      return (original as (...a: unknown[]) => unknown).apply(this, args)
    } as typeof original
  })

  await page.goto('/')

  await expect(page.locator('html.glass-live')).toHaveCount(0)

  const wall = await page.evaluate(() => ({
    field: getComputedStyle(document.body, '::before').backgroundImage,
    grain: getComputedStyle(document.body, '::after').backgroundImage,
    fieldShown: getComputedStyle(document.body, '::before').display,
    grainShown: getComputedStyle(document.body, '::after').display,
  }))

  expect(wall.field).not.toBe('none')
  expect(wall.grain).not.toBe('none')
  expect(wall.fieldShown).not.toBe('none')
  expect(wall.grainShown).not.toBe('none')
})

// Le voile est à 5%, donc très bas. Une texture de mur plus sombre rendrait le texte des
// dalles illisible sans qu'aucun autre filet ne le voie. L'encre vaut #12151a, de luminance
// relative 0,0075 : il faut assez de clair derrière elle pour tenir le 4,5:1 de WCAG 2.2 AA.
test('le texte reste lisible sur une dalle rendue', async ({ page }) => {
  await page.goto('/?probe')
  await page.waitForFunction(() => document.documentElement.classList.contains('glass-live'), {
    timeout: 10_000,
  })
  // Aucune dalle n'est dans le premier écran : sans ce défilement, la sonde n'a rien à lire.
  await page.locator('[data-glass]').first().scrollIntoViewIfNeeded()
  // Le cycle d'arrivée dure 3,5s : avant sa fin, les dalles ne sont pas à leur état final.
  await page.waitForTimeout(4500)

  const measured = await page.evaluate(() => {
    const probe = (window as unknown as { __glassProbe?: () => { min: number } | null }).__glassProbe
    return probe ? probe() : null
  })

  expect(measured, 'la sonde ne trouve aucune dalle rendue à mesurer').not.toBeNull()

  const channel = measured!.min / 255
  const linear = channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  const contrast = (linear + 0.05) / (0.0075 + 0.05)

  expect(contrast, `contraste minimal sous la dalle : ${contrast.toFixed(2)}:1`).toBeGreaterThan(4.5)
})
