import { expect, test } from '@playwright/test'

// Ce que le visiteur voit : le texte est dans le HTML servi, rien n'est coupé, les polices
// sont là, le menu mène quelque part. Pas de test d'animation : ça se regarde.
const ROUTES: Array<[string, string]> = [
  ['/', 'Vous décidez jusqu’où.'],
  ['/ce-que-je-fais/', 'Données de démonstration'],
  ['/ce-que-je-fais/reprise/', 'Le code source, accessible en entier'],
  ['/ce-que-je-fais/sites/', 'À partir de 1 500 €'],
  ['/ce-que-je-fais/hebergement/', 'une sauvegarde chaque nuit'],
  ['/comment-je-travaille/', 'une agence parisienne me confie'],
  ['/comment-je-travaille/ce-que-je-ne-fais-pas/', 'Les applications mobiles natives'],
  ['/qui-je-suis/', 'Vous êtes seul'],
  ['/contact/', 'Un message suffit'],
  ['/mentions-legales/', 'Hetzner Online GmbH'],
]

test('chaque route porte son texte dans le HTML servi', async ({ request }) => {
  for (const [route, extrait] of ROUTES) {
    const html = await (await request.get(route)).text()
    expect(html, route).toContain(extrait)
  }
})

test('chaque écran porte son fond dans le HTML et le fichier est servi', async ({ request }) => {
  const attendus: Array<[string, string]> = [['/', 'eau'], ['/ce-que-je-fais/sites/', 'soie'], ['/comment-je-travaille/', 'verre'], ['/qui-je-suis/', 'ardoise'], ['/contact/', 'pluie']]
  for (const [route, matiere] of attendus) {
    const html = await (await request.get(route)).text()
    expect(html, route).toContain(`data-matiere="${matiere}"`)
    expect((await request.get(`/fonds/${matiere}.webp`)).status(), matiere).toBe(200)
  }
  expect(await (await request.get('/mentions-legales/')).text()).not.toContain('class="fond"')
})

test('le fond s’affiche au premier chargement, image déjà en cache ou non', async ({ page }) => {
  await page.goto('/comment-je-travaille/')
  await expect(page.locator('.fond[data-pret]')).toHaveCount(1)
  await expect(page.locator('.fond img')).toHaveCSS('opacity', /^0\.[1-9]/)
})

test('sur mobile, les onglets restent en bas du cadre et ne couvrent pas le titre', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/comment-je-travaille/')
  const [titre, onglets] = await Promise.all([page.locator('h1').boundingBox(), page.locator('.onglets').boundingBox()])
  expect(onglets!.y).toBeGreaterThan(titre!.y + titre!.height)
})

test('la mer bouge sur bureau, pas sur mobile', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await expect(page.locator('.fond video')).toHaveCount(1)
  await expect(page.locator('.fond[data-video]')).toHaveCount(1, { timeout: 15000 })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.waitForTimeout(500)
  await expect(page.locator('.fond video')).toHaveCount(0)
})

test('les icônes ont une adresse fixe et répondent', async ({ request }) => {
  const html = await (await request.get('/')).text()
  expect(html).toContain('<link rel="icon" href="/favicon.ico"')
  for (const p of ['/favicon.ico', '/icon-192.png', '/icon.svg', '/apple-touch-icon.png']) expect((await request.get(p)).status(), p).toBe(200)
})

test('le lien partagé montre une image', async ({ request }) => {
  const html = await (await request.get('/')).text()
  const image = html.match(/property="og:image" content="([^"]+)"/)?.[1]
  expect(image, 'og:image absent').toBeTruthy()
  expect((await request.get(new URL(image!).pathname)).status()).toBe(200)
})

test('rien ne déborde du cadre à 1440 × 900', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  for (const [route] of ROUTES) {
    await page.goto(route)
    const mesure = await page.evaluate(() => {
      const inner = document.querySelector('.inner, .document') as HTMLElement
      return { deborde: inner.scrollHeight > inner.clientHeight + 1, page: document.documentElement.scrollHeight > innerHeight }
    })
    expect(mesure, route).toEqual({ deborde: false, page: false })
  }
})

test('sous 720 px, rien ne déborde en largeur et l’écran défile en lui même', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  for (const [route] of ROUTES) {
    await page.goto(route)
    const large = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)
    expect(large, route).toBe(false)
  }
})

test('les polices sont réellement chargées', async ({ page }) => {
  await page.goto('/')
  // next/font renomme les familles (__Inter_xxx) : on lit la famille calculée, on vérifie
  // qu'elle est déclarée (sinon check() répond true pour une famille inconnue) et chargée.
  const polices = await page.evaluate(async () => {
    await document.fonts.ready
    const sansGuillemets = (s: string) => s.replace(/["']/g, '').trim()
    const premiere = (el: Element) => sansGuillemets(getComputedStyle(el).fontFamily.split(',')[0])
    const corps = premiere(document.body)
    const titre = premiere(document.querySelector('h1')!)
    const connues = [...document.fonts].map((f) => sansGuillemets(f.family))
    return { corps, titre, connues, chargees: [document.fonts.check(`16px "${corps}"`), document.fonts.check(`16px "${titre}"`)] }
  })
  expect(polices.connues, 'la variable --font-inter est vide').toContain(polices.corps)
  expect(polices.connues, 'la variable --font-space-grotesk est vide').toContain(polices.titre)
  expect(polices.chargees).toEqual([true, true])
})

test('le formulaire glisse l’adresse du site dans le message et confirme à la place des champs', async ({ page }) => {
  await page.goto('/contact/')
  let corps: Record<string, string> = {}
  await page.route('**/api/contact', async (route) => {
    corps = route.request().postDataJSON() as Record<string, string>
    await route.fulfill({ status: 204 })
  })
  await page.getByLabel('Votre nom').fill('Test')
  await page.getByLabel('Votre email').fill('test@example.com')
  await page.getByLabel(/L’adresse de votre site/).fill('https://exemple.fr')
  await page.getByLabel(/Votre téléphone/).fill('06 00 00 00 00')
  await page.getByLabel('Votre projet, en quelques lignes').fill('Un site à reprendre.')
  await page.getByRole('button', { name: 'Envoyer' }).click()
  await expect(page.getByRole('status')).toContainText('Message envoyé')
  expect(corps.message).toBe('Site : https://exemple.fr\nTéléphone : 06 00 00 00 00\n\nUn site à reprendre.')
  await expect(page.locator('form.contact')).toHaveCount(0)
})

test('le menu navigue et le retour arrière marche', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('navigation', { name: 'Sections' }).getByRole('link', { name: 'Contact' }).click()
  await expect(page).toHaveURL(/\/contact\/$/)
  await page.goBack()
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Je conçois')
})

test('une carte fermée s’ouvre sans quitter l’écran, et l’ancienne se referme', async ({ page }) => {
  await page.goto('/ce-que-je-fais/')
  await expect(page.locator('.carte.ouverte h2')).toHaveText('Une application, un outil interne, un premier produit')
  await expect(page.locator('.carrousel .vues img')).toHaveCount(3)
  await page.getByRole('navigation', { name: 'Ce que je fais' }).getByRole('link', { name: /Un site vitrine/ }).click()
  await expect(page).toHaveURL(/\/ce-que-je-fais\/sites\/$/)
  await expect(page.locator('.carte.ouverte h1')).toHaveText('Un site vitrine ou une page de campagne')
  await expect(page.locator('a.carte')).toHaveCount(4)
})
