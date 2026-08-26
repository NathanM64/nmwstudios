import { expect, test } from '@playwright/test'
import { DOMAINE_OUVERTURE, EDITORIAL } from '../../lib/config/domaines'
import { HABILLAGE, type Langue } from '../../lib/config/maquette'
import { hydrate } from './fenetre'

test.beforeEach(async ({ page }) => {
  await page.goto('/configurateur')
  await hydrate(page)
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

test('les pages se nomment par provenance, fournies par défaut', async ({ page }) => {
  // Le bloc ne se replie plus : sans l'option, les trois pages du socle sont là, du côté fourni.
  await expect(page.getByTestId('site-texte')).toBeVisible()
  await expect(page.getByTestId('site-page-fournie')).toHaveCount(3)
  await expect(page.getByTestId('site-page-redigee')).toHaveCount(0)
})

test('chaque page achetée passe du côté rédigé sans changer le total', async ({ page }) => {
  await page.getByRole('button', { name: 'Ajouter : J’écris vos textes' }).click()
  await expect(page.getByTestId('site-page-redigee')).toHaveCount(1)
  await expect(page.getByTestId('site-page-fournie')).toHaveCount(2)
  await page.getByRole('button', { name: 'Ajouter : J’écris vos textes' }).click()
  await expect(page.getByTestId('site-page-redigee')).toHaveCount(2)
  await expect(page.getByTestId('site-page-fournie')).toHaveCount(1)
})

test('les deux provenances portent chacune leur surtitre', async ({ page }) => {
  await page.getByRole('button', { name: 'Ajouter : J’écris vos textes' }).click()
  const bloc = page.getByTestId('site-texte')
  await expect(bloc).toContainText(HABILLAGE.fr.fournies)
  await expect(bloc).toContainText(HABILLAGE.fr.redigees)
})

test('le volume du site commande le nombre de pages nommées', async ({ page }) => {
  // Sans ce constat, le bloc nommerait quinze pages sur un site qui n'en a que trois.
  await page.getByRole('button', { name: 'Ajouter : 3 pages de plus' }).click()
  await expect(page.getByTestId('site-page-fournie')).toHaveCount(6)
})

test('acheter plus de rédaction que le site n’a de pages ne nomme rien de plus', async ({ page }) => {
  await page.goto('/configurateur?redaction=15')
  await expect(page.getByTestId('site-page-redigee')).toHaveCount(3)
  await expect(page.getByTestId('site-page-fournie')).toHaveCount(0)
})

test('sans reprise, les trois textes coulent en un pavé sans titre', async ({ page }) => {
  await expect(page.getByTestId('site-services-pave')).toBeVisible()
  await expect(page.getByTestId('site-service')).toHaveCount(0)
})

test('la reprise rend leurs intertitres et leur numérotation aux services', async ({ page }) => {
  await page.getByRole('checkbox', { name: 'Je restructure vos textes existants', exact: true }).check()
  await expect(page.getByTestId('site-service')).toHaveCount(3)
  await expect(page.getByTestId('site-services-pave')).toHaveCount(0)
})

test('la reprise n’écrit pas un mot de plus que le pavé', async ({ page }) => {
  // Le catalogue vend « le fond reste le vôtre » : les deux états portent les mêmes textes,
  // et un delta de volume ferait de cette promesse un mensonge.
  const mots = (t: string) => t.replace(/\s+/g, ' ').trim()
  const avant = mots(await page.getByTestId('site-services-pave').innerText())
  await page.getByRole('checkbox', { name: 'Je restructure vos textes existants', exact: true }).check()
  const textes = await page.getByTestId('site-service').evaluateAll((n) =>
    n.map((e) => e.querySelectorAll('p')[1].textContent ?? '')
  )
  expect(mots(textes.join(' '))).toBe(avant)
})

// Tout le texte, pas la seule navigation : titres, blocs repris, la carte de texte de la
// bande d'images, créneaux, newsletter et articles doivent suivre le sélecteur.
// Les chaînes viennent du domaine par défaut, pas d'un littéral : une relecture des textes
// ne doit pas rendre ce test faux, seulement le faire porter sur les nouveaux mots.
const attendu = (langue: Langue) => {
  const e = EDITORIAL[DOMAINE_OUVERTURE][langue]
  const h = HABILLAGE[langue]
  return [e.pages[0], e.titre, h.fournies, h.redigees, e.blocsRepris[0], e.blocsRepris[2], h.actualites,
    e.articles[0].titre, h.pieceJointe, h.reserver, h.creneaux[0], h.inscrire, h.regler, h.connexion]
}

test('le sélecteur de langue bascule tout le texte de la maquette', async ({ page }) => {
  await page.goto(
    '/configurateur?langue=1&redaction=2&reprise&photos&blog&article=2&membre&formulaire&rdv&newsletter&paiement'
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
    EDITORIAL[DOMAINE_OUVERTURE].fr.blocsRepris[2],
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

test('l’espace membre pose un bouton de connexion', async ({ page }) => {
  await expect(page.getByTestId('site-connexion')).toHaveCount(0)
  await page.getByRole('checkbox', { name: 'Espace membre', exact: true }).check()
  await expect(page.getByTestId('site-connexion')).toBeVisible()
})
