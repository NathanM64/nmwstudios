import { expect, test } from '@playwright/test'
import { HABILLAGE } from '../../lib/config/maquette'
import { hydrate } from './fenetre'

/** État peint des repères d'un geste : ce qui doit être identique au repos et après. */
async function etat(page: import('@playwright/test').Page, repere: string): Promise<string[]> {
  return page.getByTestId(repere).evaluateAll((n) =>
    n.map((e) => {
      const s = getComputedStyle(e)
      return `${s.opacity}|${s.translate}|${s.scale}`
    })
  )
}

test('le geste du formulaire se joue une fois, puis se repose', async ({ page }) => {
  await page.goto('/configurateur')
  await hydrate(page)
  await page.getByRole('checkbox', { name: 'Formulaire avancé', exact: true }).check()

  // Le repos, une fois les animations finies : c'est l'état que le prospect garde sous les yeux.
  await page.getByTestId('rouleau').evaluate((r) =>
    Promise.all(r.getAnimations({ subtree: true }).map((a) => a.finished.catch(() => undefined))).then(
      () => undefined
    )
  )
  const repos = await etat(page, 'site-etape')
  expect(repos.length, 'aucune étape peinte').toBe(3)

  // Une seconde lecture, franche et non sondée : un geste qui rejoue se verrait ici. Le sondage
  // se libérerait sur la première image et ne prouverait rien.
  await page.waitForTimeout(1200)
  expect(await etat(page, 'site-etape'), 'le geste rejoue au lieu de se reposer').toEqual(repos)
})

test('sous mouvement réduit, l’état final est atteint sans que rien ne joue', async ({ browser }) => {
  // Le geste porte l'information : si le fil ne joue pas, l'étape finale doit être active quand
  // même, sinon un visiteur qui a coupé les animations ne voit pas ce qu'il achète.
  const contexte = await browser.newContext({ reducedMotion: 'reduce' })
  const page = await contexte.newPage()
  await page.goto('/configurateur')
  await hydrate(page)
  await page.getByRole('checkbox', { name: 'Formulaire avancé', exact: true }).check()

  await expect(page.getByTestId('site-etape')).toHaveCount(3)
  await expect(page.locator('[data-etape-active]')).toHaveCount(1)
  await expect(page.getByTestId('site-conditionnel')).toBeVisible()
  await expect(page.getByTestId('site-piece')).toBeVisible()

  const anime = await page.getByTestId('rouleau').evaluate((r) => r.getAnimations({ subtree: true }).length)
  expect(anime, 'une animation joue malgré le mouvement réduit').toBe(0)
  await contexte.close()
})

test('le formulaire du socle reste un formulaire simple', async ({ page }) => {
  // Le socle contient déjà un formulaire : sans l'option, aucun des quatre repères de l'avancé.
  await page.goto('/configurateur')
  await hydrate(page)
  await expect(page.getByTestId('site-formulaire')).toBeVisible()
  for (const repere of ['site-etape', 'site-conditionnel', 'site-piece']) {
    await expect(page.getByTestId(repere)).toHaveCount(0)
  }
  await expect(page.locator('[data-etape-active]')).toHaveCount(0)
})

test('l’option livre le fil, le champ conditionnel et la pièce jointe', async ({ page }) => {
  await page.goto('/configurateur')
  await hydrate(page)
  await page.getByRole('checkbox', { name: 'Formulaire avancé', exact: true }).check()
  await expect(page.getByTestId('site-etape')).toHaveCount(3)
  // La dernière étape est l'active : le fil a été parcouru, il n'attend pas au départ.
  await expect(page.locator('[data-etape-active]')).toHaveText(HABILLAGE.fr.etapes[2])
  // L'attribut seul ne prouverait rien, un attribut qui bascule sans rien peindre passerait au
  // vert : l'étape active doit aussi se distinguer de ses voisines à l'écran.
  const fonds = await page
    .getByTestId('site-etape')
    .evaluateAll((n) => n.map((e) => getComputedStyle(e).backgroundColor))
  expect(new Set(fonds).size, 'l’étape active ne se distingue pas des autres').toBe(2)
  await expect(page.getByTestId('site-conditionnel')).toContainText(HABILLAGE.fr.reponse)
  await expect(page.getByTestId('site-piece')).toHaveText(HABILLAGE.fr.fichier)
})
