import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'
import { GROUPES, OPTIONS } from '../../lib/config/catalogue'

// Repère propre à chaque option : preuve qu'elle garde sa manifestation face à
// ses voisines de groupe, sans comparer des blocs d'innerHTML entre eux.
const REPERE_PAR_OPTION: Record<string, (page: Page) => Promise<void>> = {
  pages: (page) => expect(page.getByTestId('site-nav').getByRole('listitem')).not.toHaveCount(3),
  blog: (page) => expect(page.getByTestId('site-blog')).toBeVisible(),
  langue: (page) => expect(page.getByTestId('site-langue')).toBeVisible(),
  redaction: (page) => expect(page.getByTestId('site-page-redigee')).not.toHaveCount(0),
  reprise: (page) => expect(page.getByTestId('site-service')).toHaveCount(3),
  photos: async (page) => {
    // Aligner trois cadrages n'ajoute aucun repère : le constat porte sur ce qui est peint.
    const cadrages = await page
      .getByTestId('site-cadre')
      .evaluateAll((n) => n.map((e) => getComputedStyle(e).backgroundPosition))
    expect(new Set(cadrages).size, 'les trois emplacements ne coïncident pas').toBe(1)
  },
  visuels: (page) => expect(page.getByTestId('site-visuel')).toBeVisible(),
  formulaire: (page) => expect(page.getByTestId('site-etapes')).toBeVisible(),
  rdv: (page) => expect(page.getByTestId('site-rdv')).toBeVisible(),
  newsletter: (page) => expect(page.getByTestId('site-newsletter')).toBeVisible(),
  paiement: (page) => expect(page.getByTestId('site-paiement')).toBeVisible(),
  membre: (page) => expect(page.getByTestId('site-connexion')).toBeVisible(),
  seo: (page) => expect(page.getByTestId('preuve-serp')).toBeVisible(),
  'seo-local': (page) =>
    expect(page.getByTestId('preuve-ligne').filter({ hasText: 'Fiche locale et horaires' })).toContainText(
      'horaires d’ouverture renseignés'
    ),
  article: (page) => expect(page.getByTestId('site-article').first()).toBeVisible(),
  legal: (page) => expect(page.getByTestId('preuve-legal')).toBeVisible(),
  rgpd: (page) => expect(page.getByTestId('preuve-rgpd')).toBeVisible(),
  a11y: (page) => expect(page.getByTestId('apercu-a11y')).toBeVisible(),
  migration: (page) => expect(page.getByTestId('preuve-redirections')).toBeVisible(),
  domaine: (page) => expect(page.getByTestId('preuve-domaine')).toBeVisible(),
  perf: (page) => expect(page.getByTestId('preuve-vitesse')).toBeVisible(),
  express: (page) => expect(page.getByTestId('deroule-fantome')).toBeVisible(),
  cadrage: (page) => expect(page.getByTestId('deroule-cadrage')).toBeVisible(),
  formation: (page) => expect(page.getByTestId('deroule-formation')).toBeVisible(),
}

// Groupes cumulables : `recurrent` est exclusif, et le socle n'a qu'une seule
// option sans contrôle, donc rien à cocher côte à côte.
const GROUPES_CUMULABLES = GROUPES.filter(
  (groupe) => !groupe.exclusif && OPTIONS.filter((o) => o.groupe === groupe.id).length > 1
)

for (const groupe of GROUPES_CUMULABLES) {
  const options = OPTIONS.filter((o) => o.groupe === groupe.id)

  test(`le groupe « ${groupe.titre} », toutes ses options cochées ensemble, garde la manifestation de chacune`, async ({
    page,
  }) => {
    await page.goto('/configurateur')

    for (const option of options) {
      if (option.quantifiable) {
        await page.getByRole('button', { name: `Ajouter : ${option.libelle}` }).click()
      } else {
        await page.getByRole('checkbox', { name: option.libelle, exact: true }).check()
      }
    }

    for (const option of options) {
      await REPERE_PAR_OPTION[option.id](page)
    }
  })
}
