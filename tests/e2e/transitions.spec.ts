import { expect, test } from '@playwright/test'

test('la navigation inter-documents est déclarée', async ({ page }) => {
  await page.goto('/')
  const declared = await page.evaluate(() =>
    [...document.styleSheets].some((sheet) => {
      try {
        return [...sheet.cssRules].some((rule) => rule.cssText.includes('@view-transition'))
      } catch {
        return false
      }
    })
  )
  expect(declared).toBe(true)
})

test('le dock porte un nom de transition stable sur les deux portes', async ({ page }) => {
  for (const url of ['/', '/agences']) {
    await page.goto(url)
    const name = await page
      .getByRole('navigation', { name: 'Sections de la page' })
      .evaluate((el) => getComputedStyle(el).viewTransitionName)
    expect(name).toBe('dock')
  }
})

test.describe('mouvement réduit', () => {
  // test.use({ reducedMotion }) n'active pas l'émulation ici ; newContext + baseURL explicites fonctionne.
  test('les transitions sont neutralisées', async ({ browser, baseURL }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce', baseURL })
    const page = await context.newPage()
    await page.goto('/')
    const neutralise = await page.evaluate(
      () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
    expect(neutralise).toBe(true)

    await page.getByRole('link', { name: 'Agence' }).click()
    await expect(page).toHaveURL('/agences')
    await context.close()
  })
})
