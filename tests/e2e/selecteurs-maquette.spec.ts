import { expect, test } from '@playwright/test'
import { DOMAINES } from '../../lib/config/domaines'
import { STYLES } from '../../lib/config/styles'

test.beforeEach(async ({ page }) => {
  await page.goto('/configurateur')
})

test('les deux sélecteurs vivent dans le bandeau de l’aperçu', async ({ page }) => {
  const apercu = page.getByTestId('apercu')
  await expect(apercu.getByTestId('selecteur-domaine')).toBeVisible()
  await expect(apercu.getByTestId('selecteur-style')).toBeVisible()
})

test('le sélecteur de domaine propose les sept métiers', async ({ page }) => {
  const options = page.getByTestId('selecteur-domaine').locator('option')
  await expect(options).toHaveCount(DOMAINES.length)
})

test('le sélecteur de style propose les trois directions', async ({ page }) => {
  const options = page.getByTestId('selecteur-style').locator('option')
  await expect(options).toHaveCount(STYLES.length)
})

test('changer de domaine change le texte de la maquette', async ({ page }) => {
  const scene = page.getByTestId('objet-scene')
  const avant = await scene.textContent()
  await page.getByTestId('selecteur-domaine').selectOption('vtc')
  await expect.poll(() => scene.textContent()).not.toBe(avant)
})

test('changer de style change la palette sans changer le texte', async ({ page }) => {
  const titre = page.getByTestId('objet-scene')
  const texte = await titre.textContent()
  const fondAvant = await page.getByTestId('maquette').evaluate((n) => getComputedStyle(n).backgroundColor)

  await page.getByTestId('selecteur-style').selectOption('premium')

  await expect
    .poll(() => page.getByTestId('maquette').evaluate((n) => getComputedStyle(n).backgroundColor))
    .not.toBe(fondAvant)
  await expect(titre).toHaveText(texte!)
})

test('la mention rappelle que la vôtre sera dessinée pour vous', async ({ page }) => {
  // Sans elle, le sélecteur se lit comme un choix de gabarit, ce que tout le
  // positionnement du site contredit.
  await expect(page.getByTestId('mention-style')).toContainText('dessin')
})

test('les onglets de scène restent au premier plan du bandeau', async ({ page }) => {
  const onglet = await page.getByTestId('onglet-site').boundingBox()
  const selecteur = await page.getByTestId('selecteur-domaine').boundingBox()
  expect(onglet!.y).toBeLessThanOrEqual(selecteur!.y)
})
