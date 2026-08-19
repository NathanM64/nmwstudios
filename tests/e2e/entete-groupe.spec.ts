import { expect, test, type Page } from '@playwright/test'
import sharp from 'sharp'

type Zone = { x: number; y: number; width: number; height: number }

/** Couleur moyenne d’une zone réellement peinte : seul moyen de voir ce qu'un fond laisse passer. */
async function couleurMoyenne(page: Page, zone: Zone): Promise<[number, number, number]> {
  const png = await page.screenshot({ clip: zone })
  const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true })
  const somme = [0, 0, 0]
  const pixels = info.width * info.height
  for (let i = 0; i < pixels; i++) {
    for (let c = 0; c < 3; c++) somme[c] += data[i * info.channels + c]
  }
  return somme.map((s) => s / pixels) as [number, number, number]
}

const ecart = (a: number[], b: number[]) => Math.max(...a.map((v, i) => Math.abs(v - b[i])))

// `visibility`, jamais `display` : masquer la légende du flux décalerait tout de 32 px
// et la zone mesurée ne montrerait plus le même endroit de la page.
const SANS_CARTES = '[data-testid^="carte-"] { visibility: hidden }'
const PANNEAU_NU = '[data-testid="colonne-options"] * { visibility: hidden }'

/** Cale une carte derrière la légende collante et rend les repères de mesure, à droite du titre. */
async function placerCarteDerriere(page: Page) {
  await page.getByTestId('carte-membre').scrollIntoViewIfNeeded()
  return page.evaluate(() => {
    const panneau = document.querySelector('[data-testid="colonne-options"]')!
    const legende = document.querySelector('[data-testid="legende-fonctionnel"]')!
    const carte = () => document.querySelector('[data-testid="carte-membre"]')!.getBoundingClientRect()
    panneau.scrollTop += carte().top - (legende.getBoundingClientRect().top - 12)

    const boite = legende.getBoundingClientRect()
    const texte = document.createRange()
    texte.selectNodeContents(legende)
    return {
      // À droite du titre : que du fond, aucun glyphe ne fausse la moyenne.
      x: texte.getBoundingClientRect().right + 12,
      bande: boite.y + 3,
      hauteurBande: boite.height - 9,
      basBande: boite.bottom,
      basCarte: carte().bottom,
    }
  })
}

async function poserTheme(page: Page, theme: 'dark' | 'light') {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/configurateur')
  await page.evaluate((t) => {
    document.documentElement.dataset.theme = t
  }, theme)
}

for (const theme of ['dark', 'light'] as const) {
  test(`en thème ${theme}, la légende collante ne pose aucune bande sur l’ambiance`, async ({ page }) => {
    await poserTheme(page, theme)
    const repere = await placerCarteDerriere(page)
    const zone = { x: repere.x, y: repere.bande, width: 40, height: repere.hauteurBande }

    const avecCarte = await couleurMoyenne(page, zone)
    await page.addStyleTag({ content: SANS_CARTES })
    const sansCarte = await couleurMoyenne(page, zone)
    await page.addStyleTag({ content: PANNEAU_NU })
    const fondDePage = await couleurMoyenne(page, zone)

    expect(ecart(avecCarte, sansCarte), 'la carte transparaît sous le titre').toBeLessThanOrEqual(1)
    expect(ecart(sansCarte, fondDePage), 'la légende pose une bande distincte du fond de page').toBeLessThanOrEqual(2)
  })

  test(`en thème ${theme}, la carte s’estompe sous la légende au lieu de passer sous une arête`, async ({ page }) => {
    await poserTheme(page, theme)
    // Carte repeinte en rouge plein : la teinte réelle d'une carte est trop proche du fond
    // pour qu'un fondu s'y mesure. Le rouge ne change que ce qui est masqué ou non.
    await page.addStyleTag({ content: '[data-testid="carte-membre"] { background-color: rgb(255, 0, 0) !important }' })
    const repere = await placerCarteDerriere(page)

    const zones = {
      sousLeTitre: { x: repere.x, y: repere.bande, width: 40, height: repere.hauteurBande },
      dansLeFondu: { x: repere.x, y: repere.basBande + 5, width: 40, height: 3 },
      enClair: { x: repere.x, y: repere.basCarte - 8, width: 40, height: 4 },
    }
    const rouge: Record<string, [number, number, number]> = {}
    for (const [nom, zone] of Object.entries(zones)) rouge[nom] = await couleurMoyenne(page, zone)

    await page.addStyleTag({ content: PANNEAU_NU })
    const fond: Record<string, [number, number, number]> = {}
    for (const [nom, zone] of Object.entries(zones)) fond[nom] = await couleurMoyenne(page, zone)

    const visible = (nom: string) => ecart(rouge[nom], fond[nom])
    expect(visible('enClair'), 'la carte hors de la légende doit rester pleine').toBeGreaterThan(100)
    expect(visible('sousLeTitre'), 'la carte transparaît sous le titre').toBeLessThanOrEqual(2)
    expect(visible('dansLeFondu'), 'aucun fondu : la carte réapparaît d’un coup').toBeGreaterThan(20)
    expect(visible('dansLeFondu'), 'aucun fondu : la carte est déjà pleine sous la légende').toBeLessThan(
      visible('enClair') - 20
    )
  })
}
