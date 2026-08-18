import { expect, test } from '@playwright/test'

test('la route du configurateur répond et s’annonce', async ({ page }) => {
  await page.goto('/configurateur')
  await expect(page.getByRole('heading', { level: 1, name: /configurez votre site/i })).toBeVisible()
})

test('l’aperçu est étiqueté comme une démonstration', async ({ page }) => {
  await page.goto('/configurateur')
  await expect(page.getByText('aperçu, pas votre futur site')).toBeVisible()
})

test('cocher une option la retient', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByRole('checkbox', { name: 'Un blog' }).check()
  await expect(page.getByRole('checkbox', { name: 'Un blog' })).toBeChecked()
})

test('le socle est affiché mais ne se décoche pas', async ({ page }) => {
  await page.goto('/configurateur')
  await expect(page.getByText('1 à 3 pages, formulaire de contact')).toBeVisible()
  await expect(page.getByRole('checkbox', { name: /1 à 3 pages/ })).toHaveCount(0)
})

test('le pas-à-pas incrémente une option quantifiable', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByRole('button', { name: 'Ajouter : 3 pages de plus' }).click()
  await page.getByRole('button', { name: 'Ajouter : 3 pages de plus' }).click()
  await expect(page.getByTestId('quantite-pages')).toHaveText('2')
})

test('le pas-à-pas ne descend pas sous zéro', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByRole('button', { name: 'Retirer : 3 pages de plus' }).click()
  await expect(page.getByTestId('quantite-pages')).toHaveText('0')
})

test('le pas-à-pas ne dépasse pas le maximum de l’option', async ({ page }) => {
  await page.goto('/configurateur')
  const ajouter = page.getByRole('button', { name: 'Ajouter : 3 pages de plus' })
  for (let i = 0; i < 6; i++) await ajouter.click()
  await expect(page.getByTestId('quantite-pages')).toHaveText('4')
})

test('les formules récurrentes s’excluent mutuellement', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByRole('radio', { name: 'Essentiel' }).check()
  await page.getByRole('radio', { name: 'Sérénité' }).check()
  await expect(page.getByRole('radio', { name: 'Essentiel' })).not.toBeChecked()
  await expect(page.getByRole('radio', { name: 'Sérénité' })).toBeChecked()
})

test('choisir une formule remplace la précédente dans le montant mensuel', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByRole('radio', { name: 'Essentiel' }).check()
  await page.getByRole('radio', { name: 'Sérénité' }).check()
  await expect(page.getByTestId('mensuel')).toContainText('190')
})

test('la barre affiche la fourchette et le mensuel ensemble', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByRole('radio', { name: 'Essentiel' }).check()
  await expect(page.getByTestId('fourchette')).toContainText('€')
  await expect(page.getByTestId('mensuel')).toContainText('90')
})

test('la fourchette monte quand on ajoute une option', async ({ page }) => {
  await page.goto('/configurateur')
  const avant = await page.getByTestId('fourchette').textContent()
  await page.getByRole('checkbox', { name: 'Un blog' }).check()
  await expect(page.getByTestId('fourchette')).not.toHaveText(avant ?? '')
})

test('le delta annonce le montant ajouté', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByRole('checkbox', { name: 'Un blog' }).check()
  await expect(page.getByTestId('delta')).toHaveText('+700 €')
})

test('la barre reste visible sans défilement', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/configurateur')
  await expect(page.getByTestId('fourchette')).toBeInViewport()
})

test('l’explication d’une option est masquée par défaut', async ({ page }) => {
  await page.goto('/configurateur')
  // toBeHidden() seul passerait aussi si le texte n'existait nulle part : toBeAttached()
  // force la preuve que le popover est bien dans le DOM, juste fermé.
  const explication = page.getByText(/Une section actualités que vous alimentez/)
  await expect(explication).toBeAttached()
  await expect(explication).toBeHidden()
})

test('l’explication s’ouvre au clic et se ferme à Échap', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByRole('button', { name: 'Que comprend : Un blog' }).click()
  await expect(page.getByText(/Une section actualités que vous alimentez/)).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByText(/Une section actualités que vous alimentez/)).toBeHidden()
})

test('l’explication s’atteint au clavier', async ({ page }) => {
  await page.goto('/configurateur')
  const bouton = page.getByRole('button', { name: 'Que comprend : Un blog' })
  await bouton.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByText(/Une section actualités que vous alimentez/)).toBeVisible()
})

test('l’aperçu montre trois entrées de navigation par défaut', async ({ page }) => {
  await page.goto('/configurateur')
  await expect(page.getByTestId('apercu-nav').getByRole('listitem')).toHaveCount(3)
})

test('ajouter une tranche de pages enrichit la navigation de l’aperçu', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByRole('button', { name: 'Ajouter : 3 pages de plus' }).click()
  await expect(page.getByTestId('apercu-nav').getByRole('listitem')).toHaveCount(6)
})

test('cocher le blog fait apparaître la section actualités dans l’aperçu', async ({ page }) => {
  await page.goto('/configurateur')
  await expect(page.getByTestId('apercu-blog')).toHaveCount(0)
  await page.getByRole('checkbox', { name: 'Un blog' }).check()
  await expect(page.getByTestId('apercu-blog')).toBeVisible()
})

test('cocher l’espace membre ajoute le bouton de connexion dans l’aperçu', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByRole('checkbox', { name: 'Espace membre' }).check()
  await expect(page.getByTestId('apercu-connexion')).toBeVisible()
})
