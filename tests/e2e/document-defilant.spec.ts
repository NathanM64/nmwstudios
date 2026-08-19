import { expect, test } from '@playwright/test'
import { SCENES, ancreDeOption } from '../../lib/config/scenes'
import { dansLaFenetre } from './fenetre'

type Page = import('@playwright/test').Page

/** Écart, en pixels logiques, entre le relevé publié par le document et la mise en page réelle.
 *  Les ancres de frontière ne bougent qu'une fois une partie plus haute qu'une fenêtre : ce sont
 *  les ancres internes qui trahissent une mesure périmée, et elles ne visent encore rien. */
async function ecartDuReleve(page: Page): Promise<number> {
  return page.getByTestId('rouleau').evaluate((rouleau) => {
    const releve = JSON.parse(rouleau.dataset.mesures!) as Record<string, number>
    const echelle = parseFloat(getComputedStyle(rouleau.parentElement!).scale) || 1
    const haut = rouleau.getBoundingClientRect().top
    let pire = 0
    for (const el of rouleau.querySelectorAll<HTMLElement>('[data-ancre]')) {
      const reel = (el.getBoundingClientRect().top - haut) / echelle
      pire = Math.max(pire, Math.abs(reel - releve[el.dataset.ancre!]))
    }
    return pire
  })
}

/** Écart, en pixels logiques, entre la position posée du rouleau et le décalage publié pour
 *  une ancre. Zéro veut dire que c'est bien cette ancre qui est en haut de la fenêtre. */
async function ecartAAncre(page: Page, ancre: string): Promise<number> {
  return page.getByTestId('rouleau').evaluate((rouleau: HTMLElement, a) => {
    const y = Math.abs(parseFloat(getComputedStyle(rouleau).translate.split(' ')[1] ?? '0'))
    return Math.abs(y - (JSON.parse(rouleau.dataset.mesures!) as Record<string, number>)[a])
  }, ancre)
}

/** Décalages réels, tels que la mise en page les donne, indépendamment de ce que le document
 *  en a relevé. Sert à constater qu'une bascule a bien déplacé quelque chose. */
async function offsetsReels(page: Page): Promise<string> {
  return page.getByTestId('rouleau').evaluate((rouleau) => {
    const echelle = parseFloat(getComputedStyle(rouleau.parentElement!).scale) || 1
    const haut = rouleau.getBoundingClientRect().top
    return [...rouleau.querySelectorAll<HTMLElement>('[data-ancre]')]
      .map((el) => `${el.dataset.ancre}:${Math.round((el.getBoundingClientRect().top - haut) / echelle)}`)
      .join(' ')
  })
}

/** Tant qu'une animation d'entrée court, le relevé et la mise en page bougent ensemble, et un
 *  écart nul ne prouverait rien : c'est une fois posée que la position doit être la bonne.
 *
 *  Une transition reciblée en vol est annulée, et sa promesse `finished` rejette : la lecture
 *  du formulaire recible celle du rouleau à chaque cran. Annulée vaut terminée ici, ce qui
 *  compte étant qu'aucune de celles relevées à l'appel ne bouge plus. */
async function animationsFinies(page: Page): Promise<void> {
  await page
    .getByTestId('rouleau')
    .evaluate((r) =>
      Promise.all(r.getAnimations({ subtree: true }).map((a) => a.finished.catch(() => undefined))).then(
        () => undefined
      )
    )
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/configurateur')
})

test('les trois parties vivent dans un seul document', async ({ page }) => {
  for (const partie of ['partie-site', 'partie-preuve', 'partie-deroule']) {
    await expect(page.getByTestId(partie)).toHaveCount(1)
  }
})

test('le document est plus haut que sa fenêtre', async ({ page }) => {
  const mesure = await page.getByTestId('objet-scene').evaluate((fenetre) => {
    const rouleau = fenetre.querySelector('[data-testid="rouleau"]') as HTMLElement
    const echelle = parseFloat(getComputedStyle(fenetre.querySelector('[data-testid="maquette"]')!).scale) || 1
    return { document: rouleau.offsetHeight, fenetre: fenetre.clientHeight / echelle }
  })
  expect(mesure.document).toBeGreaterThan(mesure.fenetre * 1.5)
})

test('le document ne déborde jamais horizontalement', async ({ page }) => {
  for (const largeur of [1920, 1440, 1280, 1024, 900]) {
    await page.setViewportSize({ width: largeur, height: 900 })
    const debordement = await page.getByTestId('objet-scene').evaluate((n) => n.scrollWidth - n.clientWidth)
    expect(debordement, `débordement horizontal à ${largeur}`).toBeLessThanOrEqual(1)
  }
})

