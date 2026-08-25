import { expect, test } from '@playwright/test'
import { CONTROLES } from '../../components/config/scenes/ScenePreuve'
import { pireBandeVide } from './vide'
import { hydrate } from './fenetre'

const TOUT_COCHE =
  '/configurateur?pages=4&langue=3&redaction=15&reprise&photos&visuels&blog&article=10&membre&formulaire&rdv&newsletter&paiement&seo&seo-local&perf&a11y&rgpd&legal&migration&domaine&cadrage&formation&express&partenaire'

test('le compteur de contrôles domine la scène', async ({ page }) => {
  await page.goto('/configurateur?seo&perf')
  const score = await page.getByTestId('preuve-score').evaluate((n) => parseFloat(getComputedStyle(n).fontSize))
  const ligne = await page
    .getByTestId('preuve-ligne')
    .first()
    .evaluate((n) => parseFloat(getComputedStyle(n).fontSize))
  expect(score).toBeGreaterThan(ligne * 2.5)
})

test('les lignes retenues portent l’accent du style, les autres restent lisibles', async ({ page }) => {
  await page.goto('/configurateur?seo')
  const retenue = page.getByTestId('preuve-ligne').filter({ hasText: 'résultats' })
  await expect(retenue).toHaveAttribute('data-retenu', 'oui')
  const opacite = await page
    .getByTestId('preuve-ligne')
    .last()
    .evaluate((n) => parseFloat(getComputedStyle(n).opacity))
  expect(opacite).toBeGreaterThanOrEqual(0.7)
})

test('la scène de la preuve remplit son cadre, sans bande vide notable', async ({ page }) => {
  await page.goto('/configurateur?seo&perf&rgpd')
  const vide = await page.getByTestId('partie-preuve').evaluate(pireBandeVide)
  expect(vide).toBeLessThan(0.25)
})

/** Repères que chaque contrôle retenu doit peindre, avec le contrôle qui les porte. La cascade
 *  en pose deux, les sept autres blocs un chacun. */
const DETAILS: readonly (readonly [string, string])[] = [
  ['seo', 'preuve-serp'],
  ['seo-local', 'preuve-seo-local'],
  ['perf', 'preuve-cascade'],
  ['perf', 'preuve-vitesse'],
  ['a11y', 'apercu-a11y'],
  ['rgpd', 'preuve-rgpd'],
  ['legal', 'preuve-legal'],
  ['migration', 'preuve-redirections'],
  ['domaine', 'preuve-domaine'],
]

test('les huit contrôles retenus rendent chacun leur détail', async ({ page }) => {
  // Table dérivée du composant : un contrôle ajouté sans détail listé sortirait du filet.
  const couverts = [...new Set(DETAILS.map(([controle]) => controle))].sort()
  expect(couverts, 'un contrôle du composant n’a aucun détail listé').toEqual(
    CONTROLES.map((c) => c.id as string).sort()
  )

  await page.goto(TOUT_COCHE)
  await hydrate(page)
  for (const [controle, repere] of DETAILS) {
    // Ancré dans la ligne du contrôle : sur la page entière, le filet passerait aussi si deux
    // contrôles échangeaient leur composant.
    const ligne = page.locator(`[data-endroit="preuve-ligne-${controle}"]`)
    await expect(ligne.getByTestId(repere), `${repere} manque dans la ligne ${controle}`).toHaveCount(1)
  }
})
