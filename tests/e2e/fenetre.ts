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

/** Écart, en pixels logiques, entre la position posée du rouleau et celle que cette ancre
 *  commande. Zéro veut dire que c'est bien elle qui est en haut de la fenêtre.
 *
 *  L'attendu est rabattu sur la position la plus basse, comme `positionCible` le fait : une
 *  ancre plus basse que ce plancher n'est pas atteignable, et `deroule-mensuel` est dans ce cas.
 *
 *  Une ancre absente du relevé rend `Infinity` et non `NaN` : les ancres conditionnelles vont
 *  se multiplier, et un `NaN` sondé expire sur un message qui ne dit pas laquelle manque. */
export async function ecartAAncre(page: Page, ancre: string): Promise<number> {
  return page.getByTestId('rouleau').evaluate((rouleau: HTMLElement, a) => {
    const releve = JSON.parse(rouleau.dataset.mesures!) as Record<string, number>
    if (releve[a] === undefined) return Number.POSITIVE_INFINITY
    const fenetre = rouleau.closest('.cadre-maquette')
    if (!fenetre) throw new Error('cadre-maquette introuvable')
    const echelle = parseFloat(getComputedStyle(rouleau.parentElement!).scale) || 1
    const max = Math.max(0, rouleau.offsetHeight - fenetre.clientHeight / echelle)
    const y = Math.abs(parseFloat(getComputedStyle(rouleau).translate.split(' ')[1] ?? '0'))
    return Math.abs(y - Math.min(releve[a], max))
  }, ancre)
}

/** Amène une partie dans la fenêtre par le seul chemin qui reste depuis la disparition des
 *  repères : défiler le formulaire jusqu'au groupe dont l'ancre est la tête de cette partie.
 *
 *  Le groupe est dérivé, jamais écrit à la main : une ancre de groupe déplacée déplace l'aide
 *  avec elle. `block: 'start'` plutôt que `scrollIntoViewIfNeeded`, qui laisserait le groupe
 *  sous la ligne de lecture, donc l'aperçu où il était.
 *
 *  L'attente fait partie de l'aide : la translation passe par une transition, et juger le
 *  contenu d'une scène pendant qu'elle arrive reviendrait à lire une image de mouvement. */
export async function amenerLaPartie(page: Page, partie: SceneId): Promise<void> {
  const groupe = GROUPES.find((g) => ANCRE_PAR_GROUPE[g.id] === ANCRE_DE_TETE[partie])
  if (!groupe) throw new Error(`aucun groupe ne vise la tête de la partie ${partie}`)
  await page.locator(`[data-groupe="${groupe.id}"]`).evaluate((el) => el.scrollIntoView({ block: 'start' }))
  await expect
    .poll(() => dansLaFenetre(page, `partie-${partie}`), {
      message: `défiler jusqu’au groupe « ${groupe.titre} » n’amène pas ${partie} dans la fenêtre`,
    })
    .toBe(true)
}
