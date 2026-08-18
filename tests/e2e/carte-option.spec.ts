import { expect, test } from '@playwright/test'
import { optionParId } from '../../lib/config/catalogue'

test('la carte affiche l’explication sans ouvrir d’infobulle', async ({ page }) => {
  await page.goto('/configurateur')
  const explication = optionParId('blog')!.explication
  await expect(page.getByText(explication)).toBeVisible()
})

test('le nom accessible de la case reste le seul libellé', async ({ page }) => {
  await page.goto('/configurateur')
  // Nom exact : l'explication est en description, pas en nom, sinon les
  // sélecteurs de la suite existante deviendraient ambigus.
  await expect(page.getByRole('checkbox', { name: 'Un blog', exact: true })).toHaveCount(1)
})

test('cliquer n’importe où sur la carte coche l’option', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByTestId('carte-blog').click({ position: { x: 10, y: 10 } })
  await expect(page.getByRole('checkbox', { name: 'Un blog', exact: true })).toBeChecked()
})

test('la carte tient la cible tactile de 44 px', async ({ page }) => {
  await page.goto('/configurateur')
  const boite = await page.getByTestId('carte-blog').boundingBox()
  expect(boite!.height).toBeGreaterThanOrEqual(44)
})

test('les compteurs des quantifiables tiennent aussi 44 px', async ({ page }) => {
  await page.goto('/configurateur')
  const boite = await page.getByRole('button', { name: 'Ajouter : 3 pages de plus' }).boundingBox()
  expect(boite!.height).toBeGreaterThanOrEqual(44)
  expect(boite!.width).toBeGreaterThanOrEqual(44)
})

test('la carte est atteignable au clavier et s’active à l’espace', async ({ page }) => {
  await page.goto('/configurateur')
  const case_ = page.getByRole('checkbox', { name: 'Un blog', exact: true })
  await case_.focus()
  await page.keyboard.press('Space')
  await expect(case_).toBeChecked()
})

test('la carte affiche un anneau de focus réellement peint au clavier', async ({ page }) => {
  await page.goto('/configurateur')
  // `opacity-0` sur l'input éteint aussi son anneau natif : l'indicateur doit être
  // peint sur la carte elle-même, pas juste déductible de l'état focus de l'input.
  await page.getByRole('checkbox', { name: 'Un blog', exact: true }).focus()
  const carte = page.getByTestId('carte-blog')
  await expect(carte).toHaveCSS('outline-style', 'solid')
  await expect(carte).toHaveCSS('outline-width', '2px')
  await expect(carte).toHaveCSS('outline-color', 'rgb(122, 162, 255)')
})
