import { expect, test } from '@playwright/test'
import { hydrate } from './fenetre'

test.beforeEach(async ({ page }) => {
  await page.goto('/configurateur')
  await hydrate(page)
})

/** Cadrage et dominante réellement peints sur les trois emplacements servis par la photo.
 *  Lus sur le style calculé, jamais sur une classe : une classe qui bascule sans rien déplacer
 *  passerait au vert, et c'est exactement le piège que ce lot doit éviter. */
async function dessins(page: import('@playwright/test').Page): Promise<string[]> {
  return page
    .getByTestId('site-cadre')
    .evaluateAll((n) => n.map((e) => {
      const s = getComputedStyle(e)
      return `${s.backgroundPosition}|${s.backgroundImage}`
    }))
}

/** Dominante seule, isolée du cadrage : `dessins()` concatène position et image, et le
 *  cadrage seul suffirait à rendre trois chaînes distinctes. Sans ce filet séparé, un bug sur
 *  `--m-photo-facteur` ou `--m-photo-vire` resterait invisible derrière la seule position. */
async function teintes(page: import('@playwright/test').Page): Promise<string[]> {
  return page.getByTestId('site-cadre').evaluateAll((n) => n.map((e) => getComputedStyle(e).backgroundImage))
}

test('aucune balise image n’est produite dans l’aperçu', async ({ page }) => {
  // Contrainte de production : Nathan ne livre ni photo ni dessin.
  await page.getByRole('checkbox', { name: 'Je retouche vos photos', exact: true }).check()
  await expect(page.getByTestId('apercu').locator('img')).toHaveCount(0)
})

test('la bande porte trois emplacements servis par la photo du métier', async ({ page }) => {
  await expect(page.getByTestId('site-cadre')).toHaveCount(3)
  for (const dessin of await dessins(page)) expect(dessin).toContain('/maquette/')
})

test('sans retouche, les trois emplacements divergent ; avec, ils coïncident', async ({ page }) => {
  const avant = await dessins(page)
  expect(new Set(avant).size, 'les trois emplacements se ressemblent déjà').toBe(3)

  await page.getByRole('checkbox', { name: 'Je retouche vos photos', exact: true }).check()
  await expect
    .poll(async () => new Set(await dessins(page)).size, { message: 'la retouche n’aligne pas les trois' })
    .toBe(1)
})

test('sans retouche, les trois dominantes divergent aussi ; avec, elles coïncident', async ({ page }) => {
  // Sur `enseigne`, la direction par défaut, --m-accent-2 et --m-photo-teinte valent la même
  // couleur : le virage y est inerte. `clinique` les distingue, ce qui rend --m-photo-vire mesurable.
  await page.getByTestId('selecteur-style').selectOption('clinique')
  await expect
    .poll(async () => new Set(await teintes(page)).size, { message: 'les trois dominantes se ressemblent déjà' })
    .toBe(3)

  await page.getByRole('checkbox', { name: 'Je retouche vos photos', exact: true }).check()
  await expect
    .poll(async () => new Set(await teintes(page)).size, { message: 'la retouche n’aligne pas les trois dominantes' })
    .toBe(1)
})

test('les étiquettes de devis ont disparu du cadre image', async ({ page }) => {
  // Deux annotations de devis posées sur une vraie photo depuis le lot 1, et le cadre en
  // pointillés qui les accompagnait. Le delta se voit sur l'image, plus sur une légende.
  await page.goto('/configurateur?photos&visuels')
  await hydrate(page)
  for (const disparu of ['site-poids', 'site-reperes', 'site-visuels']) {
    await expect(page.getByTestId(disparu)).toHaveCount(0)
  }
})

test('le quatrième emplacement porte une carte de texte, que les visuels illustrent', async ({ page }) => {
  await expect(page.getByTestId('site-carte')).toBeVisible()
  await expect(page.getByTestId('site-visuel')).toHaveCount(0)

  await page.getByRole('checkbox', { name: 'Visuels sous licence', exact: true }).check()
  await expect(page.getByTestId('site-visuel')).toBeVisible()
  await expect(page.getByTestId('site-carte')).toHaveCount(0)
})

test('le visuel sous licence est cadré même sans retouche des photos', async ({ page }) => {
  // Une image de banque arrive propre : la retouche ne la concerne pas, et c'est ce qui garde
  // aux deux options une manifestation propre quand une seule est cochée.
  await page.getByRole('checkbox', { name: 'Visuels sous licence', exact: true }).check()
  const visuel = await page.getByTestId('site-visuel').evaluate((n) => getComputedStyle(n).backgroundPosition)
  // Deux couches d'image : le navigateur répète la position par couche dans la valeur calculée.
  expect(visuel.split(', '), visuel).toEqual(['50% 50%', '50% 50%'])
  expect(new Set(await dessins(page)).size, 'les photos non retouchées se sont alignées').toBe(3)
})

test('photos et visuels cochées ensemble alignent les quatre emplacements', async ({ page }) => {
  await page.getByRole('checkbox', { name: 'Je retouche vos photos', exact: true }).check()
  await page.getByRole('checkbox', { name: 'Visuels sous licence', exact: true }).check()
  const cadrages = await page
    .getByTestId('objet-scene')
    .evaluate((n) => [...n.querySelectorAll('.m-photo')].map((e) => getComputedStyle(e).backgroundPosition))
  expect(cadrages, 'quatre emplacements attendus').toHaveLength(4)
  expect(new Set(cadrages).size).toBe(1)
})

test('le blog ouvre une grille d’actualités vide', async ({ page }) => {
  await expect(page.getByTestId('site-blog')).toHaveCount(0)
  await page.getByRole('checkbox', { name: 'Un blog', exact: true }).check()
  await expect(page.getByTestId('site-blog')).toBeVisible()
  await expect(page.getByTestId('site-article')).toHaveCount(0)
})

test('chaque article optimisé ajoute une carte titrée avec sa requête', async ({ page }) => {
  await page.getByRole('checkbox', { name: 'Un blog', exact: true }).check()
  await page.getByRole('button', { name: 'Ajouter : Un article optimisé' }).click()
  await expect(page.getByTestId('site-article')).toHaveCount(1)
  await page.getByRole('button', { name: 'Ajouter : Un article optimisé' }).click()
  await expect(page.getByTestId('site-article')).toHaveCount(2)
})

test('un article sans blog s’affiche quand même, il ne disparaît pas', async ({ page }) => {
  // Sans cela, l'option serait muette et le test généré de la Task 12 échouerait.
  await page.getByRole('button', { name: 'Ajouter : Un article optimisé' }).click()
  await expect(page.getByTestId('site-article')).toHaveCount(1)
})
