import { expect, test } from '@playwright/test'
import { pireBandeVide } from './vide'

test.beforeEach(async ({ page }) => {
  await page.goto('/configurateur?membre&cadrage&formation&express&serenite')
  await page.getByTestId('onglet-deroule').click()
})

test('un axe gradué en semaines surmonte les barres', async ({ page }) => {
  await expect(page.getByTestId('deroule-axe')).toBeVisible()
  const graduations = page.getByTestId('deroule-graduation')
  expect(await graduations.count()).toBeGreaterThanOrEqual(3)
})

test('chaque barre porte son nom', async ({ page }) => {
  const noms = page.getByTestId('deroule-nom')
  await expect(noms).toHaveCount(4)
  await expect(noms.nth(0)).toContainText('Cadrage')
})

test('la scène du déroulé remplit son cadre, sans bande vide notable', async ({ page }) => {
  const vide = await page.getByTestId('objet-scene').evaluate(pireBandeVide)
  expect(vide).toBeLessThan(0.25)
})

test('le fantôme de la livraison accélérée reste confiné dans sa piste', async ({ page }) => {
  const piste = await page.getByTestId('deroule-piste').boundingBox()
  const fantome = await page.getByTestId('deroule-fantome').boundingBox()
  expect(fantome!.x + fantome!.width).toBeLessThanOrEqual(piste!.x + piste!.width + 0.5)
})
