import { expect, test } from '@playwright/test'
import { STYLES } from '../../lib/config/styles'
import { hydrate } from './fenetre'

// Un repère par geste. Le geste est ce qui empêche les cinq directions d'être cinq palettes sur
// la même page : sans ce filet, en retirer un ne ferait rougir personne.
const REPERE: Record<string, string> = {
  bandeau: 'geste-bandeau',
  bande: 'geste-bande',
  centre: 'geste-centre',
  rail: 'geste-rail',
  aplat: 'geste-aplat',
}

for (const style of STYLES) {
  test(`${style.id} pose son geste et lui seul`, async ({ page }) => {
    await page.goto('/configurateur')
    await hydrate(page)
    await page.getByTestId('selecteur-style').selectOption(style.id)
    await expect(page.getByTestId(REPERE[style.geste])).toHaveCount(1)
    for (const [geste, repere] of Object.entries(REPERE)) {
      if (geste === style.geste) continue
      await expect(page.getByTestId(repere), `${style.id} pose aussi ${geste}`).toHaveCount(0)
    }
  })
}

test('les cinq gestes sont tous atteints par au moins une direction', () => {
  // Un geste déclaré et jamais posé serait du code mort que le filet ci-dessus ne verrait pas.
  expect(new Set(STYLES.map((s) => s.geste)).size).toBe(Object.keys(REPERE).length)
})
