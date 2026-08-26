import { expect, test } from '@playwright/test'
import { HABILLAGE } from '../../lib/config/maquette'
import { DOMAINE_OUVERTURE, EDITORIAL } from '../../lib/config/domaines'
import { hydrate } from './fenetre'

test.beforeEach(async ({ page }) => {
  await page.goto('/configurateur')
  await hydrate(page)
})

test('la réservation montre une semaine et non une rangée d’heures', async ({ page }) => {
  await expect(page.getByTestId('site-jour')).toHaveCount(0)
  await page.getByRole('checkbox', { name: 'Prise de rendez-vous', exact: true }).check()
  await expect(page.getByTestId('site-jour')).toHaveCount(7)
})

test('les jours pleins et vides se distinguent à l’écran', async ({ page }) => {
  // Une classe qui bascule sans rien peindre passerait au vert : le constat porte sur la couleur.
  await page.getByRole('checkbox', { name: 'Prise de rendez-vous', exact: true }).check()
  const fonds = await page
    .getByTestId('site-jour')
    .evaluateAll((n) => n.map((e) => getComputedStyle(e).backgroundColor))
  expect(new Set(fonds).size, 'les sept jours se ressemblent tous').toBe(2)
})

test('des créneaux sont pris, et se lisent barrés', async ({ page }) => {
  await page.getByRole('checkbox', { name: 'Prise de rendez-vous', exact: true }).check()
  await expect(page.getByTestId('site-creneau-pris')).toHaveCount(2)
  const barres = await page
    .getByTestId('site-creneau-pris')
    .evaluateAll((n) => n.map((e) => getComputedStyle(e).textDecorationLine))
  for (const barre of barres) expect(barre, 'un créneau pris n’est pas barré').toContain('line-through')
})

test('le créneau retenu nomme l’heure et le service réservé', async ({ page }) => {
  await page.getByRole('checkbox', { name: 'Prise de rendez-vous', exact: true }).check()
  const retenu = page.getByTestId('site-retenu')
  await expect(retenu).toContainText(HABILLAGE.fr.creneaux[0])
  // Le service vient de l'éditorial du métier : sans lui, la réservation ne réserve rien.
  await expect(retenu).toContainText(EDITORIAL[DOMAINE_OUVERTURE].fr.services[0].nom)
})

test('la confirmation est annoncée', async ({ page }) => {
  await page.getByRole('checkbox', { name: 'Prise de rendez-vous', exact: true }).check()
  await expect(page.getByTestId('site-rdv')).toContainText(HABILLAGE.fr.confirmation)
})