test('au départ, seule la partie du site est dans la fenêtre', async ({ page }) => {
  expect(await dansLaFenetre(page, 'partie-site')).toBe(true)
  expect(await dansLaFenetre(page, 'partie-deroule')).toBe(false)
})

test('un repère amène sa partie dans la fenêtre', async ({ page }) => {
  await page.getByTestId('onglet-deroule').click()
  await expect.poll(() => dansLaFenetre(page, 'partie-deroule')).toBe(true)
  expect(await dansLaFenetre(page, 'partie-site')).toBe(false)

  await page.getByTestId('onglet-site').click()
  await expect.poll(() => dansLaFenetre(page, 'partie-site')).toBe(true)
})

test('le texte de la maquette ne descend jamais sous les seuils du projet', async ({ page }) => {
  // Deux seuils, ceux du lot A : 10 px pour tout texte, 11 px pour le texte courant.
  // Mesurés à toutes les largeurs servies, et non plus à la seule 1440 × 900.
  for (const largeur of [1920, 1440, 1280, 1024]) {
    await page.setViewportSize({ width: largeur, height: 900 })
    const tailles = await page.getByTestId('rouleau').evaluate((rouleau) => {
      const echelle = parseFloat(getComputedStyle(rouleau.parentElement!).scale) || 1
      return [rouleau, ...rouleau.querySelectorAll('*')]
        .filter((n) => [...n.childNodes].some((c) => c.nodeType === 3 && c.textContent!.trim()))
        .map((n) => parseFloat(getComputedStyle(n).fontSize) * echelle)
    })
    expect(tailles.length, `aucun texte mesuré à ${largeur}`).toBeGreaterThan(10)
    expect(Math.min(...tailles), `plus petit texte à ${largeur}`).toBeGreaterThanOrEqual(10)

    // Le texte courant, second seuil : les entrées de navigation, comme le filet d'origine.
    const courant = await page.getByTestId('site-nav').evaluate((nav) => {
      const echelle = parseFloat(getComputedStyle(nav.closest('[data-testid="maquette"]')!).scale) || 1
      return [...nav.querySelectorAll('li')].map((n) => parseFloat(getComputedStyle(n).fontSize) * echelle)
    })
    expect(courant.length, `aucun texte courant mesuré à ${largeur}`).toBeGreaterThan(0)
    expect(Math.min(...courant), `texte courant à ${largeur}`).toBeGreaterThanOrEqual(11)
  }
})

test('la maquette ne dépasse jamais sa taille naturelle', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 })
  const echelle = await page.getByTestId('maquette').evaluate((n) => parseFloat(getComputedStyle(n).scale))
  expect(echelle).toBeLessThanOrEqual(1)
  expect(echelle).toBeGreaterThan(0.9)
})

test('rien n’est rogné à l’intérieur d’une partie', async ({ page }) => {
  // Seul le rognage vertical est un défaut : onze `truncate` écrêtent horizontalement à
  // dessein. La fenêtre écrête le document, c'est son travail ; à l'intérieur d'une partie
  // un contenu coupé en hauteur disparaît sans le dire, et `toBeVisible` ne le verrait pas.
  const rognes = await page.getByTestId('rouleau').evaluate((rouleau) =>
    [...rouleau.querySelectorAll<HTMLElement>('*')]
      // L'aplat de l'image écrête ses repères de recadrage, et c'est voulu.
      .filter((n) => n.dataset.testid !== 'site-cadre' && !n.closest('[data-testid="site-cadre"]'))
      // `scrollHeight` compte aussi le débord des glyphes hors de leur ligne, que le titre
      // et le chiffre assument par un interlignage serré. Seul ce qui écrête cache.
      .filter((n) => getComputedStyle(n).overflowY !== 'visible')
      .filter((n) => n.scrollHeight - n.clientHeight > 1)
      .map((n) => n.dataset.testid ?? n.className)
  )
  expect(rognes).toEqual([])
})

// Pire cas mesuré : sur ce métier, la seule bascule en anglais remonte six ancres de 25 à 55 px,
// les deux repères de partie compris, la partie du site dépassant alors une fenêtre.
const CHARGE =
  '/configurateur?langue=3&blog&article=10&formulaire&redaction=15&reprise&rdv&newsletter&paiement&photos&visuels&membre&pages=4'

test('le relevé des ancres suit la mise en page, animations d’entrée comprises', async ({ page }) => {
  // Un rectangle lu pendant qu'une animation d'entrée court situe l'ancre là où elle passe :
  // mesuré à 9 px de trop sur les actualités avant correction, et jamais repris ensuite.
  await page.goto(CHARGE)
  await animationsFinies(page)
  await expect.poll(() => ecartDuReleve(page), { message: 'au chargement' }).toBeLessThan(2)
})

