import { expect, test } from '@playwright/test'
import { GROUPES } from '../../lib/config/catalogue'
import { ANCRE_PAR_GROUPE, partieDeAncre } from '../../lib/config/scenes'
import { calculer, formaterEuros } from '../../lib/config/devis'
import { CONFIG_DEPART } from '../../components/config/Configurateur'
import { dansLaFenetre } from './fenetre'

/** `block: 'start'` plutôt que `scrollIntoViewIfNeeded` : ce dernier fait le défilement
 *  minimal, et laisserait le groupe sous la ligne de lecture. */
async function amener(page: import('@playwright/test').Page, groupe: string) {
  await page.locator(`[data-groupe="${groupe}"]`).evaluate((el) => el.scrollIntoView({ block: 'start' }))
}

async function position(page: import('@playwright/test').Page) {
  return page.getByTestId('rouleau').evaluate((n) => {
    const t = getComputedStyle(n).translate
    return Math.abs(parseFloat(t.split(' ')[1] ?? '0'))
  })
}

/** Attend que la translation cesse de bouger. Elle passe par une transition de 320 ms : une
 *  référence prise pendant le mouvement ferait passer un test sur le seul élan de la précédente. */
async function positionPosee(page: import('@playwright/test').Page) {
  let precedente = NaN
  await expect
    .poll(
      async () => {
        const actuelle = await position(page)
        const posee = actuelle === precedente
        precedente = actuelle
        return posee
      },
      { message: 'la position du rouleau ne se pose pas' }
    )
    .toBe(true)
  return precedente
}

/** Ce qui reste du document sous la fenêtre, en pixels logiques. */
async function resteSousLeBas(page: import('@playwright/test').Page) {
  return page.getByTestId('rouleau').evaluate((rouleau: HTMLElement) => {
    const maquette = rouleau.parentElement!
    const fenetre = rouleau.closest('.cadre-maquette') as HTMLElement
    const echelle = parseFloat(getComputedStyle(maquette).scale) || 1
    const y = Math.abs(parseFloat(getComputedStyle(rouleau).translate.split(' ')[1] ?? '0'))
    return rouleau.offsetHeight - fenetre.clientHeight / echelle - y
  })
}

test('faire défiler le formulaire fait suivre l’aperçu, sans rien cocher', async ({ page }) => {
  await page.goto('/configurateur')
  await expect(page.getByTestId('onglet-site')).toHaveAttribute('aria-pressed', 'true')

  await amener(page, 'conformite')
  await expect(page.getByTestId('onglet-preuve')).toHaveAttribute('aria-pressed', 'true')

  await amener(page, 'services')
  await expect(page.getByTestId('onglet-deroule')).toHaveAttribute('aria-pressed', 'true')

  await amener(page, 'contenu')
  await expect(page.getByTestId('onglet-site')).toHaveAttribute('aria-pressed', 'true')

  // Rien n'a été coché : le prix est resté celui du départ.
  await expect(page.getByTestId('prix')).toHaveText(formaterEuros(calculer(CONFIG_DEPART).total))
})

test('chaque groupe amène sa propre scène', async ({ page }) => {
  await page.goto('/configurateur')
  for (const groupe of GROUPES) {
    await amener(page, groupe.id)
    await expect(
      page.getByTestId(`onglet-${partieDeAncre(ANCRE_PAR_GROUPE[groupe.id])}`),
      `le groupe « ${groupe.titre} » n’amène pas sa scène`
    ).toHaveAttribute('aria-pressed', 'true')
  }
})

test('le défilement reprend la main sur un choix d’onglet', async ({ page }) => {
  await page.goto('/configurateur')
  await amener(page, 'conformite')
  await page.getByTestId('onglet-site').click()
  await expect(page.getByTestId('onglet-site')).toHaveAttribute('aria-pressed', 'true')

  // La lecture pilote la position en continu : un choix d'onglet est un saut, pas un verrou,
  // et le premier cran de défilement redevient la source. La molette part de l'onglet, donc
  // hors du panneau : c'est la redirection de Configurateur qui la fait descendre le formulaire.
  await page.mouse.wheel(0, 60)
  await expect(page.getByTestId('onglet-preuve')).toHaveAttribute('aria-pressed', 'true')
})


test('la page descend continûment, pas par sauts de partie', async ({ page }) => {
  await page.goto('/configurateur')
  await amener(page, 'volume')
  const debut = await positionPosee(page)

  // Un cran de défilement à l'intérieur du même groupe doit déjà déplacer la page.
  await page.locator('[data-testid="colonne-options"]').evaluate((n) => n.scrollBy(0, 120))
  await expect.poll(() => position(page)).toBeGreaterThan(debut)

  // Et sans avoir atteint le groupe suivant : la page n'a pas sauté à l'ancre d'après.
  await expect(page.getByTestId('onglet-site')).toHaveAttribute('aria-pressed', 'true')
})

test('deux groupes visant la même ancre ne déplacent pas la page', async ({ page }) => {
  await page.goto('/configurateur')
  await amener(page, 'visibilite')
  const surLeRapport = await positionPosee(page)

  // `visibilite` et `conformite` visent tous deux le rapport : traverser le premier ne doit
  // pas emmener la page ailleurs. Seul `technique`, dernier avant le déroulé, s'en approche.
  await amener(page, 'conformite')
  expect(Math.abs((await positionPosee(page)) - surLeRapport)).toBeLessThan(4)
  expect(await dansLaFenetre(page, 'partie-deroule')).toBe(false)
})

test('la fin du catalogue atteint le bas du document', async ({ page }) => {
  await page.goto('/configurateur')
  await amener(page, 'recurrent')
  await page.locator('[data-testid="colonne-options"]').evaluate((n) => n.scrollBy(0, 4000))
  // Le bas du document doit être atteignable : sinon la dernière partie reste inaccessible.
  await expect.poll(() => resteSousLeBas(page)).toBeLessThan(4)
})
