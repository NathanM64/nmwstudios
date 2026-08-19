import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByTestId('onglet-preuve').click()
})

test('le rapport reste un objet plein même sans option retenue', async ({ page }) => {
  // C'est ce qui remplace le « rien à montrer » de l'ancienne version.
  await expect(page.getByTestId('preuve-ligne')).toHaveCount(8)
})

test('le compteur suit le nombre de contrôles au vert', async ({ page }) => {
  await expect(page.getByTestId('preuve-score')).toContainText('0')
  await page.getByRole('checkbox', { name: 'Fondations SEO', exact: true }).check()
  await expect(page.getByTestId('preuve-score')).toContainText('1')
  await page.getByRole('checkbox', { name: 'Conformité RGPD', exact: true }).check()
  await expect(page.getByTestId('preuve-score')).toContainText('2')
})

test('le référencement compose un extrait de résultat', async ({ page }) => {
  await expect(page.getByTestId('preuve-serp')).toHaveCount(0)
  await page.getByRole('checkbox', { name: 'Fondations SEO', exact: true }).check()
  await expect(page.getByTestId('preuve-serp')).toBeVisible()
})

test('la vitesse affichée est mesurée et se présente comme telle', async ({ page }) => {
  await page.getByRole('checkbox', { name: 'Optimisation de la vitesse', exact: true }).check()
  await expect(page.getByTestId('preuve-cascade')).toBeVisible()
  // Le mot qui ferme la lecture : « cette page » se lirait comme le futur site du visiteur.
  await expect(page.getByTestId('preuve-vitesse')).toContainText('configurateur')
  await expect(page.getByTestId('preuve-vitesse')).toContainText('s')
})

test('la vitesse vient de l’API Performance, pas d’une constante', async ({ page }) => {
  await page.addInitScript(() => {
    performance.getEntriesByType = () => [{ duration: 7777, entryType: 'navigation', name: '', startTime: 0, toJSON: () => ({}) }] as never
  })
  await page.goto('/configurateur?perf')
  await page.getByTestId('onglet-preuve').click()
  await expect(page.getByTestId('preuve-vitesse')).toContainText('7.78')
})

test('la migration montre une redirection réelle', async ({ page }) => {
  await page.getByRole('checkbox', { name: 'Migration de votre site actuel', exact: true }).check()
  await expect(page.getByTestId('preuve-redirections')).toContainText('301')
})

test('les lignes non retenues restent visibles et grisées', async ({ page }) => {
  const ligne = page.getByTestId('preuve-ligne').filter({ hasText: 'Mentions légales' })
  await expect(ligne).toBeVisible()
  await expect(ligne).toHaveAttribute('data-retenu', 'non')
  await page.getByRole('checkbox', { name: 'Mentions légales et CGV', exact: true }).check()
  await expect(ligne).toHaveAttribute('data-retenu', 'oui')
})

test('la vitesse affichée change d’une visite à l’autre ou reste plausible', async ({ page }) => {
  await page.getByRole('checkbox', { name: 'Optimisation de la vitesse', exact: true }).check()
  // Attend la mesure : le premier rendu affiche « mesure indisponible ».
  await expect(page.getByTestId('preuve-vitesse')).not.toHaveText('mesure indisponible')
  const texte = await page.getByTestId('preuve-vitesse').textContent()
  const secondes = Number(/(\d+[.,]\d+)/.exec(texte ?? '')?.[1]?.replace(',', '.'))
  // Une constante en dur passerait ce test ; c'est le test unitaire de lireChargement
  // qui garantit la provenance. Celui-ci garde seulement la valeur dans le réel.
  expect(secondes).toBeGreaterThan(0)
  expect(secondes).toBeLessThan(30)
})

// Trois groupes non exclusifs, rien n'empêche de cocher les huit : évite la
// cascade qui a déjà fait disparaître une option payée sur ce chantier.
test('les huit contrôles cochés ensemble passent tous au vert, sans en faire disparaître un', async ({ page }) => {
  for (const nom of [
    'Fondations SEO',
    'Référencement local',
    'Optimisation de la vitesse',
    'Accessibilité RGAA',
    'Conformité RGPD',
    'Mentions légales et CGV',
    'Migration de votre site actuel',
    'Domaine et e-mails professionnels',
  ]) {
    await page.getByRole('checkbox', { name: nom, exact: true }).check()
  }

  // toContainText('8') passerait même à zéro contrôle retenu : le dénominateur le contient toujours.
  await expect(page.getByTestId('preuve-score')).toHaveText(/^8 \/ 8/)
  const lignes = page.getByTestId('preuve-ligne')
  await expect(lignes).toHaveCount(8)
  for (let i = 0; i < 8; i++) {
    await expect(lignes.nth(i)).toHaveAttribute('data-retenu', 'oui')
  }

  // data-retenu seul ne verrait pas une cascade qui viderait l'instrument sans toucher la ligne :
  // on vérifie aussi que chaque preuve concrète reste affichée une fois les huit cochées ensemble.
  for (const testid of ['preuve-serp', 'preuve-cascade', 'preuve-vitesse', 'apercu-a11y', 'preuve-rgpd', 'preuve-legal', 'preuve-redirections', 'preuve-domaine']) {
    await expect(page.getByTestId(testid)).toBeVisible()
  }
})

// `overflow-hidden` écrête en silence, `toBeVisible` ne voit pas ce rognage.
// Même gabarit que la scène du site, pire cas propre à « La preuve ».
test('sur une petite hauteur, la scène de la preuve ne déborde pas silencieusement de son cadre', async ({ page }) => {
  const resolutions = [
    { width: 1366, height: 768 },
    { width: 1024, height: 700 },
    { width: 1280, height: 800 },
    { width: 1280, height: 600 },
  ]
  const pireCasPreuve = '/configurateur?seo&seo-local&perf&a11y&rgpd&legal&migration&domaine'

  for (const taille of resolutions) {
    await page.setViewportSize(taille)
    await page.goto(pireCasPreuve)
    await page.getByTestId('onglet-preuve').click()
    const debordement = await page
      .getByTestId('apercu')
      .evaluate((el) => el.scrollHeight - el.clientHeight)
    expect(debordement, `débordement à ${taille.width}x${taille.height}`).toBeLessThanOrEqual(6)
  }
})
