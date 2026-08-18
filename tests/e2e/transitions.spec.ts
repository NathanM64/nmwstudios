import { expect, test } from '@playwright/test'

test('la navigation inter-documents est déclarée', async ({ page }) => {
  await page.goto('/')
  // Règles de haut niveau seulement : celle imbriquée sous `prefers-reduced-motion`
  // contient `navigation: none` et rendrait cette assertion vraie même sans la déclaration réelle.
  const declared = await page.evaluate(() =>
    [...document.styleSheets].some((sheet) => {
      try {
        return [...sheet.cssRules].some((rule) => /navigation:\s*auto/.test(rule.cssText))
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

test('le mouvement réduit neutralise les animations', async ({ browser }) => {
  // `test.use({ reducedMotion })` est sans effet sur cette version ; le contexte manuel
  // fonctionne, à condition de lui passer le `baseURL` qu'il n'hérite pas.
  const context = await browser.newContext({
    reducedMotion: 'reduce',
    baseURL: 'http://127.0.0.1:3100',
  })

  try {
    const page = await context.newPage()
    await page.goto('/')

    expect(
      await page.evaluate(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    ).toBe(true)

    const duree = await page
      .getByRole('link', { name: 'Travail' })
      .evaluate((element) => parseFloat(getComputedStyle(element).transitionDuration))
    expect(duree).toBeLessThan(0.001)

    await page.getByRole('link', { name: 'Agence' }).click()
    await expect(page).toHaveURL('/agences')
  } finally {
    await context.close()
  }
})
