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

test('la carte atteinte en tabulation arrière n’est pas recouverte par la légende collante', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 600 })
  await page.goto('/configurateur')

  // Depuis la fin du panneau, la tabulation arrière accumule des réalignements de
  // défilement : mesuré, ce chemin fait atterrir « Prise de rendez-vous » sous
  // l'en-tête collant de son groupe à cette hauteur de fenêtre.
  await page.getByRole('button', { name: 'Copier le lien' }).focus()
  const cible = page.getByRole('checkbox', { name: 'Prise de rendez-vous' })
  for (let i = 0; i < 30 && !(await cible.evaluate((n) => n === document.activeElement)); i++) {
    await page.keyboard.press('Shift+Tab')
  }
  await expect(cible).toBeFocused()

  const carte = (await page.getByTestId('carte-rdv').boundingBox())!
  const legende = (await page.getByTestId('legende-fonctionnel').boundingBox())!
  expect(carte.y).toBeGreaterThanOrEqual(legende.y + legende.height)
})
