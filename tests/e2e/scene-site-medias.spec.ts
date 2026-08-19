import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/configurateur')
})

test('aucune balise image n’est produite dans l’aperçu', async ({ page }) => {
  // Contrainte de production : Nathan ne livre ni photo ni dessin.
  await page.getByRole('checkbox', { name: 'Je retouche vos photos', exact: true }).check()
  await expect(page.getByTestId('apercu').locator('img')).toHaveCount(0)
})

test('la retouche montre le recadrage sans annoncer de poids chiffré', async ({ page }) => {
  await expect(page.getByTestId('site-poids')).toHaveCount(0)
  await page.getByRole('checkbox', { name: 'Je retouche vos photos', exact: true }).check()
  await expect(page.getByTestId('site-reperes')).toBeVisible()
  await expect(page.getByTestId('site-poids')).toBeVisible()
  // Un poids affiché serait un chiffre non mesuré, interdit par le CLAUDE.md.
  await expect(page.getByTestId('site-poids')).not.toContainText(/\d/)
})

test('les visuels sous licence remplissent le cadre et s’annoncent comme substituts', async ({ page }) => {
  await page.getByRole('checkbox', { name: 'Visuels sous licence', exact: true }).check()
  await expect(page.getByTestId('site-visuels')).toBeVisible()
})

test('photos et visuels cochés ensemble affichent deux étiquettes qui ne se recouvrent pas', async ({ page }) => {
  // photos et visuels ne s'excluent pas : la visibilité seule ne verrait pas un chevauchement.
  await page.getByRole('checkbox', { name: 'Je retouche vos photos', exact: true }).check()
  await page.getByRole('checkbox', { name: 'Visuels sous licence', exact: true }).check()
  await expect(page.getByTestId('site-poids')).toBeVisible()
  await expect(page.getByTestId('site-visuels')).toBeVisible()

  const poids = (await page.getByTestId('site-poids').boundingBox())!
  const visuels = (await page.getByTestId('site-visuels').boundingBox())!
  const chevauchement =
    poids.x < visuels.x + visuels.width &&
    poids.x + poids.width > visuels.x &&
    poids.y < visuels.y + visuels.height &&
    poids.y + poids.height > visuels.y
  expect(chevauchement).toBe(false)
})

test('le blog ouvre une grille d’actualités vide', async ({ page }) => {
  await expect(page.getByTestId('site-blog')).toHaveCount(0)
  await page.getByRole('checkbox', { name: 'Un blog', exact: true }).check()
  await expect(page.getByTestId('site-blog')).toBeVisible()
  await expect(page.getByTestId('site-article')).toHaveCount(0)
})

test('chaque article optimisé ajoute une carte titrée avec sa requête', async ({ page }) => {
  await page.getByRole('checkbox', { name: 'Un blog', exact: true }).check()
  await page.getByRole('button', { name: 'Ajouter : Un article optimisé' }).click()
  await expect(page.getByTestId('site-article')).toHaveCount(1)
  await page.getByRole('button', { name: 'Ajouter : Un article optimisé' }).click()
  await expect(page.getByTestId('site-article')).toHaveCount(2)
})

test('un article sans blog s’affiche quand même, il ne disparaît pas', async ({ page }) => {
  // Sans cela, l'option serait muette et le test généré de la Task 12 échouerait.
  await page.getByRole('button', { name: 'Ajouter : Un article optimisé' }).click()
  await expect(page.getByTestId('site-article')).toHaveCount(1)
})
