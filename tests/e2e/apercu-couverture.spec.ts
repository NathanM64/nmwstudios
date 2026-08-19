import { expect, test } from '@playwright/test'
import { OPTIONS, SOCLE_ID, optionParId } from '../../lib/config/catalogue'
import { sceneDeOption } from '../../lib/config/scenes'

// Le socle est toujours retenu et ne se décoche pas : son effet est la maquette
// elle-même, vérifié à part plutôt que masqué par un saut silencieux.
test('le socle rend la maquette de base', async ({ page }) => {
  await page.goto('/configurateur')
  await expect(page.getByTestId('site-nav').getByRole('listitem')).toHaveCount(3)
  await expect(page.getByTestId('site-formulaire')).toBeVisible()
})

for (const option of OPTIONS.filter((o) => o.id !== SOCLE_ID)) {
  test(`l’option ${option.id} change l’aperçu de sa scène`, async ({ page }) => {
    await page.goto('/configurateur')

    // `essentiel` est retenue au démarrage par CONFIG_DEPART : sans état de
    // référence neutre, la cocher ne changerait rien et le test échouerait à tort.
    if (option.groupe === 'recurrent' && option.id !== 'sans-suivi') {
      await page.getByRole('radio', { name: 'Je m’en occupe moi-même', exact: true }).check()
    }

    const scene = sceneDeOption(option.id)
    await page.getByTestId(`onglet-${scene}`).click()

    const apercu = page.getByTestId('apercu')
    const avant = await apercu.innerHTML()

    if (option.quantifiable) {
      await page.getByRole('button', { name: `Ajouter : ${option.libelle}` }).click()
    } else if (option.groupe === 'recurrent') {
      await page.getByRole('radio', { name: option.libelle, exact: true }).check()
    } else {
      await page.getByRole('checkbox', { name: option.libelle, exact: true }).check()
    }

    await expect.poll(() => apercu.innerHTML()).not.toBe(avant)
  })
}

test('le catalogue et les scènes couvrent bien trente options', async ({ page }) => {
  // Garde-fou : si le catalogue grossit, la boucle ci-dessus grossit avec lui.
  expect(OPTIONS.length).toBe(30)
  expect(optionParId(SOCLE_ID)).toBeDefined()
})
