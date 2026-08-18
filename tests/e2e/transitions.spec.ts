import { expect, test } from '@playwright/test'

test('aucune transition de vue n’est déclarée', async ({ page }) => {
  await page.goto('/')
  // Décision du 18/08/2026 : la transition de vue superposait les surfaces de verre
  // en un rectangle clair, mesuré et non corrigeable en CSS. Le verre prime.
  const declaree = await page.evaluate(() =>
    [...document.styleSheets].some((feuille) => {
      try {
        return [...feuille.cssRules].some((regle) => /@view-transition/.test(regle.cssText))
      } catch {
        return false
      }
    })
  )
  expect(declaree).toBe(false)
})

test('aucun panneau ne porte de nom de transition', async ({ page }) => {
  for (const url of ['/', '/agences']) {
    await page.goto(url)
    const noms = await page.evaluate(() =>
      [...document.querySelectorAll('*')]
        .map((el) => getComputedStyle(el).viewTransitionName)
        // `root` est posé d'office par le navigateur sur la racine, pas par nous.
        .filter((n) => n && n !== 'none' && n !== 'root')
    )
    expect(noms).toEqual([])
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
