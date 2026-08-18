import { expect, test } from '@playwright/test'

test('le titre du groupe reste visible pendant le parcours de ses options', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/configurateur')

  const legende = page.getByTestId('legende-fonctionnel')
  await page.getByTestId('carte-membre').scrollIntoViewIfNeeded()
  await expect(legende).toBeInViewport()
})

test('le prix du socle se distingue typographiquement du delta d’une option', async ({ page }) => {
  await page.goto('/configurateur')
  const socle = page.getByTestId('carte-socle').locator('.font-mono')
  const blog = page.getByTestId('carte-blog').locator('.font-mono')

  const tailleSocle = await socle.evaluate((n) => parseFloat(getComputedStyle(n).fontSize))
  const tailleBlog = await blog.evaluate((n) => parseFloat(getComputedStyle(n).fontSize))
  expect(tailleSocle).toBeGreaterThan(tailleBlog)
})

test('le total de la barre domine tous les prix d’option', async ({ page }) => {
  await page.goto('/configurateur')
  const total = page.getByTestId('fourchette')
  const blog = page.getByTestId('carte-blog').locator('.font-mono')

  const tailleTotal = await total.evaluate((n) => parseFloat(getComputedStyle(n).fontSize))
  const tailleBlog = await blog.evaluate((n) => parseFloat(getComputedStyle(n).fontSize))
  expect(tailleTotal).toBeGreaterThan(tailleBlog * 1.5)
})
