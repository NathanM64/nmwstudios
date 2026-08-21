import { expect, type Page } from '@playwright/test'
import { GROUPES } from '../../lib/config/catalogue'
import { ANCRE_DE_TETE, ANCRE_PAR_GROUPE, type SceneId } from '../../lib/config/scenes'

/** Un repère est-il réellement dans la fenêtre de l'aperçu ?
 *
 *  `toBeVisible` de Playwright ignore l'écrêtage par un ancêtre : depuis que les trois parties
 *  sont montées en permanence, un contenu peint hors de la fenêtre passerait pour visible.
 *  Piège déjà payé sur ce projet, voir la passation du 19/08/2026. */
export async function dansLaFenetre(page: Page, repere: string): Promise<boolean> {
  return page.getByTestId('objet-scene').evaluate((fenetre, id) => {
    // Recherche bornée à la fenêtre : un repère homonyme posé ailleurs sur la page répondrait.
    const cible = fenetre.querySelector(`[data-testid="${id}"]`)
    if (!cible) return false
    // Boîte de rembourrage, pas boîte de bordure : la fenêtre écrête à l'intérieur de son filet,
    // et ce pixel de bordure suffit à faire passer la partie d'après pour visible.
    const boite = fenetre.getBoundingClientRect()
    const f = {
      top: boite.top + fenetre.clientTop,
      bottom: boite.top + fenetre.clientTop + fenetre.clientHeight,
      left: boite.left + fenetre.clientLeft,
      right: boite.left + fenetre.clientLeft + fenetre.clientWidth,
    }
    const c = cible.getBoundingClientRect()
    return c.bottom > f.top + 1 && c.top < f.bottom - 1 && c.right > f.left + 1 && c.left < f.right - 1
  }, repere)
}

/** Partie que la fenêtre montre à son bord haut, lue sur la page peinte plutôt que sur l'état
 *  de React : oracle indépendant de la production, qui ne partage aucun calcul avec elle.
 *
 *  Un pixel de tolérance : la page est mise à l'échelle, et la position la plus basse du
 *  document tombe une fraction de pixel au-dessus du haut de la dernière partie. */
export async function partieAuHautDeLaFenetre(page: Page): Promise<string | null> {
  return page.getByTestId('objet-scene').evaluate((fenetre) => {
    const haut = fenetre.getBoundingClientRect().top + fenetre.clientTop
    const prefixe = 'partie-'
    let trouvee: string | null = null
    // Recherche bornée à la fenêtre : les parties ne vivent que dans le rouleau qu'elle contient.
    for (const el of fenetre.querySelectorAll(`[data-testid^="${prefixe}"]`)) {
      const boite = el.getBoundingClientRect()
      if (boite.top - 1 <= haut && boite.bottom > haut + 1) {
        trouvee = el.getAttribute('data-testid')!.slice(prefixe.length)
      }
    }
    return trouvee
  })
}

/** Écart, en pixels logiques, entre la position posée du rouleau et celle que viser cette ancre
 *  commande. Zéro veut dire que la page est posée là où le modèle le demande.
 *
 *  L'attendu est recalculé ici depuis les rectangles réels : la partie qui porte l'ancre, sa
 *  hauteur, celle de la fenêtre et le plancher du document. Aucun calcul n'est partagé avec la
 *  production, et le relevé publié n'est pas consulté.
 *
 *  Une ancre absente du DOM rend `Infinity` et non `NaN` : les ancres conditionnelles sont
 *  nombreuses, et un `NaN` sondé expire sur un message qui ne dit pas laquelle manque. */
export async function ecartALaVisee(page: Page, ancre: string): Promise<number> {
  return page.getByTestId('rouleau').evaluate((rouleau: HTMLElement, a) => {
    const cible = rouleau.querySelector<HTMLElement>(`[data-ancre="${a}"]`)
    if (!cible) return Number.POSITIVE_INFINITY
    const fenetre = rouleau.closest('.cadre-maquette')
    if (!fenetre) throw new Error('cadre-maquette introuvable')
    const partie = cible.closest<HTMLElement>('[data-testid^="partie-"]')
    if (!partie) throw new Error(`l’ancre ${a} n’est dans aucune partie`)

    const echelle = parseFloat(getComputedStyle(rouleau.parentElement!).scale) || 1
    const haut = rouleau.getBoundingClientRect().top
    const depuisLeHaut = (v: number) => (v - haut) / echelle
    const hauteurFenetre = fenetre.clientHeight / echelle

    const offset = depuisLeHaut(cible.getBoundingClientRect().top)
    const pHaut = depuisLeHaut(partie.getBoundingClientRect().top)
    const pBas = depuisLeHaut(partie.getBoundingClientRect().bottom)
    const plafond = Math.max(pHaut, pBas - hauteurFenetre)
    const max = Math.max(0, rouleau.offsetHeight - hauteurFenetre)

    const attendu = Math.min(Math.max(Math.min(Math.max(offset, pHaut), plafond), 0), max)
    const y = Math.abs(parseFloat(getComputedStyle(rouleau).translate.split(' ')[1] ?? '0'))
    return Math.abs(y - attendu)
  }, ancre)
}

