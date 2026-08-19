import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/configurateur')
})

test('le socle montre trois entrées de navigation', async ({ page }) => {
  await expect(page.getByTestId('site-nav').getByRole('listitem')).toHaveCount(3)
})

test('chaque tranche de pages ajoute trois entrées', async ({ page }) => {
  await page.getByRole('button', { name: 'Ajouter : 3 pages de plus' }).click()
  await expect(page.getByTestId('site-nav').getByRole('listitem')).toHaveCount(6)
  await page.getByRole('button', { name: 'Ajouter : 3 pages de plus' }).click()
  await expect(page.getByTestId('site-nav').getByRole('listitem')).toHaveCount(9)
})

test('le faux texte devient du texte écrit quand la rédaction est retenue', async ({ page }) => {
  await expect(page.getByTestId('site-texte')).toHaveCount(0)
  await page.getByRole('button', { name: 'Ajouter : J’écris vos textes' }).click()
  await expect(page.getByTestId('site-texte')).toBeVisible()
  await expect(page.getByTestId('site-texte')).not.toBeEmpty()
})

test('la reprise réordonne les blocs existants au lieu d’écrire du neuf', async ({ page }) => {
  await page.getByRole('checkbox', { name: 'Je reprends vos textes existants', exact: true }).check()
  await expect(page.getByTestId('site-reprise')).toBeVisible()
  // Rédaction et reprise ne se confondent pas à l'écran.
  await expect(page.getByTestId('site-texte')).toHaveCount(0)
})

test('rédaction et reprise cochées ensemble restent visibles toutes les deux', async ({ page }) => {
  await page.getByRole('button', { name: 'Ajouter : J’écris vos textes' }).click()
  await page.getByRole('checkbox', { name: 'Je reprends vos textes existants', exact: true }).check()
  await expect(page.getByTestId('site-texte')).toBeVisible()
  await expect(page.getByTestId('site-reprise')).toBeVisible()
})

test('le sélecteur de langue bascule tout le texte de la maquette', async ({ page }) => {
  await page.getByRole('button', { name: 'Ajouter : Une langue de plus' }).click()
  const avant = await page.getByTestId('site-nav').textContent()
  await page.getByTestId('site-langue').selectOption('en')
  await expect(page.getByTestId('site-nav')).not.toHaveText(avant!)
})

test('l’espace membre pose un bouton de connexion', async ({ page }) => {
  await expect(page.getByTestId('site-connexion')).toHaveCount(0)
  await page.getByRole('checkbox', { name: 'Espace membre', exact: true }).check()
  await expect(page.getByTestId('site-connexion')).toBeVisible()
})
