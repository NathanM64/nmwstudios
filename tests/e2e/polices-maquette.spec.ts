import { expect, test, type Page } from '@playwright/test'
import { STYLES } from '../../lib/config/styles'
import { hydrate } from './fenetre'

/** Famille réellement peinte sur le titre de la maquette. Le piège du dépôt est qu'une variable
 *  de police vide ne casse rien : la pile de secours prend le relais en silence. */
async function famillePeinte(page: Page): Promise<string> {
  return page.getByTestId('site-titre').evaluate((n) => getComputedStyle(n).fontFamily)
}

// Nom que `next/font` doit avoir posé pour chaque direction. Écrit à la main : c'est l'oracle.
const ATTENDU: Record<string, string> = {
  enseigne: 'Fraunces',
  clinique: 'Newsreader',
  velours: 'Instrument Serif',
  nocturne: 'Syne',
  affiche: 'Familjen Grotesk',
}

for (const style of STYLES) {
  test(`la police de titre de ${style.id} est réellement appliquée`, async ({ page }) => {
    await page.goto('/configurateur')
    await hydrate(page)
    await page.getByTestId('selecteur-style').selectOption(style.id)
    expect(ATTENDU[style.id], `aucune police attendue déclarée pour ${style.id}`).toBeTruthy()
    // Sondage et non lecture sèche : `selectOption` rend la main avant que React ait repeint,
    // et une lecture immédiate rend la famille de la direction précédente.
    await expect
      .poll(() => famillePeinte(page), { message: `${style.id} ne peint pas ${ATTENDU[style.id]}` })
      .toContain(ATTENDU[style.id])
  })
}

test('les cinq directions ne peignent pas la même police de titre', async ({ page }) => {
  // Sans ce constat, sept variables vides passeraient le test précédent le jour où toutes
  // retomberaient sur la même pile de secours.
  await page.goto('/configurateur')
    await hydrate(page)
  const vues = new Set<string>()
  for (const style of STYLES) {
    await page.getByTestId('selecteur-style').selectOption(style.id)
    await expect.poll(() => famillePeinte(page)).toContain(ATTENDU[style.id])
    vues.add(await famillePeinte(page))
  }
  expect(vues.size, `familles distinctes : ${[...vues].join(' | ')}`).toBe(STYLES.length)
})
