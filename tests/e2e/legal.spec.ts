import { expect, test } from '@playwright/test'

test('les deux pages légales sont servies', async ({ page }) => {
  for (const [url, titre] of [
    ['/mentions-legales', /mentions légales/i],
    ['/confidentialite', /confidentialité/i],
  ] as const) {
    await page.goto(url)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(titre)
  }
})

test('le pied de page renvoie vers les deux pages depuis les deux portes', async ({ page }) => {
  for (const url of ['/', '/agences']) {
    await page.goto(url)
    await expect(page.getByRole('link', { name: /mentions légales/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /confidentialité/i })).toBeVisible()
  }
})

test('le lien Accueil du pied de page ramène depuis les mentions légales', async ({ page }) => {
  await page.goto('/mentions-legales')
  await page.getByRole('link', { name: 'Accueil' }).click()
  await expect(page).toHaveURL('/')
})
