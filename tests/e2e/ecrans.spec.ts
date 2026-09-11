import { expect, test } from '@playwright/test'

// Ce que le visiteur voit : le texte est dans le HTML servi, rien n'est coupé, les polices
// sont là, le menu mène quelque part. Pas de test d'animation : ça se regarde.
const ROUTES: Array<[string, string]> = [
  ['/', 'Vous décidez jusqu’où.'],
  ['/ce-que-je-fais/', 'Pas de constructeur de pages'],
  ['/ce-que-je-fais/reprise/', 'Trois conditions : le code source accessible en entier'],
  ['/ce-que-je-fais/hebergement/', 'sauvegardes quotidiennes'],
  ['/comment-je-travaille/', 'Une agence parisienne m’a confié'],
  ['/qui-je-suis/', 'Je ne reprends pas les sites montés sur un constructeur de pages'],
]

test('chaque route porte son texte dans le HTML servi', async ({ request }) => {
  for (const [route, extrait] of ROUTES) {
    const html = await (await request.get(route)).text()
    expect(html, route).toContain(extrait)
  }
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

test('le menu navigue et le retour arrière marche', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('navigation', { name: 'Sections' }).getByRole('link', { name: 'Contact' }).click()
  await expect(page).toHaveURL(/\/contact\/$/)
  await page.goBack()
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Je conçois')
})

test('la liste des offres change le détail sans quitter l’écran', async ({ page }) => {
  await page.goto('/ce-que-je-fais/')
  await page.getByRole('navigation', { name: 'Offres' }).getByRole('link', { name: 'Reprise et maintenance' }).click()
  await expect(page).toHaveURL(/\/ce-que-je-fais\/reprise\/$/)
  await expect(page.locator('.detail h3')).toHaveText('Reprise et maintenance')
})
