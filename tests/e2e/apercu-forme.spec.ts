import { expect, test } from '@playwright/test'

test('la maquette est posée sur le verre comme un objet distinct', async ({ page }) => {
  await page.goto('/configurateur')
  const ombre = await page.getByTestId('objet-scene').evaluate((n) => getComputedStyle(n).boxShadow)
  expect(ombre).not.toBe('none')
})

test('plus aucune infobulle ne subsiste dans le panneau', async ({ page }) => {
  await page.goto('/configurateur')
  await expect(page.getByRole('button', { name: /^Que comprend/ })).toHaveCount(0)
})
