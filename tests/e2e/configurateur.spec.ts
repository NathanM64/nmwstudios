import { expect, test } from '@playwright/test'

test('la route du configurateur répond et s’annonce', async ({ page }) => {
  await page.goto('/configurateur')
  await expect(page.getByRole('heading', { level: 1, name: /configurez votre site/i })).toBeVisible()
})

test('l’aperçu est étiqueté comme une démonstration', async ({ page }) => {
  await page.goto('/configurateur')
  await expect(page.getByText('aperçu, pas votre futur site')).toBeVisible()
})

test('cocher une option la retient', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByRole('checkbox', { name: 'Un blog' }).check()
  await expect(page.getByRole('checkbox', { name: 'Un blog' })).toBeChecked()
})

test('le socle est affiché mais ne se décoche pas', async ({ page }) => {
  await page.goto('/configurateur')
  await expect(page.getByText('1 à 3 pages, formulaire de contact')).toBeVisible()
  await expect(page.getByRole('checkbox', { name: /1 à 3 pages/ })).toHaveCount(0)
})

test('le pas-à-pas incrémente une option quantifiable', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByRole('button', { name: 'Ajouter 3 pages de plus' }).click()
  await page.getByRole('button', { name: 'Ajouter 3 pages de plus' }).click()
  await expect(page.getByTestId('quantite-pages')).toHaveText('2')
})

test('le pas-à-pas ne descend pas sous zéro', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByRole('button', { name: 'Retirer 3 pages de plus' }).click()
  await expect(page.getByTestId('quantite-pages')).toHaveText('0')
})

test('les formules récurrentes s’excluent mutuellement', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByRole('radio', { name: 'Essentiel' }).check()
  await page.getByRole('radio', { name: 'Sérénité' }).check()
  await expect(page.getByRole('radio', { name: 'Essentiel' })).not.toBeChecked()
  await expect(page.getByRole('radio', { name: 'Sérénité' })).toBeChecked()
})
