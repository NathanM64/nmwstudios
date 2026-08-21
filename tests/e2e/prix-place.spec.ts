import { expect, test } from '@playwright/test'

test('au-dessus de 1280, le prix est aligné sur la colonne d’options', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/configurateur')

  const colonne = (await page.getByTestId('colonne-options').boundingBox())!
  const prix = (await page.getByTestId('barre-prix').boundingBox())!

  // Le prix était en bas à gauche, sous l'aperçu, pendant que la main travaillait à droite.
  expect(prix.x).toBeGreaterThanOrEqual(colonne.x - 1)
  expect(prix.x + prix.width).toBeLessThanOrEqual(colonne.x + colonne.width + 1)
  // Et en pied de colonne, pas en pied de fenêtre : une barre restée accrochée à la fenêtre
  // garderait la même position horizontale et passerait les deux assertions ci-dessus.
  expect(prix.y + prix.height).toBeCloseTo(colonne.y + colonne.height, 0)
})

test('le prix reste visible sans faire défiler', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/configurateur')
  await expect(page.getByTestId('prix')).toBeInViewport()
  await page.locator('[data-testid="colonne-options"]').evaluate((n) => n.scrollBy(0, 1200))
  await expect(page.getByTestId('prix')).toBeInViewport()
})

test('en dessous de 1280, le prix reprend la pleine largeur', async ({ page }) => {
  await page.setViewportSize({ width: 1100, height: 800 })
  await page.goto('/configurateur')
  const prix = (await page.getByTestId('barre-prix').boundingBox())!
  expect(prix.width).toBeGreaterThan(1000)
  // Le seul seuil de largeur ne discrimine rien : à 1100, la colonne fait déjà 1036 px. C’est le
  // bord gauche qui distingue une barre de page d’une barre restée dans la colonne, à 32 px.
  expect(prix.x).toBeLessThan(1)
})

/** Inventaire des cibles réellement atteignables par Tab dans la colonne : un radio non coché
 *  n'est jamais un arrêt, seul celui du groupe qui porte le focus l'est. C'est ce que la
 *  campagne garde réellement, insensible à ce qui vit hors de la colonne. */
async function inventaireColonne(page: import('@playwright/test').Page) {
  return page.locator('[data-testid="colonne-options"]').evaluate((colonne) => {
    const noms = new Set<string>()
    let compte = 0
    for (const el of colonne.querySelectorAll<HTMLElement>('input, button, a[href], select, textarea, [tabindex]')) {
      if (el.tabIndex < 0 || (el as HTMLButtonElement).disabled) continue
      const boite = el.getBoundingClientRect()
      if (boite.width === 0 && boite.height === 0) continue
      if (el instanceof HTMLInputElement && el.type === 'radio') {
        if (noms.has(el.name)) continue
        noms.add(el.name)
      }
      compte++
    }
    return compte
  })
}

/** Presse une touche de tabulation en boucle et relève les champs de la colonne qui finissent
 *  derrière un bloc opaque : la barre de prix en pied, l'en-tête collant de leur groupe en tête.
 *  Rend aussi le compte des champs examinés face à l'inventaire réel de la colonne, sans quoi un
 *  ordre de tabulation changé viderait la campagne sans la faire rougir. */
async function campagneClavier(page: import('@playwright/test').Page, touche: string) {
  if (touche === 'Shift+Tab') {
    // Remonter demande du contenu au-dessus : on part du dernier bouton de la colonne.
    await page.getByTestId('recapitulatif-final').scrollIntoViewIfNeeded()
    await page.locator('[data-testid="recapitulatif-final"] button').first().focus()
  } else {
    await page.locator('[data-testid="colonne-options"] input').first().focus()
  }

  const attendus = await inventaireColonne(page)
  const recouverts: string[] = []
  let examines = 0
  let avecEntete = 0
  // Le plafond n'est qu'une garde-fou : la boucle s'arrête dès la colonne couverte, ce qui la
  // rend insensible au nombre de cibles focalisables posées ailleurs sur la page.
  for (let i = 0; i < 150 && examines < attendus; i++) {
    await page.keyboard.press(touche)
    const releve = await page.evaluate(() => {
      const actif = document.activeElement as HTMLElement | null
      const colonne = document.querySelector('[data-testid="colonne-options"]') as HTMLElement
      if (!actif || !colonne.contains(actif)) return null
      const cible = actif.closest('[data-testid]')?.getAttribute('data-testid') ?? actif.tagName
      const boite = actif.getBoundingClientRect()
      const sous = (bloc: HTMLElement | null, nom: string) => {
        if (!bloc || getComputedStyle(bloc).display === 'none' || bloc.contains(actif)) return null
        const b = bloc.getBoundingClientRect()
        const chevauchement = Math.min(boite.bottom, b.bottom) - Math.max(boite.top, b.top)
        return chevauchement > 0 ? `${cible} sous ${Math.round(chevauchement)} px de ${nom}` : null
      }
      const entete = actif.closest('fieldset')?.querySelector<HTMLElement>('.entete-groupe') ?? null
      return {
        barre: sous(document.querySelector('[data-testid="barre-prix"]'), 'barre'),
        entete: sous(entete, 'en-tête'),
        aEntete: entete !== null,
      }
    })
    if (!releve) continue
    examines++
    if (releve.aEntete) avecEntete++
    for (const cas of [releve.barre, releve.entete]) if (cas) recouverts.push(cas)
  }
  return { examines, attendus, avecEntete, recouverts }
}

// Les deux côtés de la bascule : au-dessus de 1280 la réserve est posée sur la colonne, en dessous
// sur la racine. Les deux sens de tabulation : `Tab` descend derrière la barre, `Maj+Tab` remonte
// derrière l'en-tête collant du groupe.
for (const largeur of [1440, 1100]) {
  for (const touche of ['Tab', 'Shift+Tab']) {
    test(`à ${largeur}, ${touche} ne laisse aucun champ derrière la barre de prix ni son en-tête de groupe`, async ({ page }) => {
      await page.setViewportSize({ width: largeur, height: 900 })
      await page.goto('/configurateur')

      const { examines, attendus, avecEntete, recouverts } = await campagneClavier(page, touche)
      expect(recouverts).toEqual([])
      // La branche en-tête meurt en silence si le `fieldset` ou la classe change : `sous(null)`
      // rend `null` sans que le compteur de champs examinés bouge.
      expect(avecEntete, 'aucun champ examiné n’a trouvé l’en-tête de son groupe').toBeGreaterThan(0)
      // Sans ce plancher la campagne serait creuse : chaque tour sorti de la colonne rend `null`
      // en silence, et un tableau vide ne dirait plus si un seul champ a été examiné. Le plancher
      // est l'inventaire mesuré de la colonne, pas un nombre deviné hors contexte.
      expect(examines).toBe(attendus)
    })
  }
}

test('la réserve de défilement ne déborde pas sur les pages sans barre de prix', async ({ page }) => {
  // La règle est bornée par `:has` à la présence de la barre : l'accueil garde ses ancres.
  await page.goto('/')
  await expect(page.locator('html')).toHaveCSS('scroll-padding-bottom', 'auto')
  await page.goto('/configurateur')
  await expect(page.locator('html')).toHaveCSS('scroll-padding-bottom', '64px')
})
