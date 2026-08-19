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

// Tout le texte, pas la seule navigation : titres, blocs repris, créneaux, newsletter,
// articles et étiquettes du cadre image doivent suivre le sélecteur.
test('le sélecteur de langue bascule tout le texte de la maquette', async ({ page }) => {
  await page.goto(
    '/configurateur?langue=1&redaction=3&reprise&photos&visuels&blog&article=2&membre&formulaire&rdv&newsletter&paiement'
  )
  const maquette = page.getByTestId('objet-scene')

  for (const texte of ['Accueil', 'Charpentier à Bègles', 'Textes rédigés', 'Nos services', 'Actualités',
    'Quel bois pour une extension ?', 'recadrée et allégée', 'visuel sous licence', 'Pièce jointe',
    'Réserver un créneau', '9 h', 'S’inscrire', 'Régler en ligne', 'Connexion']) {
    await expect(maquette, `« ${texte} » manque avant la bascule`).toContainText(texte)
  }

  await page.getByTestId('site-langue').selectOption('en')

  for (const texte of ['Home', 'Carpenter in Bègles', 'Pages written', 'Our services', 'News',
    'Which timber for an extension?', 'cropped and compressed', 'licensed image', 'Attachment',
    'Book a slot', '9 am', 'Sign up', 'Pay online', 'Log in']) {
    await expect(maquette, `« ${texte} » manque après la bascule`).toContainText(texte)
  }

  for (const reste of ['Charpentier à Bègles', 'Nos services', 'Réserver un créneau', 'Actualités']) {
    await expect(maquette, `« ${reste} » est resté en français`).not.toContainText(reste)
  }
})

test('chaque langue achetée ajoute une entrée au sélecteur', async ({ page }) => {
  await page.goto('/configurateur?langue=1')
  await expect(page.getByTestId('site-langue').locator('option')).toHaveCount(2)
  await page.goto('/configurateur?langue=3')
  await expect(page.getByTestId('site-langue').locator('option')).toHaveCount(4)
})

test('retirer la langue ramène la maquette en français, sans la laisser bloquée', async ({ page }) => {
  await page.goto('/configurateur?langue=1&redaction=1')
  await page.getByTestId('site-langue').selectOption('en')
  await expect(page.getByTestId('site-texte')).toContainText('Carpenter')
  await page.getByRole('button', { name: 'Retirer : Une langue de plus' }).click()
  await expect(page.getByTestId('site-langue')).toHaveCount(0)
  await expect(page.getByTestId('site-texte')).toContainText('Charpentier')
})

test('chaque page rédigée se nomme dans la maquette', async ({ page }) => {
  await page.goto('/configurateur?redaction=1')
  await expect(page.getByTestId('site-page-redigee')).toHaveCount(1)
  await page.goto('/configurateur?redaction=15')
  await expect(page.getByTestId('site-page-redigee')).toHaveCount(15)
})

test('l’espace membre pose un bouton de connexion', async ({ page }) => {
  await expect(page.getByTestId('site-connexion')).toHaveCount(0)
  await page.getByRole('checkbox', { name: 'Espace membre', exact: true }).check()
  await expect(page.getByTestId('site-connexion')).toBeVisible()
})
