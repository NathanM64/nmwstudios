import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { STYLES, STYLE_DEFAUT } from '../../lib/config/styles'
import { SCENES } from '../../lib/config/scenes'
import { amenerLaPartie } from './fenetre'

// `animate-apparait` fait entrer les scènes en fondu : axe lu pendant le fondu mesure une
// opacité transitoire et rapporte un contraste qui n'existe à aucun moment stable.
async function fonduTermine(page: Page) {
  await page.waitForFunction(() =>
    [...document.querySelectorAll('.animate-apparait')].every((el) => getComputedStyle(el).opacity === '1')
  )
}

test('le thème sombre est posé avant le premier rendu', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
})

test('le cookie impose le thème clair dès la première image', async ({ page, context }) => {
  await context.addCookies([
    { name: 'nmw-theme', value: 'light', domain: '127.0.0.1', path: '/' },
  ])
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
})

test('le jeton --color-canvas calculé correspond au thème posé', async ({ page, context }) => {
  await page.goto('/')
  const sombre = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--color-canvas').trim()
  )
  expect(sombre).toBe('#0a0a0f')

  await context.addCookies([
    { name: 'nmw-theme', value: 'light', domain: '127.0.0.1', path: '/' },
  ])
  await page.goto('/')
  const clair = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--color-canvas').trim()
  )
  expect(clair).toBe('#f6f7fb')
})

test('la bascule de thème persiste après rechargement', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /changer de thème/i }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
})

// axe ne juge pas le contraste par-dessus l'ambiance dégradée (background gradient) ; cette couverture vient des tests de jetons (tests/unit/tokens-*.test.ts).
// Le configurateur y figure : la maquette est un fond plein, donc axe y juge bien le contraste.
for (const chemin of ['/', '/configurateur']) {
  test(`aucune violation axe sérieuse sur ${chemin} dans les deux thèmes`, async ({ page }) => {
    for (const theme of ['dark', 'light'] as const) {
      await page.goto(chemin)
      await page.evaluate((t) => {
        document.documentElement.dataset.theme = t
      }, theme)
      await fonduTermine(page)
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze()
      const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
      const contrasteIncomplet = results.incomplete.filter((v) => v.id === 'color-contrast')
      expect(
        serious,
        `violations sur ${chemin} en thème ${theme} : ${JSON.stringify(serious, null, 2)}\n` +
          `color-contrast incomplete (non jugé par axe) en thème ${theme} : ${JSON.stringify(contrasteIncomplet, null, 2)}`
      ).toEqual([])
    }
  })
}

// Les trois scènes coexistent, mais `inert` retire du balayage celles qui sont hors de la
// fenêtre : sans cette passe, deux tiers du catalogue y échapperaient, dont « La preuve ».
test('aucune violation axe sérieuse sur les trois scènes de l’aperçu, tout coché', async ({ page }) => {
  const toutCoche =
    '/configurateur?pages=4&langue=3&redaction=15&reprise&photos&visuels&blog&article=10&membre&formulaire&rdv&newsletter&paiement&seo&seo-local&perf&a11y&rgpd&legal&migration&domaine&cadrage&formation&express&partenaire'
  for (const theme of ['dark', 'light'] as const) {
    for (const scene of SCENES) {
      await page.goto(toutCoche)
      await page.evaluate((t) => {
        document.documentElement.dataset.theme = t
      }, theme)
      await amenerLaPartie(page, scene.id)
      await fonduTermine(page)
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
      const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
      expect(serious, `scène ${scene.id} en thème ${theme} : ${JSON.stringify(serious, null, 2)}`).toEqual([])
    }
  }
})

