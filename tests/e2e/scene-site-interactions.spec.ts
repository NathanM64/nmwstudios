import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/configurateur')
})

test('le socle montre un formulaire de contact à trois champs', async ({ page }) => {
  await expect(page.getByTestId('site-formulaire')).toBeVisible()
  await expect(page.getByTestId('site-formulaire').getByTestId('site-champ')).toHaveCount(3)
})

test('le formulaire avancé montre ses étapes et sa pièce jointe', async ({ page }) => {
  await expect(page.getByTestId('site-etapes')).toHaveCount(0)
  await page.getByRole('checkbox', { name: 'Formulaire avancé', exact: true }).check()
  await expect(page.getByTestId('site-etapes')).toBeVisible()
  await expect(page.getByTestId('site-formulaire')).toContainText('Pièce jointe')
})

test('la prise de rendez-vous montre des créneaux et non un simple bouton', async ({ page }) => {
  await page.getByRole('checkbox', { name: 'Prise de rendez-vous', exact: true }).check()
  await expect(page.getByTestId('site-rdv').getByTestId('site-creneau')).toHaveCount(6)
})

test('la newsletter pose un bandeau d’inscription en pied de page', async ({ page }) => {
  await expect(page.getByTestId('site-newsletter')).toHaveCount(0)
  await page.getByRole('checkbox', { name: 'Newsletter', exact: true }).check()
  await expect(page.getByTestId('site-newsletter')).toBeVisible()
})

test('le paiement en ligne pose une carte de règlement', async ({ page }) => {
  await expect(page.getByTestId('site-paiement')).toHaveCount(0)
  await page.getByRole('checkbox', { name: 'Paiement en ligne', exact: true }).check()
  await expect(page.getByTestId('site-paiement')).toBeVisible()
})

test('formulaire avancé, rendez-vous, newsletter et paiement cochés ensemble restent tous visibles, sans se recouvrir', async ({ page }) => {
  // Les quatre options sont du groupe fonctionnel, non exclusif : aucune ne doit chasser une autre.
  await page.getByRole('checkbox', { name: 'Formulaire avancé', exact: true }).check()
  await page.getByRole('checkbox', { name: 'Prise de rendez-vous', exact: true }).check()
  await page.getByRole('checkbox', { name: 'Newsletter', exact: true }).check()
  await page.getByRole('checkbox', { name: 'Paiement en ligne', exact: true }).check()

  const etapes = page.getByTestId('site-etapes')
  const rdv = page.getByTestId('site-rdv')
  const newsletter = page.getByTestId('site-newsletter')
  const paiement = page.getByTestId('site-paiement')
  await expect(etapes).toBeVisible()
  await expect(rdv).toBeVisible()
  await expect(newsletter).toBeVisible()
  await expect(paiement).toBeVisible()

  const boites = [
    (await etapes.boundingBox())!,
    (await rdv.boundingBox())!,
    (await newsletter.boundingBox())!,
    (await paiement.boundingBox())!,
  ]
  const seChevauchent = (a: { x: number; y: number; width: number; height: number }, b: typeof a) =>
    a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y

  for (let i = 0; i < boites.length; i++) {
    for (let j = i + 1; j < boites.length; j++) {
      expect(seChevauchent(boites[i], boites[j]), `boîtes ${i} et ${j} se recouvrent`).toBe(false)
    }
  }
})
