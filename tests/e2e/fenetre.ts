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
