import { expect, test } from '@playwright/test'

test('le dock expose les quatre entrées', async ({ page }) => {
  await page.goto('/')
  const dock = page.getByRole('navigation', { name: 'Sections de la page' })
  await expect(dock).toBeVisible()
  await expect(dock.getByRole('link')).toHaveCount(4)
})

test('cliquer une entrée amène à la section correspondante', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Contact' }).click()
  await expect(page).toHaveURL(/#contact$/)
  await expect(page.locator('#contact')).toBeInViewport()
})

test("l'entrée courante est signalée pendant le défilement", async ({ page }) => {
  await page.goto('/')
  await page.locator('#prix').scrollIntoViewIfNeeded()
  await expect(page.getByRole('link', { name: 'Prix' })).toHaveAttribute('aria-current', 'true')
})

test('le dock reste visible sur un écran mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await expect(page.getByRole('navigation', { name: 'Sections de la page' })).toBeVisible()
})