// Le test ci-dessus ne voit que la direction par défaut. Les quatre autres n'étaient gardées que
// par un filet unitaire sur le fond nu, qui a laissé passer une sourdine à 4,06 sur un jeton le
// 21/08/2026. Ici c'est la page qui juge, sur les paires réellement peintes.
test('aucune violation axe sérieuse dans les quatre directions non par défaut', async ({ page }) => {
  const toutCoche =
    '/configurateur?pages=4&langue=3&redaction=15&reprise&photos&visuels&blog&article=10&membre&formulaire&rdv&newsletter&paiement&seo&seo-local&perf&a11y&rgpd&legal&migration&domaine&cadrage&formation&express&partenaire'
  for (const style of STYLES.filter((s) => s.id !== STYLE_DEFAUT)) {
    for (const scene of SCENES) {
      await page.goto(toutCoche)
      await page.getByTestId('selecteur-style').selectOption(style.id)
      await amenerLaPartie(page, scene.id)
      await fonduTermine(page)
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
      const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
      expect(serious, `${style.id} sur ${scene.id} : ${JSON.stringify(serious, null, 2)}`).toEqual([])
    }
  }
})

// Le rapport s'ouvre avec ses huit lignes grisées : c'est l'état par défaut qui est passé
// sous le seuil de contraste, pas un état coché.
test('aucune violation axe sérieuse sur « La preuve » sans rien cocher', async ({ page }) => {
  for (const theme of ['dark', 'light'] as const) {
    await page.goto('/configurateur')
    await page.evaluate((t) => {
      document.documentElement.dataset.theme = t
    }, theme)
    await amenerLaPartie(page, 'preuve')
    await fonduTermine(page)
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
    const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
    expect(serious, `« La preuve » vide en thème ${theme} : ${JSON.stringify(serious, null, 2)}`).toEqual([])
  }
})

// Le volet d'un sélecteur est rendu dans un portail, hors de l'arbre du configurateur :
// les passes axe ci-dessus ne le voient jamais ouvert.
test('aucune violation axe sérieuse quand le volet d’un sélecteur est ouvert', async ({ page }) => {
  for (const theme of ['dark', 'light'] as const) {
    await page.goto('/configurateur')
    await page.evaluate((t) => {
      document.documentElement.dataset.theme = t
    }, theme)
    await page.getByTestId('selecteur-domaine-declencheur').click()
    await expect(page.getByTestId('selecteur-domaine-volet')).toBeVisible()
    await fonduTermine(page)
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
    const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
    expect(serious, `volet ouvert en thème ${theme} : ${JSON.stringify(serious, null, 2)}`).toEqual([])
  }
})

test('la page se charge sans erreur ni avertissement de console', async ({ page }) => {
  const bruit: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') {
      bruit.push(`${message.type()} : ${message.text()}`)
    }
  })
  page.on('pageerror', (erreur) => bruit.push(`pageerror : ${erreur.message}`))

  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

  expect(bruit, bruit.join('\n')).toEqual([])
})

test.describe('préférence système claire', () => {
  test.use({ colorScheme: 'light' })

  test("le thème clair est posé sans cookie quand le système le demande", async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  })
})

// Mesuré sur le HTML servi, pas sur le DOM : Next injecte des préchargements
// après hydratation, trop tard pour le premier rendu.
test('la page d’accueil précharge ses polices dans le <head>, pas ailleurs dans le flux', async ({ request }) => {
  // Le bug d'origine émettait le préchargement dans le flux : on isole le <head> pour ne pas le manquer.
  const tete = async (chemin: string) => {
    const html = await (await request.get(chemin)).text()
    return /<head[^>]*>([\s\S]*?)<\/head>/i.exec(html)?.[1] ?? ''
  }
  expect(await tete('/agences')).toContain('as="font"')
  expect(await tete('/')).toContain('as="font"')
})

test('la police du site est réellement appliquée, pas celle de secours', async ({ page }) => {
  await page.goto('/')
  const police = await page.evaluate(() => getComputedStyle(document.body).fontFamily)
  expect(police).toContain('Manrope')
  expect(await page.evaluate(() => document.fonts.check('16px Manrope'))).toBe(true)
})
