import { expect, test } from '@playwright/test'
import { GROUPES } from '../../lib/config/catalogue'
import { ANCRE_PAR_GROUPE, partieDeAncre } from '../../lib/config/scenes'
import { calculer, formaterEuros } from '../../lib/config/devis'
import { CONFIG_DEPART } from '../../components/config/Configurateur'
import { LIGNE_DE_LECTURE, SUSPENSION_MS } from '../../components/config/PanneauOptions'
import { dansLaFenetre, partieAuHautDeLaFenetre } from './fenetre'

/** La partie que la fenêtre montre à son bord haut, attendue : la translation passe par une
 *  transition, un constat immédiat lirait une image de mouvement. */
async function attendLaPartie(page: import('@playwright/test').Page, partie: string, message: string) {
  await expect.poll(() => partieAuHautDeLaFenetre(page), { message }).toBe(partie)
}

/** `block: 'start'` plutôt que `scrollIntoViewIfNeeded` : ce dernier fait le défilement
 *  minimal, et laisserait le groupe sous la ligne de lecture. */
async function amener(page: import('@playwright/test').Page, groupe: string) {
  await page.locator(`[data-groupe="${groupe}"]`).evaluate((el) => el.scrollIntoView({ block: 'start' }))
}

/** Amène la ligne de lecture au bas d'un groupe : sa traversée est alors achevée, et la page
 *  a rejoint l'ancre du groupe suivant. Le groupe d'après reste sous la ligne, séparé par la
 *  gouttière du panneau, donc c'est bien celui-ci qui est lu. */
async function finDuGroupe(page: import('@playwright/test').Page, groupe: string) {
  await page.locator(`[data-groupe="${groupe}"]`).evaluate((el, ligne) => {
    const colonne = document.querySelector<HTMLElement>('[data-testid="colonne-options"]')
    if (!colonne) throw new Error('colonne-options introuvable')
    colonne.scrollBy(0, el.getBoundingClientRect().bottom - window.innerHeight * ligne)
  }, LIGNE_DE_LECTURE)
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
  await attendLaPartie(page, 'site', 'l’aperçu ne s’ouvre pas sur le site')

  await amener(page, 'conformite')
  await attendLaPartie(page, 'preuve', 'la conformité n’amène pas le rapport')

  await amener(page, 'services')
  await attendLaPartie(page, 'deroule', 'les services n’amènent pas le déroulé')

  await amener(page, 'contenu')
  await attendLaPartie(page, 'site', 'revenir au contenu ne ramène pas le site')

  // Rien n'a été coché : le prix est resté celui du départ.
  await expect(page.getByTestId('prix')).toHaveText(formaterEuros(calculer(CONFIG_DEPART).total))
})

test('sous 1280, le premier geste depuis le repos fait déjà suivre l’aperçu', async ({ page }) => {
  // Sous 1280 la racine défile et l’aperçu occupe le haut : au repos aucun groupe n’a franchi la
  // ligne de lecture, le bloc des réglages poussant le premier sous elle à cette hauteur de
  // fenêtre. Le relevé du montage doit se consommer quand même, sinon ce seul geste est avalé.
  await page.setViewportSize({ width: 1024, height: 720 })
  await page.goto('/configurateur')
  await attendLaPartie(page, 'site', 'l’aperçu ne s’ouvre pas sur le site')
  const avant = await position(page)
  await amener(page, 'volume')
  expect(await positionPosee(page, avant)).toBeGreaterThan(avant)
})

test('chaque groupe amène sa propre scène', async ({ page }) => {
  await page.goto('/configurateur')
  for (const groupe of GROUPES) {
    await amener(page, groupe.id)
    await attendLaPartie(
      page,
      partieDeAncre(ANCRE_PAR_GROUPE[groupe.id]),
      `le groupe « ${groupe.titre} » n’amène pas sa scène`
    )
  }
})

test('le défilement reprend la main sur un choix d’option', async ({ page }) => {
  await page.goto('/configurateur')
  // `express` est technique mais se démontre sur le déroulé : le saut s'y voit d'une partie
  // entière, là où une option de son propre groupe ne bougerait presque pas la page.
  await page.getByRole('checkbox', { name: 'Livraison accélérée', exact: true }).check()
  await attendLaPartie(page, 'deroule', 'cocher la livraison accélérée n’amène pas le déroulé')

  // Attente franche au delà de la suspension du relevé : la lecture pilote la position en
  // continu, un choix est un saut et non un verrou, et le geste suivant redevient la source.
  await page.waitForTimeout(SUSPENSION_MS + 400)
  await amener(page, 'contenu')
  await attendLaPartie(page, 'site', 'le défilement ne reprend pas la main sur le choix')
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
  expect(await partieAuHautDeLaFenetre(page)).toBe('site')
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

test('cocher une option garde sa scène au delà de la suspension du relevé', async ({ page }) => {
  await page.goto('/configurateur')

  // `express` est la seule option dont la scène n'est pas celle de son groupe : elle montre le
  // déroulé quand `technique` vise le rapport. Le demi-tour s'y voit, il est muet ailleurs.
  await page.getByRole('checkbox', { name: 'Livraison accélérée', exact: true }).check()
  await attendLaPartie(page, 'deroule', 'cocher la livraison accélérée n’amène pas le déroulé')
  expect(await dansLaFenetre(page, 'partie-deroule')).toBe(true)

  // Attente franche au delà de la suspension : le clic a fait défiler le panneau, et cette
  // lecture subie ne doit pas reprendre la main une fois la suspension levée.
  await page.waitForTimeout(SUSPENSION_MS + 400)
  expect(await partieAuHautDeLaFenetre(page)).toBe('deroule')
  expect(await dansLaFenetre(page, 'partie-deroule')).toBe(true)
})

// Les seules traversées qui changent de partie : l'ancre du groupe et celle du groupe suivant
// n'y sont pas dans la même. Dérivé du catalogue, une ancre de plus le rejoindra sans retouche.
const TRAVERSEES = GROUPES.flatMap((groupe, rang) => {
  const suivant = GROUPES[rang + 1]
  if (!suivant) return []
  const depart = partieDeAncre(ANCRE_PAR_GROUPE[groupe.id])
  const arrivee = partieDeAncre(ANCRE_PAR_GROUPE[suivant.id])
  return depart === arrivee ? [] : [{ groupe: groupe.id, titre: groupe.titre, arrivee }]
})

for (const traversee of TRAVERSEES) {
  test(`au bout du groupe « ${traversee.titre} », la fenêtre montre la partie atteinte`, async ({ page }) => {
    await page.goto('/configurateur')
    const avant = await position(page)
    await finDuGroupe(page, traversee.groupe)
    // La traversée change de partie : la page bouge forcément, et juger avant qu'elle se pose
    // reviendrait à lire une image de transition.
    await positionPosee(page, avant)

    expect(await partieAuHautDeLaFenetre(page)).toBe(traversee.arrivee)
  })
}
