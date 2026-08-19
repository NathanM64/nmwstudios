import { expect, test } from '@playwright/test'
import { dansLaFenetre } from './fenetre'

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

test('le mouvement réduit pose la position sans transition', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/configurateur')
  const duree = await page.getByTestId('rouleau').evaluate((n) => getComputedStyle(n).transitionDuration)
  // Seuil de `transitions.spec.ts` : la remise à zéro globale du projet pose 0,01 ms en
  // `!important`, qu'aucune règle ne peut ramener à zéro franc.
  expect(parseFloat(duree)).toBeLessThan(0.001)
})
