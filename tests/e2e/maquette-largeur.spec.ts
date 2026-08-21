import { expect, test, type Page } from '@playwright/test'

/** Largeur de contenu du cadre, et largeur que la maquette occupe dedans. La promesse du socle
 *  est qu'elles sont égales : plus aucune colonne n'a de vide à droite. */
async function largeurs(page: Page): Promise<{ colonne: number; maquette: number }> {
  // Bordures retirées à la main : `clientWidth` est entier et son arrondi passerait pour du vide.
  return page.getByTestId('maquette').evaluate((maquette) => {
    const cadre = maquette.closest('.cadre-maquette') as HTMLElement
    return {
      colonne: cadre.getBoundingClientRect().width - cadre.clientLeft * 2,
      maquette: maquette.getBoundingClientRect().width,
    }
  })
}

async function palier(page: Page): Promise<string> {
  return page
    .getByTestId('maquette')
    .evaluate((n) => getComputedStyle(n).getPropertyValue('--palier').trim())
}

// Table écrite à la main, pas dérivée du CSS : c'est elle l'oracle, `--palier` est l'observation.
// Colonne = fenêtre moins 540 côte à côte, moins 92 empilée, moins 68 sous `sm` où la grille
// passe de `px-8` à `px-5`. Mesuré le 21/08/2026, la passation annonçait 92 partout.
const ATTENDU = [
  { fenetre: 1920, maquette: 1380, palier: 'bureau' },
  { fenetre: 1600, maquette: 1060, palier: 'bureau' },
  { fenetre: 1440, maquette: 900, palier: 'bureau' },
  { fenetre: 1280, maquette: 740, palier: 'bureau' },
  { fenetre: 1024, maquette: 932, palier: 'bureau' },
  { fenetre: 768, maquette: 676, palier: 'tablette' },
  { fenetre: 390, maquette: 322, palier: 'telephone' },
]

test('la maquette remplit sa colonne à toutes les largeurs', async ({ page }) => {
  await page.goto('/configurateur')
  for (const cas of ATTENDU) {
    await page.setViewportSize({ width: cas.fenetre, height: 900 })
    const { colonne, maquette } = await largeurs(page)
    expect(maquette, `maquette à ${cas.fenetre}`).toBeCloseTo(colonne, 1)
    expect(colonne, `colonne à ${cas.fenetre}`).toBeCloseTo(cas.maquette, 1)
  }
})

test('le palier suit la largeur de la maquette, pas celle de la fenêtre', async ({ page }) => {
  await page.goto('/configurateur')
  for (const cas of ATTENDU) {
    await page.setViewportSize({ width: cas.fenetre, height: 900 })
    expect(await palier(page), `palier à ${cas.fenetre}`).toBe(cas.palier)
  }
})

// 1024 empilé donne une maquette de 932 px, donc le palier bureau, alors que la fenêtre dirait
// tablette. C'est le cas qui interdit les requêtes média, il mérite son propre filet.
test('à 1024 empilé, la maquette est en bureau alors que la fenêtre dit tablette', async ({ page }) => {
  await page.goto('/configurateur')
  await page.setViewportSize({ width: 1024, height: 900 })
  const { maquette } = await largeurs(page)
  expect(maquette, 'largeur de maquette à 1024').toBeGreaterThan(700)
  expect(await palier(page)).toBe('bureau')
})
