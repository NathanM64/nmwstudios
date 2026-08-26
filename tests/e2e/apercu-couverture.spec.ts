import { expect, test } from '@playwright/test'
import { OPTIONS, SOCLE_ID, optionParId } from '../../lib/config/catalogue'
import { endroitDeOption } from '../../lib/config/endroits'
import { ecartALaVisee } from './fenetre'

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

    const apercu = page.getByTestId('apercu')
    // Empreinte structurelle et picturale : les nœuds présents, leurs identifiants de test, et
    // le dessin réellement peint de ceux qui portent une image. Une option qui ne change qu'un
    // cadrage ou une dominante ne pose aucun repère neuf, et les nœuds seuls la diraient muette.
    const empreinte = () =>
      apercu.evaluate((el) => {
        const noeuds = [...el.querySelectorAll('*')]
        const ids = noeuds.map((n) => n.getAttribute('data-testid') ?? '').filter(Boolean).sort()
        const peints = noeuds
          .map((n) => getComputedStyle(n))
          .filter((s) => s.backgroundImage !== 'none')
          .map((s) => `${s.backgroundImage}@${s.backgroundPosition}`)
          .sort()
        return `${noeuds.length} nœuds · ${ids.join(',')} · ${peints.join(',')}`
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
    // sans ce constat de position, les vingt-neuf options pourraient viser le même endroit.
    const endroit = endroitDeOption(option.id)
    await expect
      .poll(() => ecartALaVisee(page, endroit), { message: `${option.id} ne pose pas la page sur ${endroit}` })
      .toBeLessThan(2)
  })
}

test('le catalogue et les scènes couvrent bien trente options', () => {
  // Garde-fou : si le catalogue grossit, la boucle ci-dessus grossit avec lui.
  expect(OPTIONS.length).toBe(30)
  expect(optionParId(SOCLE_ID)).toBeDefined()
})
