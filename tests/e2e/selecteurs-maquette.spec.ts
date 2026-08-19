import { expect, test } from '@playwright/test'
import { DOMAINES } from '../../lib/config/domaines'
import { STYLES, styleParId } from '../../lib/config/styles'
import { contrastRatio, parseColor } from '../../lib/color/contrast'

test.beforeEach(async ({ page }) => {
  await page.goto('/configurateur')
})

test('les deux sélecteurs vivent dans le bandeau de l’aperçu', async ({ page }) => {
  // Le repère porte le `<select>` natif, invisible et conservé pour la valeur : la présence
  // se vérifie donc sur le déclencheur, seul élément réellement peint.
  const apercu = page.getByTestId('apercu')
  await expect(apercu.getByTestId('selecteur-domaine-declencheur')).toBeVisible()
  await expect(apercu.getByTestId('selecteur-style-declencheur')).toBeVisible()
})

test('le sélecteur de domaine propose les sept métiers', async ({ page }) => {
  const options = page.getByTestId('selecteur-domaine').locator('option')
  await expect(options).toHaveCount(DOMAINES.length)
})

test('le sélecteur de style propose les trois directions', async ({ page }) => {
  const options = page.getByTestId('selecteur-style').locator('option')
  await expect(options).toHaveCount(STYLES.length)
})

test('changer de domaine change le texte de la maquette', async ({ page }) => {
  const scene = page.getByTestId('objet-scene')
  const avant = await scene.textContent()
  await page.getByTestId('selecteur-domaine').selectOption('vtc')
  await expect.poll(() => scene.textContent()).not.toBe(avant)
})

test('changer de style change la palette sans changer le texte', async ({ page }) => {
  const titre = page.getByTestId('objet-scene')
  const texte = await titre.textContent()
  const fondAvant = await page.getByTestId('maquette').evaluate((n) => getComputedStyle(n).backgroundColor)

  await page.getByTestId('selecteur-style').selectOption('premium')

  await expect
    .poll(() => page.getByTestId('maquette').evaluate((n) => getComputedStyle(n).backgroundColor))
    .not.toBe(fondAvant)
  await expect(titre).toHaveText(texte!)
})

test('la mention rappelle que la vôtre sera dessinée pour vous', async ({ page }) => {
  // Sans elle, le sélecteur se lit comme un choix de gabarit, ce que tout le
  // positionnement du site contredit.
  await expect(page.getByTestId('mention-style')).toContainText('dessin')
})

test('les onglets de scène restent au premier plan du bandeau', async ({ page }) => {
  const onglet = await page.getByTestId('onglet-site').boundingBox()
  const selecteur = await page.getByTestId('selecteur-domaine-declencheur').boundingBox()
  expect(onglet!.y).toBeLessThanOrEqual(selecteur!.y)
})

// Les `<option>` d'un `<select>` natif sont dessinées par le système : hors fond et couleur,
// aucune règle CSS ne les atteint. C'est pourquoi le volet est rendu par nos soins.
for (const theme of ['dark', 'light'] as const) {
  test(`le volet des options est peint dans le thème ${theme}, pas par le système`, async ({ page }) => {
    await page.evaluate((t) => {
      document.documentElement.dataset.theme = t
    }, theme)
    await page.getByTestId('selecteur-domaine-declencheur').click()

    const volet = page.getByTestId('selecteur-domaine-volet')
    await expect(volet).toBeVisible()

    const mesure = await volet.evaluate((n) => ({
      fond: getComputedStyle(n).backgroundColor,
      encre: getComputedStyle(n.querySelector('[role="option"]')!).color,
    }))

    // Un volet en verre laisserait lire au travers le texte de la page qui passe dessous.
    expect(mesure.fond, 'le volet doit être opaque').toMatch(/^rgb\(/)
    const ratio = contrastRatio(parseColor(mesure.encre).rgb, parseColor(mesure.fond).rgb)
    expect(ratio, `contraste des options en thème ${theme}`).toBeGreaterThanOrEqual(4.5)
  })
}

test('le volet se pilote au clavier et se ferme sur Échap', async ({ page }) => {
  const declencheur = page.getByTestId('selecteur-domaine-declencheur')
  await declencheur.focus()
  await page.keyboard.press('ArrowDown')
  await expect(page.getByTestId('selecteur-domaine-volet')).toBeVisible()

  // Le volet s'ouvre sur l'option retenue, comme un select natif : le domaine par défaut
  // étant le dernier de la liste, c'est `Home` qui prouve le déplacement.
  await page.keyboard.press('Home')
  await page.keyboard.press('Enter')
  await expect(page.getByTestId('selecteur-domaine-volet')).toHaveCount(0)
  await expect(page.getByTestId('selecteur-domaine')).toHaveValue(DOMAINES[0].id)

  await page.keyboard.press('ArrowDown')
  await expect(page.getByTestId('selecteur-domaine-volet')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByTestId('selecteur-domaine-volet')).toHaveCount(0)
})

// Le sélecteur de langue vit dans la maquette : c'est un widget du site prévisualisé, donc
// il suit la direction choisie et non le thème du site.
for (const style of STYLES) {
  test(`le sélecteur de langue de la maquette suit la direction ${style.id}`, async ({ page }) => {
    await page.goto('/configurateur?langue=2')
    await page.getByTestId('selecteur-style').selectOption(style.id)

    const mesure = await page.getByTestId('site-langue').evaluate((n) => ({
      fond: getComputedStyle(n).backgroundColor,
      encre: getComputedStyle(n).color,
      schema: getComputedStyle(n).colorScheme,
    }))

    const attendu = (nom: string) => {
      const { r, g, b } = parseColor(styleParId(style.id)!.variables[nom]).rgb
      return `rgb(${r}, ${g}, ${b})`
    }
    expect(mesure.fond).toBe(attendu('--m-fond'))
    expect(mesure.encre).toBe(attendu('--m-texte'))
    // Sans schéma explicite, le système peint un volet sombre sous un texte sombre.
    expect(mesure.schema).toBe(style.variables['--m-schema'])
  })
}
