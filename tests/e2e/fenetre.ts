import type { Page } from '@playwright/test'

/** Un repère est-il réellement dans la fenêtre de l'aperçu ?
 *
 *  `toBeVisible` de Playwright ignore l'écrêtage par un ancêtre : depuis que les trois parties
 *  sont montées en permanence, un contenu peint hors de la fenêtre passerait pour visible.
 *  Piège déjà payé sur ce projet, voir la passation du 19/08/2026. */
export async function dansLaFenetre(page: Page, repere: string): Promise<boolean> {
  return page.getByTestId('objet-scene').evaluate((fenetre, id) => {
    const cible = document.querySelector(`[data-testid="${id}"]`)
    if (!cible) return false
    // Boîte de contenu, pas boîte de bordure : la fenêtre écrête à l'intérieur de son filet,
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
 *  de React : c'est exactement ce que le bandeau prétend nommer.
 *
 *  Un pixel de tolérance : la page est mise à l'échelle, et la position la plus basse du
 *  document tombe une fraction de pixel au-dessus du haut de la dernière partie. */
export async function partieAuHautDeLaFenetre(page: Page): Promise<string | null> {
  return page.getByTestId('objet-scene').evaluate((fenetre) => {
    const haut = fenetre.getBoundingClientRect().top + fenetre.clientTop
    const prefixe = 'partie-'
    let trouvee: string | null = null
    for (const el of document.querySelectorAll(`[data-testid^="${prefixe}"]`)) {
      const boite = el.getBoundingClientRect()
      if (boite.top - 1 <= haut && boite.bottom > haut + 1) {
        trouvee = el.getAttribute('data-testid')!.slice(prefixe.length)
      }
    }
    return trouvee
  })
}
