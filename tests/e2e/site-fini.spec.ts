import { expect, test } from '@playwright/test'
import { LANGUES } from '../../lib/config/maquette'
import { DOMAINES, EDITORIAL } from '../../lib/config/domaines'

/** Ce que dit un site en attente de son client. Le mot « fourni » n'y est pas : le bloc des
 *  provenances l'emploie pour qualifier d'où vient une page, jamais pour signaler un manque. */
const ATTENTE = /(à|a) fournir|à venir|en attente|to be supplied|placeholder|lorem/i

test('la configuration de départ ne porte aucun emplacement d’image vide', async ({ page }) => {
  await page.goto('/configurateur')
  const servis = await page.getByTestId('partie-site').evaluate((n) =>
    [...n.querySelectorAll('.m-photo')].map((e) => getComputedStyle(e).backgroundImage)
  )
  expect(servis.length, 'aucun emplacement d’image dans la scène du site').toBeGreaterThan(0)
  for (const image of servis) expect(image, 'emplacement sans photo servie').toContain('/maquette/')
})

test('la configuration de départ ne porte aucun cadre en pointillés', async ({ page }) => {
  await page.goto('/configurateur')
  // Le cadre de recadrage était l'annotation de devis la plus visible de la maquette.
  const pointilles = await page.getByTestId('partie-site').evaluate((n) =>
    [...n.querySelectorAll('*')]
      .filter((e) => getComputedStyle(e).borderStyle.includes('dashed'))
      .map((e) => (e as HTMLElement).dataset.testid ?? e.className)
  )
  expect(pointilles).toEqual([])
})

test('la configuration de départ n’annonce aucun contenu à fournir', async ({ page }) => {
  await page.goto('/configurateur')
  expect(await page.getByTestId('partie-site').innerText()).not.toMatch(ATTENTE)
})

test('aucun métier ne dit l’attente dans aucune de ses langues', () => {
  // Le filet de bout en bout ne lit qu'un métier et une langue : la matière, elle, en porte
  // vingt-huit, et une seule mention rouvrirait la contradiction.
  for (const d of DOMAINES) {
    for (const langue of LANGUES) {
      expect(JSON.stringify(EDITORIAL[d.id][langue]), `${d.id} en ${langue}`).not.toMatch(ATTENTE)
    }
  }
})
