import { expect, test } from '@playwright/test'

test('le titre du groupe reste visible pendant le parcours de ses options', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/configurateur')

  const legende = page.getByTestId('legende-fonctionnel')
  await page.getByTestId('carte-membre').scrollIntoViewIfNeeded()
  await expect(legende).toBeInViewport()
})

test('le prix du socle se distingue typographiquement du delta d’une option', async ({ page }) => {
  await page.goto('/configurateur')
  const socle = page.getByTestId('carte-socle').locator('.font-mono')
  const blog = page.getByTestId('carte-blog').locator('.font-mono')

  const tailleSocle = await socle.evaluate((n) => parseFloat(getComputedStyle(n).fontSize))
  const tailleBlog = await blog.evaluate((n) => parseFloat(getComputedStyle(n).fontSize))
  expect(tailleSocle).toBeGreaterThan(tailleBlog)
})

test('le total de la barre domine tous les prix d’option', async ({ page }) => {
  await page.goto('/configurateur')
  const total = page.getByTestId('fourchette')
  const blog = page.getByTestId('carte-blog').locator('.font-mono')

  const tailleTotal = await total.evaluate((n) => parseFloat(getComputedStyle(n).fontSize))
  const tailleBlog = await blog.evaluate((n) => parseFloat(getComputedStyle(n).fontSize))
  expect(tailleTotal).toBeGreaterThan(tailleBlog * 1.5)
})

test('la carte atteinte en tabulation arrière n’est pas recouverte par la légende collante', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 600 })
  await page.goto('/configurateur')

  // Depuis la fin du panneau, la tabulation arrière accumule des réalignements de
  // défilement : mesuré, ce chemin fait atterrir « Prise de rendez-vous » sous
  // l'en-tête collant de son groupe à cette hauteur de fenêtre.
  await page.getByRole('button', { name: 'Copier le lien' }).focus()
  const cible = page.getByRole('checkbox', { name: 'Prise de rendez-vous' })
  for (let i = 0; i < 30 && !(await cible.evaluate((n) => n === document.activeElement)); i++) {
    await page.keyboard.press('Shift+Tab')
  }
  await expect(cible).toBeFocused()

  const carte = (await page.getByTestId('carte-rdv').boundingBox())!
  const legende = (await page.getByTestId('legende-fonctionnel').boundingBox())!
  expect(carte.y).toBeGreaterThanOrEqual(legende.y + legende.height)
})

test('en régime tablette, la carte atteinte en tabulation arrière n’est pas recouverte non plus', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 900 })
  await page.goto('/configurateur')

  // En dessous de `lg`, c'est la page entière qui défile, pas colonne-options :
  // ce couple carte/légende est celui du constat d'origine, reproductible à cette largeur.
  await page.getByRole('button', { name: 'Copier le lien' }).focus()
  const cible = page.getByRole('checkbox', { name: 'Paiement en ligne' })
  for (let i = 0; i < 60 && !(await cible.evaluate((n) => n === document.activeElement)); i++) {
    await page.keyboard.press('Shift+Tab')
  }
  await expect(cible).toBeFocused()

  const carte = (await page.getByTestId('carte-paiement').boundingBox())!
  const legende = (await page.getByTestId('legende-fonctionnel').boundingBox())!
  expect(carte.y).toBeGreaterThanOrEqual(legende.y + legende.height)
})

test('en régime mobile, la carte atteinte en tabulation arrière n’est pas recouverte non plus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 700 })
  await page.goto('/configurateur')

  // Largeur où le relecteur a relevé le plus de recouvrements (21 sur 90 tabulations arrière).
  await page.getByRole('button', { name: 'Copier le lien' }).focus()
  const cible = page.getByRole('checkbox', { name: 'Espace membre' })
  for (let i = 0; i < 90 && !(await cible.evaluate((n) => n === document.activeElement)); i++) {
    await page.keyboard.press('Shift+Tab')
  }
  await expect(cible).toBeFocused()

  const carte = (await page.getByTestId('carte-membre').boundingBox())!
  const legende = (await page.getByTestId('legende-fonctionnel').boundingBox())!
  expect(carte.y).toBeGreaterThanOrEqual(legende.y + legende.height)
})

test('un bouton du pas-à-pas atteint en tabulation arrière n’est pas recouvert non plus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 700 })
  await page.goto('/configurateur')

  // Cible un bouton +/-, pas une case : son décalage par rapport au bord de la
  // carte diffère (13px, contre 1px pour l'input), déjà mesuré comme le pire cas.
  await page.getByRole('button', { name: 'Copier le lien' }).focus()
  const cible = page.getByRole('button', { name: 'Ajouter : J’écris vos textes' })
  for (let i = 0; i < 90 && !(await cible.evaluate((n) => n === document.activeElement)); i++) {
    await page.keyboard.press('Shift+Tab')
  }
  await expect(cible).toBeFocused()

  const carte = (await page.getByTestId('carte-redaction').boundingBox())!
  const legende = (await page.getByTestId('legende-contenu').boundingBox())!
  expect(carte.y).toBeGreaterThanOrEqual(legende.y + legende.height)
})

// Le propriétaire voit une barre de défilement classique, qui prend sa largeur au contenu.
// Playwright n'en pose pas : on la simule en retirant au panneau la largeur qu'elle coûte.
// Sans cette simulation, la marge négative de 4 px de l'en-tête ne se voyait nulle part.
test('le panneau ne prend aucun ascenseur horizontal, barre de défilement classique comprise', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/configurateur')

  for (const perte of [0, 15, 17]) {
    const debordement = await page.getByTestId('colonne-options').evaluate((el, perte) => {
      el.style.width = `${el.clientWidth - perte}px`
      const mesure = el.scrollWidth - el.clientWidth
      el.style.width = ''
      return mesure
    }, perte)
    expect(debordement, `barre de ${perte} px`).toBeLessThanOrEqual(0)
  }
})

test('en dessous de lg, ni le panneau ni le document ne débordent en largeur', async ({ page }) => {
  for (const taille of [
    { width: 900, height: 800 },
    { width: 768, height: 900 },
    { width: 390, height: 700 },
    { width: 320, height: 700 },
  ]) {
    await page.setViewportSize(taille)
    await page.goto('/configurateur')
    const doc = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(doc, `document à ${taille.width}`).toBeLessThanOrEqual(0)

    const panneau = await page.getByTestId('colonne-options').evaluate((el) => el.scrollWidth - el.clientWidth)
    expect(panneau, `panneau à ${taille.width}`).toBeLessThanOrEqual(0)
  }
})
