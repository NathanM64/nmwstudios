import { expect, test } from '@playwright/test'
import { STYLES } from '../../lib/config/styles'
import { parseColor } from '../../lib/color/contrast'

const AVEC_OPTIONS = '/configurateur?pages=2&blog&article=3&rdv&newsletter&paiement&membre&photos&formulaire&reprise&redaction=3&visuels'

const REPERES = ['site-blog', 'site-rdv', 'site-newsletter', 'site-paiement', 'site-article', 'site-creneau', 'site-connexion', 'site-page-redigee']

for (const style of STYLES) {
  test(`les manifestations d’options suivent la direction ${style.id}`, async ({ page }) => {
    await page.goto(AVEC_OPTIONS)
    await page.getByTestId('selecteur-style').selectOption(style.id)

    // Une couleur écrite en dur dans un composant sortirait de la palette du style,
    // et trancherait sur le reste sans qu'aucun autre test ne le voie.
    const palette = ['--m-texte', '--m-texte-sourd', '--m-accent', '--m-accent-contraste'].map((nom) => {
      const { r, g, b } = parseColor(style.variables[nom]).rgb
      return `rgb(${r}, ${g}, ${b})`
    })

    for (const repere of REPERES) {
      const couleur = await page.getByTestId(repere).first().evaluate((n) => getComputedStyle(n).color)
      expect(palette, `${repere} en ${style.id}`).toContain(couleur)
    }
  })
}

test('le cadre image est un aplat dense, pas un rectangle vide', async ({ page }) => {
  await page.goto(AVEC_OPTIONS)
  const fond = await page
    .getByTestId('site-cadre')
    .evaluate((n) => getComputedStyle(n).backgroundImage + getComputedStyle(n).backgroundColor)
  expect(fond).not.toContain('rgba(0, 0, 0, 0)')
  expect(fond).toContain('gradient')
})