test('le relevé des ancres suit un changement de style, de métier et de langue', async ({ page }) => {
  // Chaque bascule est d'abord constatée sur la mise en page réelle. Sans ce constat, le premier
  // sondage tombe avant que le changement ait pris, et un écart nul ne prouve rien.
  const bascule = async (agir: () => Promise<unknown>, quoi: string) => {
    const avant = await offsetsReels(page)
    await agir()
    await expect.poll(() => offsetsReels(page), { message: `${quoi} n’a déplacé aucune ancre` }).not.toBe(avant)
    await expect.poll(() => ecartDuReleve(page), { message: `relevé périmé après ${quoi}` }).toBeLessThan(2)
  }

  // Le style ne passe par aucune prop du document, la langue vit dans l'état interne de
  // SceneSite : sans observateur sur les porteurs d'ancres, rien ne remesure.
  await animationsFinies(page)
  await bascule(() => page.getByTestId('selecteur-style').selectOption('franc'), 'le style')

  await page.goto(CHARGE)
  await animationsFinies(page)
  await bascule(() => page.getByTestId('selecteur-domaine').selectOption('vtc'), 'le métier')
  await bascule(() => page.getByTestId('site-langue').selectOption('en'), 'la langue')
})

test('le mouvement réduit pose la position sans transition', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/configurateur')
  const duree = await page.getByTestId('rouleau').evaluate((n) => getComputedStyle(n).transitionDuration)
  // Seuil de `transitions.spec.ts` : la remise à zéro globale du projet pose 0,01 ms en
  // `!important`, qu'aucune règle ne peut ramener à zéro franc.
  expect(parseFloat(duree)).toBeLessThan(0.001)
})

test('cocher une option amène son ancre dans la fenêtre', async ({ page }) => {
  await page.getByRole('checkbox', { name: 'Un blog', exact: true }).check()
  await expect.poll(() => dansLaFenetre(page, 'site-blog')).toBe(true)
  // La partie du site tient dans une fenêtre : le blog s'y voit même sans rien viser, et le
  // seul constat ci-dessus passerait aussi bien sur la page laissée en haut. C'est la position
  // posée qui dit que l'ancre de l'option est visée, et non la tête de sa partie.
  await expect.poll(() => ecartAAncre(page, ancreDeOption('blog'))).toBeLessThan(2)
})

test('cocher un contrôle technique amène le rapport', async ({ page }) => {
  await page.getByRole('checkbox', { name: 'Fondations SEO', exact: true }).check()
  await expect.poll(() => dansLaFenetre(page, 'preuve-serp')).toBe(true)
})

test('ce qui sort de la fenêtre est inerte', async ({ page }) => {
  // Sans `inert`, la tabulation atteint le sélecteur de langue d'une partie invisible.
  await page.goto('/configurateur?langue=2')
  // `overflow: clip` ne peut pas ramener un élément focalisé à l'écran, contrairement à
  // `hidden` : le sélecteur d'une partie sortie doit être hors d'atteinte, pas seulement invisible.
  const prendLeFocus = () =>
    page.getByTestId('site-langue').evaluate((el: HTMLElement) => {
      el.focus()
      return document.activeElement === el
    })

  await expect(page.getByTestId('partie-site')).not.toHaveAttribute('inert', '')
  expect(await prendLeFocus(), 'le site est dans la fenêtre et déjà hors du clavier').toBe(true)

  await page.getByTestId('onglet-deroule').click()
  await expect.poll(() => dansLaFenetre(page, 'partie-site')).toBe(false)
  await expect(page.getByTestId('partie-site')).toHaveAttribute('inert', '')
  expect(await prendLeFocus(), 'le sélecteur d’une partie sortie prend encore le focus').toBe(false)
  await expect(page.getByTestId('partie-deroule')).not.toHaveAttribute('inert', '')

  // Le retour rend la partie au clavier : un `inert` jamais retiré la rendrait inatteignable.
  await page.getByTestId('onglet-site').click()
  await expect.poll(() => dansLaFenetre(page, 'partie-site')).toBe(true)
  await expect(page.getByTestId('partie-site')).not.toHaveAttribute('inert', '')
  expect(await prendLeFocus(), 'le site est revenu sans rendre son sélecteur au clavier').toBe(true)
})

test('le premier rendu n’est pas intégralement inerte', async ({ page }) => {
  // Avant la première mesure la fenêtre est haute de zéro et aucune partie ne la croise : sans
  // repli, le HTML prérendu sort avec `inert` partout, et la maquette naît inatteignable.
  const html = await (await page.request.get('/configurateur')).text()
  const balises = html.match(/<div[^>]*data-testid="partie-[a-z-]+"[^>]*>/g) ?? []
  expect(balises).toHaveLength(SCENES.length)
  for (const balise of balises) expect(balise, balise).not.toContain('inert')
})
