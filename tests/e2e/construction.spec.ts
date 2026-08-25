import { expect, test } from '@playwright/test'

test('cocher une option anime seulement l’élément concerné', async ({ page }) => {
  await page.goto('/configurateur')
  // Rang dans le document, pas position à l'écran : cocher amène l'endroit de l'option, et toute
  // la page défile sous la fenêtre. Ce qui se juge ici est le reflux, pas ce défilement.
  const rangDuTitre = () =>
    page.getByTestId('site-titre').evaluate((titre) => {
      const rouleau = titre.closest('[data-testid="rouleau"]')!
      return titre.getBoundingClientRect().top - rouleau.getBoundingClientRect().top
    })
  const titreAvant = await rangDuTitre()
  await page.getByRole('checkbox', { name: 'Un blog', exact: true }).check()
  // Le titre ne doit pas bouger : seule la section ajoutée s'anime.
  const titreApres = await rangDuTitre()
  expect(Math.abs(titreApres - titreAvant)).toBeLessThan(2)
  await expect(page.getByTestId('site-blog')).toBeVisible()
})

test('l’animation de construction passe par translate, jamais par transform', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByRole('checkbox', { name: 'Un blog', exact: true }).check()
  const anim = await page.getByTestId('site-blog').evaluate((n) => ({
    nom: getComputedStyle(n).animationName,
    translate: getComputedStyle(n).translate,
  }))
  expect(anim.nom).toBe('construit')
  // Le keyframe `apparait` finit sur `transform: none` : une translation posée là serait écrasée.
  expect(anim.translate).not.toBe('none')
})

test('le réglage de réduction des animations supprime tout mouvement', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/configurateur')
  await page.getByRole('checkbox', { name: 'Un blog', exact: true }).check()
  const anim = await page.getByTestId('site-blog').evaluate((n) => getComputedStyle(n).animationName)
  expect(anim).toBe('none')
})

test('une barre de temps s’allonge au lieu d’apparaître', async ({ page }) => {
  await page.goto('/configurateur')
  const transition = await page.getByTestId('deroule-construction').evaluate((n) => getComputedStyle(n).transitionProperty)
  expect(transition).toContain('width')
})

test('une entrée de navigation se glisse au lieu de surgir', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByRole('button', { name: 'Ajouter : 3 pages de plus' }).click()
  const anim = await page.getByTestId('site-nav').getByRole('listitem').last().evaluate((n) => getComputedStyle(n).animationName)
  expect(anim).toBe('glisse')
})

// Écart de huit d'un coup : la montée dure assez longtemps pour être observée, là où un
// plus un serait invisible et le test dépendrait du hasard de l'échantillonnage.
const HUIT = '/configurateur?seo&seo-local&perf&a11y&rgpd&legal&migration&domaine'

test('le compteur de la preuve s’incrémente au lieu de sauter', async ({ page }) => {
  await page.goto(HUIT)
  const score = page.getByTestId('preuve-score')
  await expect(score).toHaveAttribute('data-anime', 'oui')
  await expect(score).toHaveText(/^8 \/ 8/)
  await expect(score).toHaveAttribute('data-anime', 'non')
})

test('le compteur se pose sans compter quand les animations sont réduites', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto(HUIT)
  await expect(page.getByTestId('preuve-score')).toHaveAttribute('data-anime', 'non')
  await expect(page.getByTestId('preuve-score')).toHaveText(/^8 \/ 8/)
})
