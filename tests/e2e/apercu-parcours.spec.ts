import { expect, test } from '@playwright/test'
import { OPTIONS, SOCLE_ID } from '../../lib/config/catalogue'
import { calculer, formaterEuros } from '../../lib/config/devis'
import { SCENES, sceneDeOption } from '../../lib/config/scenes'
import { SUSPENSION_MS } from '../../components/config/PanneauOptions'
import { amenerLaPartie, partieAuHautDeLaFenetre } from './fenetre'

test('cocher tout le catalogue dans l’ordre garde aperçu, scène et total cohérents', async ({ page }) => {
  test.slow()
  await page.goto('/configurateur')

  const config: Record<string, number> = { essentiel: 1 }

  for (const option of OPTIONS.filter((o) => o.id !== SOCLE_ID)) {
    if (option.quantifiable) {
      await page.getByRole('button', { name: `Ajouter : ${option.libelle}` }).click()
      config[option.id] = 1
    } else if (option.groupe === 'recurrent') {
      await page.getByRole('radio', { name: option.libelle, exact: true }).check()
      for (const autre of OPTIONS.filter((o) => o.groupe === 'recurrent')) delete config[autre.id]
      config[option.id] = 1
    } else {
      await page.getByRole('checkbox', { name: option.libelle, exact: true }).check()
      config[option.id] = 1
    }

    // La scène commutée est celle de l'option qu'on vient de poser, lue sur la page peinte.
    await expect
      .poll(() => partieAuHautDeLaFenetre(page), { message: `${option.id} n’amène pas sa partie` })
      .toBe(sceneDeOption(option.id))

    // Comparaison sur la chaîne formatée : « 1 500 € » porte une espace de milliers,
    // qu'un découpage naïf du nombre brut ne retrouverait jamais.
    const attendu = calculer(config)
    await expect(page.getByTestId('prix')).toHaveText(formaterEuros(attendu.total))
  }

  // Attente franche au delà de la suspension du relevé : le dernier cochage vient de l'armer,
  // et un geste de défilement achevé dans ce délai est perdu sans être rejoué.
  await page.waitForTimeout(SUSPENSION_MS + 400)

  // Toutes les parties restent atteignables une fois tout coché, par le défilement du
  // formulaire : l'aide échoue si la partie visée n'entre pas dans la fenêtre.
  for (const scene of SCENES) await amenerLaPartie(page, scene.id)
})

test('le récapitulatif final reprend les mêmes montants que la barre', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByRole('checkbox', { name: 'Espace membre', exact: true }).check()
  await page.getByRole('checkbox', { name: 'Paiement en ligne', exact: true }).check()

  const barre = await page.getByTestId('prix').textContent()
  await page.getByTestId('recapitulatif-final').scrollIntoViewIfNeeded()
  await expect(page.getByTestId('recapitulatif-final')).toContainText(barre!.trim())
})
