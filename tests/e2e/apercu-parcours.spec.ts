import { expect, test } from '@playwright/test'
import { OPTIONS, SOCLE_ID } from '../../lib/config/catalogue'
import { calculer, formaterEuros } from '../../lib/config/devis'
import { sceneDeOption } from '../../lib/config/scenes'

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

    // La scène commutée est celle de l'option qu'on vient de poser.
    await expect(page.getByTestId(`onglet-${sceneDeOption(option.id)}`)).toHaveAttribute('aria-pressed', 'true')

    // Comparaison sur la chaîne formatée : « 1 500 € » porte une espace de milliers,
    // qu'un découpage naïf du nombre brut ne retrouverait jamais.
    const attendu = calculer(config)
    await expect(page.getByTestId('prix')).toHaveText(formaterEuros(attendu.total))
  }

  // Toutes les scènes restent regardables une fois tout coché.
  for (const scene of ['site', 'preuve', 'deroule']) {
    await page.getByTestId(`onglet-${scene}`).click()
    await expect(page.getByTestId('objet-scene')).toBeVisible()
  }
})

test('le récapitulatif final reprend les mêmes montants que la barre', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByRole('checkbox', { name: 'Espace membre', exact: true }).check()
  await page.getByRole('checkbox', { name: 'Paiement en ligne', exact: true }).check()

  const barre = await page.getByTestId('prix').textContent()
  await page.getByTestId('recapitulatif-final').scrollIntoViewIfNeeded()
  await expect(page.getByTestId('recapitulatif-final')).toContainText(barre!.trim())
})
