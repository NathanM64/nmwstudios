import { expect, test } from '@playwright/test'
import { pireBandeVide } from './vide'

test('le socle seul rend une page complète, sans aucune option', async ({ page }) => {
  await page.goto('/configurateur')
  for (const repere of ['site-enseigne', 'site-titre', 'site-corps', 'site-services', 'site-formulaire', 'site-filet']) {
    await expect(page.getByTestId(repere)).toBeVisible()
  }
  await expect(page.getByTestId('site-service')).toHaveCount(3)
})

test('le titre est nettement plus grand que le corps', async ({ page }) => {
  await page.goto('/configurateur')
  const t = await page.getByTestId('site-titre').evaluate((n) => parseFloat(getComputedStyle(n).fontSize))
  const c = await page.getByTestId('site-corps').evaluate((n) => parseFloat(getComputedStyle(n).fontSize))
  // Une hiérarchie molle est ce qui faisait ressembler la maquette à un filaire.
  expect(t).toBeGreaterThan(c * 2.2)
})

test('le titre emprunte la famille typographique du style', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByTestId('selecteur-style').selectOption('editorial')
  const famille = await page.getByTestId('site-titre').evaluate((n) => getComputedStyle(n).fontFamily)
  expect(famille.toLowerCase()).toContain('georgia')
})

// Le vide se mesure sur la partie, `objet-scene` étant la fenêtre, et sur le contenu peint,
// pas sur les nœuds : voir tests/e2e/vide.ts.
const CAS = {
  'sans aucune option': '/configurateur',
  'toutes options cochées': '/configurateur?pages=4&langue=3&redaction=15&reprise&photos&visuels&blog&article=10&membre&formulaire&rdv&newsletter&paiement',
}

for (const [nom, url] of Object.entries(CAS)) {
  test(`la scène du site remplit son cadre, ${nom}`, async ({ page }) => {
    await page.goto(url)
    const vide = await page.getByTestId('partie-site').evaluate(pireBandeVide)
    expect(vide).toBeLessThan(0.25)
  })
}
