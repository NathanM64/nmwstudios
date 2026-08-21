import { expect, test } from '@playwright/test'
import { pireBandeVide } from './vide'

test('le compteur de contrôles domine la scène', async ({ page }) => {
  await page.goto('/configurateur?seo&perf')
  const score = await page.getByTestId('preuve-score').evaluate((n) => parseFloat(getComputedStyle(n).fontSize))
  const ligne = await page
    .getByTestId('preuve-ligne')
    .first()
    .evaluate((n) => parseFloat(getComputedStyle(n).fontSize))
  expect(score).toBeGreaterThan(ligne * 2.5)
})

test('les lignes retenues portent l’accent du style, les autres restent lisibles', async ({ page }) => {
  await page.goto('/configurateur?seo')
  const retenue = page.getByTestId('preuve-ligne').filter({ hasText: 'résultats' })
  await expect(retenue).toHaveAttribute('data-retenu', 'oui')
  const opacite = await page
    .getByTestId('preuve-ligne')
    .last()
    .evaluate((n) => parseFloat(getComputedStyle(n).opacity))
  expect(opacite).toBeGreaterThanOrEqual(0.7)
})

test('la scène de la preuve remplit son cadre, sans bande vide notable', async ({ page }) => {
  await page.goto('/configurateur?seo&perf&rgpd')
  const vide = await page.getByTestId('partie-preuve').evaluate(pireBandeVide)
  expect(vide).toBeLessThan(0.25)
})
