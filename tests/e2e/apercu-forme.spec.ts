import { expect, test } from '@playwright/test'
import { SCENES } from '../../lib/config/scenes'

test('les onglets sont posés à l’intérieur de l’aperçu', async ({ page }) => {
  await page.goto('/configurateur')
  for (const scene of SCENES) {
    await expect(page.getByTestId('apercu').getByTestId(`onglet-${scene.id}`)).toBeVisible()
  }
})

test('l’onglet actif est annoncé aux technologies d’assistance', async ({ page }) => {
  await page.goto('/configurateur')
  await expect(page.getByTestId('onglet-site')).toHaveAttribute('aria-pressed', 'true')
  await page.getByTestId('onglet-preuve').click()
  await expect(page.getByTestId('onglet-preuve')).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByTestId('onglet-site')).toHaveAttribute('aria-pressed', 'false')
})

test('la maquette est posée sur le verre comme un objet distinct', async ({ page }) => {
  await page.goto('/configurateur')
  const ombre = await page.getByTestId('objet-scene').evaluate((n) => getComputedStyle(n).boxShadow)
  expect(ombre).not.toBe('none')
})

test('plus aucune infobulle ne subsiste dans le panneau', async ({ page }) => {
  await page.goto('/configurateur')
  await expect(page.getByRole('button', { name: /^Que comprend/ })).toHaveCount(0)
})

/** Tailles de texte réellement vues à l’écran : la police déclarée, multipliée par les
 *  échelles cumulées jusqu’à la racine. Sans ce produit, on mesure le cadre logique. */
function taillesRendues(el: Element): number[] {
  const echelle = (noeud: Element) => {
    let k = 1
    for (let n: Element | null = noeud; n && n !== document.documentElement; n = n.parentElement) {
      const s = getComputedStyle(n).scale
      if (s && s !== 'none') k *= parseFloat(s)
    }
    return k
  }
  const cibles = [el, ...el.querySelectorAll('*')]
  return cibles
    .filter((n) => [...n.childNodes].some((e) => e.nodeType === 3 && e.textContent!.trim()))
    .map((n) => parseFloat(getComputedStyle(n).fontSize) * echelle(n))
}

// Le reproche d'origine : 27 éléments des trois scènes en 7 à 8 px sur un cadre de 902 px.
test('en fenêtre 1440 × 900, aucun texte de la maquette n’est rendu sous 10 px', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  const pireCas =
    '/configurateur?pages=4&langue=3&redaction=15&reprise&photos&visuels&blog&article=10&membre&formulaire&rdv&newsletter&paiement&seo&seo-local&perf&a11y&rgpd&legal&migration&domaine&cadrage&formation&express&partenaire'

  for (const scene of ['site', 'preuve', 'deroule']) {
    await page.goto(pireCas)
    await page.getByTestId(`onglet-${scene}`).click()
    const tailles = await page.getByTestId('objet-scene').evaluate(taillesRendues)
    expect(tailles.length, `aucun texte mesuré dans la scène ${scene}`).toBeGreaterThan(3)
    expect(Math.min(...tailles), `plus petit texte de la scène ${scene}`).toBeGreaterThanOrEqual(10)
  }
})

test('le texte courant de la maquette est rendu au-dessus de 11 px en fenêtre 1440 × 900', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/configurateur?pages=4')
  const entrees = await page.getByTestId('site-nav').evaluate(taillesRendues)
  expect(Math.min(...entrees), 'entrées de navigation de la maquette').toBeGreaterThanOrEqual(11)
})

test('la maquette ne dépasse jamais sa taille naturelle, et se réduit quand la place manque', async ({ page }) => {
  const echelle = () => page.getByTestId('objet-scene').evaluate((el) => parseFloat(getComputedStyle(el).scale))

  await page.setViewportSize({ width: 1920, height: 1080 })
  await page.goto('/configurateur')
  expect(await echelle(), 'très grand écran').toBe(1)

  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/configurateur')
  const reduite = await echelle()
  expect(reduite, 'écran contraint').toBeLessThan(1)
  expect(reduite, 'écran contraint').toBeGreaterThan(0.5)
})
