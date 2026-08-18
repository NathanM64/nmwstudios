import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

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
test('aucune violation axe sérieuse dans les deux thèmes', async ({ page }) => {
  for (const theme of ['dark', 'light'] as const) {
    await page.goto('/')
    await page.evaluate((t) => {
      document.documentElement.dataset.theme = t
    }, theme)
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()
    const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
    const contrasteIncomplet = results.incomplete.filter((v) => v.id === 'color-contrast')
    expect(
      serious,
      `violations en thème ${theme} : ${JSON.stringify(serious, null, 2)}\n` +
        `color-contrast incomplete (non jugé par axe) en thème ${theme} : ${JSON.stringify(contrasteIncomplet, null, 2)}`
    ).toEqual([])
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
test('la page d’accueil précharge ses polices dans le HTML servi', async ({ request }) => {
  const accueil = await (await request.get('/')).text()
  const agences = await (await request.get('/agences')).text()
  expect(agences).toContain('as="font"')
  expect(accueil).toContain('as="font"')
})
