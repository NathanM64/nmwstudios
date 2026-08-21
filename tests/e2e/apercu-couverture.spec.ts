import { expect, test } from '@playwright/test'
import { OPTIONS, SOCLE_ID, optionParId } from '../../lib/config/catalogue'
import { ancreDeOption, sceneDeOption } from '../../lib/config/scenes'
import { ecartAAncre } from './fenetre'

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
    // Empreinte structurelle : les nœuds réellement présents et leurs identifiants de test.
    // Un `data-retenu` ou une classe d'état qui bascule seul ne fait plus passer ce test.
    const empreinte = () =>
      apercu.evaluate((el) => {
        const noeuds = [...el.querySelectorAll('*')]
        const ids = noeuds.map((n) => n.getAttribute('data-testid') ?? '').filter(Boolean).sort()
        return `${noeuds.length} nœuds · ${ids.join(',')}`
      })
    const avant = await empreinte()

    if (option.quantifiable) {
      await page.getByRole('button', { name: `Ajouter : ${option.libelle}` }).click()
    } else if (option.groupe === 'recurrent') {
      await page.getByRole('radio', { name: option.libelle, exact: true }).check()
    } else {
      await page.getByRole('checkbox', { name: option.libelle, exact: true }).check()
    }

    await expect.poll(empreinte, { message: `${option.id} n’ajoute aucun artefact à l’aperçu` }).not.toBe(avant)

    // L'empreinte porte sur tout l'aperçu, et les trois parties sont montées en permanence :
    // sans ce constat de position, les vingt-neuf options pourraient viser la même ancre.
    const ancre = ancreDeOption(option.id)
    await expect
      .poll(() => ecartAAncre(page, ancre), { message: `${option.id} ne pose pas la page sur ${ancre}` })
      .toBeLessThan(2)
  })
}

test('le catalogue et les scènes couvrent bien trente options', () => {
  // Garde-fou : si le catalogue grossit, la boucle ci-dessus grossit avec lui.
  expect(OPTIONS.length).toBe(30)
  expect(optionParId(SOCLE_ID)).toBeDefined()
})
