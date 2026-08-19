import { expect, test } from '@playwright/test'
import { GROUPES } from '../../lib/config/catalogue'
import { SCENE_PAR_GROUPE } from '../../lib/config/scenes'
import { calculer, formaterEuros } from '../../lib/config/devis'
import { CONFIG_DEPART } from '../../components/config/Configurateur'

/** `block: 'start'` plutôt que `scrollIntoViewIfNeeded` : ce dernier fait le défilement
 *  minimal, et laisserait le groupe sous la ligne de lecture. */
async function amener(page: import('@playwright/test').Page, groupe: string) {
  await page.locator(`[data-groupe="${groupe}"]`).evaluate((el) => el.scrollIntoView({ block: 'start' }))
}

test('faire défiler le formulaire fait suivre l’aperçu, sans rien cocher', async ({ page }) => {
  await page.goto('/configurateur')
  await expect(page.getByTestId('onglet-site')).toHaveAttribute('aria-pressed', 'true')

  await amener(page, 'conformite')
  await expect(page.getByTestId('onglet-preuve')).toHaveAttribute('aria-pressed', 'true')

  await amener(page, 'services')
  await expect(page.getByTestId('onglet-deroule')).toHaveAttribute('aria-pressed', 'true')

  await amener(page, 'contenu')
  await expect(page.getByTestId('onglet-site')).toHaveAttribute('aria-pressed', 'true')

  // Rien n'a été coché : le prix est resté celui du départ.
  await expect(page.getByTestId('prix')).toHaveText(formaterEuros(calculer(CONFIG_DEPART).total))
})

test('chaque groupe amène sa propre scène', async ({ page }) => {
  await page.goto('/configurateur')
  for (const groupe of GROUPES) {
    await amener(page, groupe.id)
    await expect(
      page.getByTestId(`onglet-${SCENE_PAR_GROUPE[groupe.id]}`),
      `le groupe « ${groupe.titre} » n’amène pas sa scène`
    ).toHaveAttribute('aria-pressed', 'true')
  }
})

test('un choix d’onglet tient tant qu’on ne change pas de groupe', async ({ page }) => {
  await page.goto('/configurateur')
  await amener(page, 'conformite')
  await page.getByTestId('onglet-site').click()
  // Un défilement à l'intérieur du même groupe ne doit pas reprendre la main sur le visiteur.
  await page.mouse.wheel(0, 60)
  await expect(page.getByTestId('onglet-site')).toHaveAttribute('aria-pressed', 'true')
})