/** Amène une partie en tête de la fenêtre par le seul chemin qui reste depuis la disparition
 *  des repères : défiler le formulaire jusqu'au groupe dont l'ancre est la tête de cette partie.
 *
 *  Le groupe est dérivé, jamais écrit à la main : une ancre de groupe déplacée déplace l'aide
 *  avec elle. `block: 'start'` plutôt que `scrollIntoViewIfNeeded`, qui laisserait le groupe
 *  sous la ligne de lecture, donc l'aperçu où il était.
 *
 *  L'arrivée fait partie de l'aide, et elle se constate au repos, jamais sur un sondage seul.
 *  À l'aller, `partieAuHautDeLaFenetre` attend bien que la partie visée gagne le haut de la
 *  fenêtre. En remontant, cette partie le couvre déjà : sa condition se réduit mot pour mot à
 *  celle de `dansLaFenetre`, vraie dès la première image, et la sonde se libérerait à une fenêtre
 *  de sa destination.
 *
 *  Ce que l'aide ne promet pas : se poser sur l'ancre de tête. La lecture interpole vers l'ancre
 *  du groupe suivant au prorata de l'avancement, et `scrollIntoView` laisse le groupe entamé.
 *  Mesuré à 1280 x 720 : 10,8 px de dérive pour le site, 422 pour le déroulé si le plancher de
 *  document ne les écrasait pas. Pour une position exacte, cocher une option, qui pose
 *  `progression: 0`. */
export async function amenerLaPartie(page: Page, partie: SceneId): Promise<void> {
  const groupe = GROUPES.find((g) => ANCRE_PAR_GROUPE[g.id] === ANCRE_DE_TETE[partie])
  if (!groupe) throw new Error(`aucun groupe ne vise la tête de la partie ${partie}`)
  await page.locator(`[data-groupe="${groupe.id}"]`).evaluate((el) => el.scrollIntoView({ block: 'start' }))
  await expect
    .poll(() => partieAuHautDeLaFenetre(page), {
      message: `défiler jusqu’au groupe « ${groupe.titre} » n’amène pas ${partie} en tête de fenêtre`,
    })
    .toBe(partie)
  // Le sondage ne prouve que le départ. Attente franche au delà de la transition, jamais un second
  // sondage : c'est la seule façon de constater qu'une position tient plutôt qu'elle passe.
  await page.waitForTimeout((await dureeDuVoyage(page)) + 120)
  expect(await partieAuHautDeLaFenetre(page), `${partie} quitte la tête de fenêtre avant le repos`).toBe(partie)
}

/** Durée de la transition du rouleau, lue sur la page plutôt qu'écrite ici : mise en dur, elle
 *  rendrait la main en pleine transition le jour où `--dur-page` s'allonge. */
async function dureeDuVoyage(page: Page): Promise<number> {
  return page.evaluate(() => {
    const brut = getComputedStyle(document.documentElement).getPropertyValue('--dur-page').trim()
    const valeur = parseFloat(brut)
    if (!Number.isFinite(valeur)) throw new Error(`--dur-page illisible : « ${brut} »`)
    return brut.endsWith('ms') ? valeur : valeur * 1000
  })
}

/** Attend que le configurateur soit hydraté. Avant, `selectOption` et `check` changent le DOM
 *  sans qu'aucun `onChange` ne parte : la sélection est perdue et le test échoue une fois sur
 *  trois. Mesuré le 21/08/2026 sur `selecteurs-maquette`, sondage expiré à 5 s sur la palette
 *  de la direction précédente. */
export async function hydrate(page: Page): Promise<void> {
  await expect(page.locator('[data-pret]')).toHaveAttribute('data-pret', 'oui')
}
