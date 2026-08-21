import { expect, test } from '@playwright/test'
import { DOMAINES } from '../../lib/config/domaines'
import { STYLES, styleParId } from '../../lib/config/styles'
import { contrastRatio, parseColor } from '../../lib/color/contrast'

test.beforeEach(async ({ page }) => {
  await page.goto('/configurateur')
})

test('les deux sélecteurs vivent dans la colonne d’options, plus dans le bandeau', async ({ page }) => {
  // Le repère porte le `<select>` natif, invisible et conservé pour la valeur : la présence
  // se vérifie donc sur le déclencheur, seul élément réellement peint.
  const colonne = page.getByTestId('colonne-options')
  await expect(colonne.getByTestId('selecteur-domaine-declencheur')).toBeVisible()
  await expect(colonne.getByTestId('selecteur-style-declencheur')).toBeVisible()

  // Et nulle part ailleurs : le bandeau de l’aperçu ne les porte plus.
  const apercu = page.getByTestId('apercu')
  await expect(apercu.getByTestId('selecteur-domaine-declencheur')).toHaveCount(0)
  await expect(apercu.getByTestId('selecteur-style-declencheur')).toHaveCount(0)
})

test('le bloc se pose sous le titre et au dessus du premier groupe', async ({ page }) => {
  const bloc = page.getByTestId('reglages-maquette')
  // Les deux déclencheurs vivent dans ce bloc, pas seulement quelque part dans la colonne.
  await expect(bloc.getByTestId('selecteur-domaine-declencheur')).toBeVisible()
  await expect(bloc.getByTestId('selecteur-style-declencheur')).toBeVisible()

  const titre = (await page.getByRole('heading', { name: 'Configurez votre site' }).boundingBox())!
  const boite = (await bloc.boundingBox())!
  const premier = (await page.locator('[data-groupe]').first().boundingBox())!
  expect(boite.y).toBeGreaterThanOrEqual(titre.y + titre.height - 1)
  expect(boite.y + boite.height).toBeLessThanOrEqual(premier.y + 1)
})

test('le bloc dit en toutes lettres qu’il ne touche pas au devis', async ({ page }) => {
  const bloc = page.getByTestId('reglages-maquette')
  // La seule mise en forme ne suffit pas : posé au-dessus de groupes qui affichent tous un
  // prix, le bloc doit dire lui-même qu’il n’en porte aucun.
  await expect(bloc).toContainText('aperçu')
  await expect(bloc).toContainText(/prix|devis/)
  await expect(bloc).not.toContainText('€')
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

test('la hauteur du bloc ne dépend pas des valeurs choisies', async ({ page }) => {
  // Le bloc est posé au-dessus de tout ce que le relevé de lecture mesure : une hauteur qui
  // change avec le libellé retenu décalerait tous les groupes sous la ligne de lecture. Le plus
  // long des métiers le prouve, c'est lui qui passait à la ligne quand les deux étaient côte à côte.
  const bloc = page.getByTestId('reglages-maquette')
  const hauteur = async () => (await bloc.boundingBox())!.height
  const depart = await hauteur()

  const plusLong = [...DOMAINES].sort((a, b) => b.libelle.length - a.libelle.length)[0]
  await page.getByTestId('selecteur-domaine').selectOption(plusLong.id)
  await expect(page.getByTestId('selecteur-domaine-declencheur')).toHaveText(plusLong.libelle)
  expect(await hauteur(), `hauteur du bloc sur « ${plusLong.libelle} »`).toBe(depart)
})

test('la mention est une légende, posée sous le cadre et dans le panneau', async ({ page }) => {
  const cadre = (await page.getByTestId('objet-scene').boundingBox())!
  const mention = (await page.getByTestId('mention-style').boundingBox())!
  expect(mention.y).toBeGreaterThanOrEqual(cadre.y + cadre.height - 1)
  // Le panneau est `overflow-hidden` : sous son bas, la mention est peinte nulle part et
  // aucune des assertions de texte ci-dessous ne s'en apercevrait.
  const panneau = (await page.getByTestId('apercu').boundingBox())!
  expect(mention.y + mention.height).toBeLessThanOrEqual(panneau.y + panneau.height + 1)
})

test('la mention dit les deux choses en une phrase', async ({ page }) => {
  const mention = page.getByTestId('mention-style')
  await expect(mention).toContainText('pas votre futur site')
  await expect(mention).toContainText('dessin')
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
