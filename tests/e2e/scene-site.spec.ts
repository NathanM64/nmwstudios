import { expect, test } from '@playwright/test'
import { DOMAINE_OUVERTURE, EDITORIAL } from '../../lib/config/domaines'
import { HABILLAGE, type Langue } from '../../lib/config/maquette'

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
  await page.getByRole('checkbox', { name: 'Je restructure vos textes existants', exact: true }).check()
  await expect(page.getByTestId('site-reprise')).toBeVisible()
  // Rédaction et reprise ne se confondent pas à l'écran.
  await expect(page.getByTestId('site-texte')).toHaveCount(0)
})

test('rédaction et reprise cochées ensemble restent visibles toutes les deux', async ({ page }) => {
  await page.getByRole('button', { name: 'Ajouter : J’écris vos textes' }).click()
  await page.getByRole('checkbox', { name: 'Je restructure vos textes existants', exact: true }).check()
  await expect(page.getByTestId('site-texte')).toBeVisible()
  await expect(page.getByTestId('site-reprise')).toBeVisible()
})

// Tout le texte, pas la seule navigation : titres, blocs repris, créneaux, newsletter,
// articles et étiquettes du cadre image doivent suivre le sélecteur.
// Les chaînes viennent du domaine par défaut, pas d'un littéral : une relecture des textes
// ne doit pas rendre ce test faux, seulement le faire porter sur les nouveaux mots.
const attendu = (langue: Langue) => {
  const e = EDITORIAL[DOMAINE_OUVERTURE][langue]
  const h = HABILLAGE[langue]
  return [e.pages[0], e.titre, h.redigees, e.blocsRepris[0], h.actualites, e.articles[0].titre,
    h.photo, h.visuel, h.pieceJointe, h.reserver, h.creneaux[0], h.inscrire, h.regler, h.connexion]
}

test('le sélecteur de langue bascule tout le texte de la maquette', async ({ page }) => {
  await page.goto(
    '/configurateur?langue=1&redaction=3&reprise&photos&visuels&blog&article=2&membre&formulaire&rdv&newsletter&paiement'
  )
  const maquette = page.getByTestId('objet-scene')

  for (const texte of attendu('fr')) {
    await expect(maquette, `« ${texte} » manque avant la bascule`).toContainText(texte)
  }

  await page.getByTestId('site-langue').selectOption('en')

  for (const texte of attendu('en')) {
    await expect(maquette, `« ${texte} » manque après la bascule`).toContainText(texte)
  }

  const propresAuFrancais = [
    EDITORIAL[DOMAINE_OUVERTURE].fr.titre,
    EDITORIAL[DOMAINE_OUVERTURE].fr.blocsRepris[0],
    HABILLAGE.fr.reserver,
    HABILLAGE.fr.actualites,
  ]
  for (const reste of propresAuFrancais) {
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
  await expect(page.getByTestId('objet-scene')).toContainText(EDITORIAL[DOMAINE_OUVERTURE].en.titre)
  await page.getByRole('button', { name: 'Retirer : Une langue de plus' }).click()
  await expect(page.getByTestId('site-langue')).toHaveCount(0)
  await expect(page.getByTestId('objet-scene')).toContainText(EDITORIAL[DOMAINE_OUVERTURE].fr.titre)
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
