import { expect, test } from '@playwright/test'
import { STYLES } from '../../lib/config/styles'
import { parseColor } from '../../lib/color/contrast'
import { DOMAINES } from '../../lib/config/domaines'
import { hydrate } from './fenetre'

const AVEC_OPTIONS = '/configurateur?pages=2&blog&article=3&rdv&newsletter&paiement&membre&photos&formulaire&reprise&redaction=3&visuels'

const REPERES = ['site-blog', 'site-rdv', 'site-newsletter', 'site-paiement', 'site-article', 'site-creneau', 'site-connexion', 'site-page-redigee']

for (const style of STYLES) {
  test(`les manifestations d’options suivent la direction ${style.id}`, async ({ page }) => {
    await page.goto(AVEC_OPTIONS)
    await hydrate(page)
    await page.getByTestId('selecteur-style').selectOption(style.id)

    // Une couleur écrite en dur dans un composant sortirait de la palette du style,
    // et trancherait sur le reste sans qu'aucun autre test ne le voie.
    const palette = ['--m-texte', '--m-texte-sourd', '--m-accent', '--m-accent-contraste'].map((nom) => {
      const { r, g, b } = parseColor(style.variables[nom]).rgb
      return `rgb(${r}, ${g}, ${b})`
    })

    for (const repere of REPERES) {
      // Sondage : `selectOption` rend la main avant que React ait repeint, et une lecture
      // immédiate rend la couleur de la direction précédente.
      // La palette est passée en argument : une fermeture ne traverse pas `evaluate`.
      await expect
        .poll(
          () =>
            page
              .getByTestId(repere)
              .first()
              .evaluate((n, p) => p.includes(getComputedStyle(n).color), palette),
          { message: `${repere} en ${style.id} sort de la palette` }
        )
        .toBe(true)
    }
  })
}

test('le cadre image porte une image servie, pas un rectangle vide', async ({ page }) => {
  await page.goto(AVEC_OPTIONS)
    await hydrate(page)
  const cadre = await page.getByTestId('site-cadre').evaluate((n) => {
    const s = getComputedStyle(n)
    return { image: s.backgroundImage, taille: s.backgroundSize, fond: s.backgroundColor }
  })
  // Le filet mesurait la recette du dégradé jusqu'au 21/08/2026. Il mesure maintenant la
  // promesse : une image réellement servie, qui remplit sa place.
  expect(cadre.image, 'aucune image de fond').not.toBe('none')
  expect(cadre.image, 'image non servie depuis le dossier des métiers').toContain('/maquette/')
  expect(cadre.taille, 'image qui flotte au lieu de remplir').toBe('cover')
  expect(cadre.fond, 'aucun fond sous l’image').not.toBe('rgba(0, 0, 0, 0)')
})

test("l'image servie est celle du métier choisi", async ({ page }) => {
  // Sans ce constat, une seule image codée en dur satisferait le filet précédent pour les sept.
  await page.goto(AVEC_OPTIONS)
    await hydrate(page)
  const lu = async () =>
    page.getByTestId('site-cadre').evaluate((n) => getComputedStyle(n).backgroundImage)
  const avant = await lu()
  const autre = DOMAINES.find((d) => !avant.includes(`/${d.id}.avif`))!
  await page.getByTestId('selecteur-domaine').selectOption(autre.id)
  await expect.poll(lu, { message: `l’image ne suit pas le passage à ${autre.id}` }).toContain(`/${autre.id}.avif`)
})
