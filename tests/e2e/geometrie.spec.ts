import { expect, test } from '@playwright/test'
import { mkdirSync, writeFileSync } from 'node:fs'
import { STYLES } from '../../lib/config/styles'
import { hydrate } from './fenetre'

/** Relevé jetable : il constate au pixel que déplacer le JSX vers des blocs ne déplace aucun
 *  dessin. Muet sans `RELEVE`, sinon il tomberait à chaque passe ordinaire. Supprimé au lot 2. */

// Seuils du conteneur de la maquette, pas de la fenêtre : 1024 et 1920 rendaient tous deux le
// palier bureau. Repris de la table mesurée dans tests/e2e/maquette-largeur.spec.ts.
const LARGEURS = [390, 768, 1920]

const CONFIGS = {
  depart: '/configurateur',
  tout: '/configurateur?pages=4&langue=3&redaction=15&reprise&photos&visuels&blog&article=10&membre&formulaire&rdv&newsletter&paiement&seo&seo-local&perf&a11y&rgpd&legal&migration&domaine&cadrage&formation&express&partenaire',
}

/** Rectangles de tous les repères du rouleau, mesurés depuis son propre haut : la translation
 *  de la position s'annule, et le relevé ne dit rien d'où la page est posée. */
async function rectangles(page: import('@playwright/test').Page) {
  return page.getByTestId('rouleau').evaluate((rouleau: HTMLElement) => {
    const echelle = parseFloat(getComputedStyle(rouleau.parentElement!).scale) || 1
    const origine = rouleau.getBoundingClientRect()
    const rond = (v: number) => Math.round((v / echelle) * 100) / 100
    const vus = new Map<string, number>()
    const sortie: Record<string, number[]> = {}
    for (const el of rouleau.querySelectorAll<HTMLElement>('[data-testid]')) {
      const nom = el.dataset.testid!
      // Les repères se répètent : huit lignes de preuve, six créneaux, trois services.
      const rang = (vus.get(nom) ?? 0) + 1
      vus.set(nom, rang)
      const r = el.getBoundingClientRect()
      sortie[`${nom}#${rang}`] = [rond(r.left - origine.left), rond(r.top - origine.top), rond(r.width), rond(r.height)]
    }
    return {
      palier: getComputedStyle(rouleau.closest('[data-testid="maquette"]')!).getPropertyValue('--palier').trim(),
      repere: sortie,
    }
  })
}

/** Un rectangle lu pendant qu'une animation d'entrée court situe le bloc là où il passe. */
async function animationsFinies(page: import('@playwright/test').Page) {
  await page
    .getByTestId('rouleau')
    .evaluate((r) =>
      Promise.all(r.getAnimations({ subtree: true }).map((a) => a.finished.catch(() => undefined))).then(() => undefined)
    )
  // Le compteur de la preuve s'anime par requestAnimationFrame, hors de l'API Web Animations :
  // sans cette attente, le relevé tombait sur sa largeur de passage plutôt que sur sa largeur posée.
  await expect(page.getByTestId('preuve-score')).toHaveAttribute('data-anime', 'non')
}

test('relevé de géométrie', async ({ page }) => {
  test.skip(!process.env.RELEVE, 'relevé jetable : lancer avec RELEVE=avant ou RELEVE=apres')
  test.slow()

  const releve: Record<string, unknown> = {}
  for (const [nomConfig, url] of Object.entries(CONFIGS)) {
    for (const largeur of LARGEURS) {
      await page.setViewportSize({ width: largeur, height: 900 })
      await page.goto(url)
      await hydrate(page)
      for (const style of STYLES) {
        await page.getByTestId('selecteur-style').selectOption(style.id)
        await animationsFinies(page)
        releve[`${nomConfig}/${largeur}/${style.id}`] = await rectangles(page)
      }
    }
  }

  mkdirSync('docs/superpowers/geometrie', { recursive: true })
  writeFileSync(`docs/superpowers/geometrie/${process.env.RELEVE}.json`, JSON.stringify(releve, null, 2))
})
