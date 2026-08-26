import { expect, test } from '@playwright/test'
import { LANGUES } from '../../lib/config/maquette'
import { DOMAINES, EDITORIAL } from '../../lib/config/domaines'

/** Ce que dit un site en attente de son client. Le mot « fourni » n'y est pas : le bloc des
 *  provenances l'emploie pour qualifier d'où vient une page, jamais pour signaler un manque. */
const ATTENTE = /(à|a) fournir|à venir|en attente|to be supplied|placeholder|lorem/i

test('la configuration de départ ne porte aucun emplacement d’image vide', async ({ page }) => {
  // Fenêtre haute posée ici : la bande absorbe la hauteur libre, et à 720 px elle est trop
  // courte pour qu'une cellule étirée sur rien se distingue d'une cellule pleine.
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/configurateur')
  // Toutes les cellules de la bande, quelle que soit leur classe : la carte de texte du quatrième
  // emplacement est une `.m-carte`, et un filet limité aux `.m-photo` ne la voyait pas.
  const cellules = await page.getByTestId('site-bande-images').evaluate((bande) =>
    [...bande.children].map((cellule) => {
      const boite = cellule.getBoundingClientRect()
      // Un enfant masqué (display: none) rend un rectangle nul : sans filtre, son `top` à 0
      // fausse le minimum et fait passer le filet au vert par construction.
      const hauts = [...cellule.children]
        .map((n) => n.getBoundingClientRect())
        .filter((r) => r.height > 0)
        .map((r) => r.top)
      return {
        repere: (cellule as HTMLElement).dataset.testid ?? cellule.className,
        servie: getComputedStyle(cellule).backgroundImage.includes('/maquette/'),
        // Part de la cellule laissée sans matière au dessus de sa première ligne peinte.
        vide: hauts.length === 0 ? 1 : (Math.min(...hauts) - boite.top) / boite.height,
      }
    })
  )
  expect(cellules.length, 'aucune cellule dans la bande d’images').toBeGreaterThan(0)
  for (const cellule of cellules) {
    if (cellule.servie) continue
    expect(cellule.vide, `${cellule.repere} : sa matière commence dans sa moitié basse`).toBeLessThan(0.5)
  }
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
