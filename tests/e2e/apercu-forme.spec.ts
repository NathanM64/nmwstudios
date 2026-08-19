import { expect, test } from '@playwright/test'
import { SCENES } from '../../lib/config/scenes'

test('les onglets sont posés à l’intérieur de l’aperçu', async ({ page }) => {
  await page.goto('/configurateur')
  for (const scene of SCENES) {
    await expect(page.getByTestId('apercu').getByTestId(`onglet-${scene.id}`)).toBeVisible()
  }
})

test('l’onglet actif est annoncé aux technologies d’assistance', async ({ page }) => {
  await page.goto('/configurateur')
  await expect(page.getByTestId('onglet-site')).toHaveAttribute('aria-pressed', 'true')
  await page.getByTestId('onglet-preuve').click()
  await expect(page.getByTestId('onglet-preuve')).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByTestId('onglet-site')).toHaveAttribute('aria-pressed', 'false')
})

test('la maquette est posée sur le verre comme un objet distinct', async ({ page }) => {
  await page.goto('/configurateur')
  const ombre = await page.getByTestId('objet-scene').evaluate((n) => getComputedStyle(n).boxShadow)
  expect(ombre).not.toBe('none')
})

test('plus aucune infobulle ne subsiste dans le panneau', async ({ page }) => {
  await page.goto('/configurateur')
  await expect(page.getByRole('button', { name: /^Que comprend/ })).toHaveCount(0)
})
