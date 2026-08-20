import { expect, test } from '@playwright/test'

test('au-dessus de 1280, le prix est aligné sur la colonne d’options', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/configurateur')

  const colonne = (await page.getByTestId('colonne-options').boundingBox())!
  const prix = (await page.getByTestId('barre-prix').boundingBox())!

  // Le prix était en bas à gauche, sous l'aperçu, pendant que la main travaillait à droite.
  expect(prix.x).toBeGreaterThanOrEqual(colonne.x - 1)
  expect(prix.x + prix.width).toBeLessThanOrEqual(colonne.x + colonne.width + 1)
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

test('au-dessus de 1280, la barre ne recouvre pas le champ atteint au clavier', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/configurateur')
  await page.locator('[data-testid="colonne-options"] input').first().focus()

  // La barre colle au bas du conteneur de défilement : sans réserve de défilement, la mise en
  // vue minimale d’un champ atteint par Tab le laisse derrière elle, opaque.
  const recouverts: string[] = []
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press('Tab')
    const recouvert = await page.evaluate(() => {
      const actif = document.activeElement as HTMLElement | null
      const colonne = document.querySelector('[data-testid="colonne-options"]') as HTMLElement
      const barre = document.querySelector('[data-testid="barre-prix"]') as HTMLElement
      if (!actif || !colonne.contains(actif) || barre.contains(actif)) return null
      if (getComputedStyle(barre).display === 'none') return null
      const a = actif.getBoundingClientRect()
      const b = barre.getBoundingClientRect()
      const chevauchement = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)
      if (chevauchement <= 0) return null
      const carte = actif.closest('[data-testid]')?.getAttribute('data-testid') ?? actif.tagName
      return `${carte} sous ${Math.round(chevauchement)} px de barre`
    })
    if (recouvert) recouverts.push(recouvert)
  }
  expect(recouverts).toEqual([])
})
