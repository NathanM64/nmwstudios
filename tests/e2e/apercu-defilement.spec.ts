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
 *  référence prise pendant le mouvement ferait passer un test sur le seul élan de la précédente.
 *
 *  `depuis` est la position d'avant le geste, quand celui-ci doit déplacer la page : deux
 *  échantillons égaux ne disent pas si la page s'est posée ou si elle n'est pas encore partie,
 *  et sans ce constat préalable une position jamais partie passerait pour une position posée. */
async function positionPosee(page: import('@playwright/test').Page, depuis?: number) {
  if (depuis !== undefined) {
    await expect
      .poll(() => position(page), { message: 'la page n’a pas bougé' })
      .not.toBe(depuis)
  }
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

/** Décalages des ancres tels que le document les a relevés, en pixels logiques arrondis. */
async function offsetsPublies(page: import('@playwright/test').Page): Promise<Record<string, number>> {
  return page.getByTestId('rouleau').evaluate((n: HTMLElement) => JSON.parse(n.dataset.mesures!))
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
  const avant = await position(page)
  await amener(page, 'volume')
  const debut = await positionPosee(page, avant)

  // Un cran de défilement à l'intérieur du même groupe doit déjà déplacer la page.
  await page.locator('[data-testid="colonne-options"]').evaluate((n) => n.scrollBy(0, 120))
  const arrivee = await positionPosee(page, debut)
  expect(arrivee).toBeGreaterThan(debut)

  // Et sans avoir atteint l'ancre d'arrivée : la page interpole, elle ne saute pas. Deux pixels
  // de marge, `data-mesures` arrondissant ; l'écart attendu se compte en dizaines de pixels.
  const contenu = (await offsetsPublies(page))['site-contenu']
  expect(arrivee, `la page a sauté jusqu’à site-contenu, à ${contenu}`).toBeLessThan(contenu - 2)

  // Et sans avoir atteint le groupe suivant : la page n'a pas sauté à l'ancre d'après.
  await expect(page.getByTestId('onglet-site')).toHaveAttribute('aria-pressed', 'true')
})

test('deux groupes visant la même ancre ne déplacent pas la page', async ({ page }) => {
  await page.goto('/configurateur')
  const avant = await position(page)
  await amener(page, 'visibilite')
  const surLeRapport = await positionPosee(page, avant)

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

test('cocher une option garde sa scène au delà du rattrapage du relevé', async ({ page }) => {
  await page.goto('/configurateur')

  // `express` est la seule option dont la scène n'est pas celle de son groupe : elle montre le
  // déroulé quand `technique` vise le rapport. Le demi-tour s'y voit, il est muet ailleurs.
  await page.getByRole('checkbox', { name: 'Livraison accélérée', exact: true }).check()
  await expect(page.getByTestId('onglet-deroule')).toHaveAttribute('aria-pressed', 'true')
  await expect.poll(() => dansLaFenetre(page, 'partie-deroule')).toBe(true)

  // Attente franche au delà des 500 ms de suspension et des 16 ms du rattrapage : le clic a fait
  // défiler le panneau, et cette lecture subie ne doit pas reprendre la main après coup.
  await page.waitForTimeout(900)
  await expect(page.getByTestId('onglet-deroule')).toHaveAttribute('aria-pressed', 'true')
  expect(await dansLaFenetre(page, 'partie-deroule')).toBe(true)
})
