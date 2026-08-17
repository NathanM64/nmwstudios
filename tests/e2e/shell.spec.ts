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

test('la bascule de thème persiste après rechargement', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /thème clair/i }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
})

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
    expect(serious, `violations en thème ${theme} : ${JSON.stringify(serious, null, 2)}`).toEqual([])
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
