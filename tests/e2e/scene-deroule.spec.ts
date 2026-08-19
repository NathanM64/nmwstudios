import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByTestId('onglet-deroule').click()
})

async function largeur(page: import('@playwright/test').Page, testId: string) {
  const boite = await page.getByTestId(testId).boundingBox()
  return boite!.width
}

// Un repère ponctuel a sa propre largeur : `left: 100%` seul le fait dépasser la piste de ce
// même montant. N'agit que si le repère existe (le fantôme n'apparaît pas hors accélération).
async function confine(page: import('@playwright/test').Page, testId: string, contexte: string) {
  const locator = page.getByTestId(testId)
  // `.boundingBox()` attend l'élément au lieu de rendre null : le fantôme est absent
  // hors accélération, `count()` évite un timeout de 30 s à chaque appel dans ce cas.
  if ((await locator.count()) === 0) return
  const boite = await locator.boundingBox()
  if (!boite) return
  const piste = (await page.getByTestId('deroule-piste').boundingBox())!
  expect(boite.x, `${testId} déborde à gauche de sa piste (${contexte})`).toBeGreaterThanOrEqual(piste.x - 0.5)
  expect(boite.x + boite.width, `${testId} déborde à droite de sa piste (${contexte})`).toBeLessThanOrEqual(
    piste.x + piste.width + 0.5
  )
}

test('la construction est toujours présente, même sans option', async ({ page }) => {
  await expect(page.getByTestId('deroule-construction')).toBeVisible()
  await expect(page.getByTestId('deroule-cadrage')).toHaveCount(0)
})

test('le cadrage ajoute une barre avant la construction', async ({ page }) => {
  await page.getByRole('checkbox', { name: 'Atelier de cadrage', exact: true }).check()
  await expect(page.getByTestId('deroule-cadrage')).toBeVisible()
})

test('la formation ajoute un jalon après la livraison', async ({ page }) => {
  await page.getByRole('checkbox', { name: 'Formation à la prise en main', exact: true }).check()
  await expect(page.getByTestId('deroule-formation')).toBeVisible()
})

test('une option lourde allonge visiblement la construction', async ({ page }) => {
  const avant = await largeur(page, 'deroule-construction')
  await page.getByRole('checkbox', { name: 'Espace membre', exact: true }).check()
  // Espace membre vit dans la scène « Le site » : la cocher y bascule l'aperçu, comportement
  // existant et voulu ailleurs. On revient sur « Le déroulé » avant de mesurer.
  await page.getByTestId('onglet-deroule').click()
  await expect.poll(() => largeur(page, 'deroule-construction')).toBeGreaterThan(avant)
})

test('la livraison accélérée comprime la barre et laisse un fantôme', async ({ page }) => {
  await page.getByRole('checkbox', { name: 'Espace membre', exact: true }).check()
  await page.getByTestId('onglet-deroule').click()
  const avant = await largeur(page, 'deroule-construction')
  await expect(page.getByTestId('deroule-fantome')).toHaveCount(0)
  await page.getByRole('checkbox', { name: 'Livraison accélérée', exact: true }).check()
  await expect(page.getByTestId('deroule-fantome')).toBeVisible()
  await expect.poll(() => largeur(page, 'deroule-construction')).toBeLessThan(avant)
})

test('la formule retenue peuple la bande mensuelle', async ({ page }) => {
  // Essentiel est retenue au départ.
  await expect(page.getByTestId('deroule-evenement').first()).toBeVisible()
  const avant = await page.getByTestId('deroule-evenement').count()
  await page.getByRole('radio', { name: 'Partenaire', exact: true }).check()
  await expect.poll(() => page.getByTestId('deroule-evenement').count()).toBeGreaterThan(avant)
})

test('se passer de suivi vide la bande sans laisser un cadre muet', async ({ page }) => {
  await page.getByRole('radio', { name: 'Je m’en occupe moi-même', exact: true }).check()
  await expect(page.getByTestId('deroule-evenement')).toHaveCount(0)
  await expect(page.getByTestId('deroule-mois')).toContainText('vous')
})

// Trois groupes non exclusifs, rien n'empêche de cocher les trois en plus d'une formule :
// évite la cascade qui a déjà fait disparaître une option payée sur ce chantier.
test('cadrage, formation et livraison accélérée cochés ensemble restent tous visibles', async ({ page }) => {
  await page.getByRole('checkbox', { name: 'Atelier de cadrage', exact: true }).check()
  await page.getByRole('checkbox', { name: 'Formation à la prise en main', exact: true }).check()
  await page.getByRole('checkbox', { name: 'Livraison accélérée', exact: true }).check()

  for (const testid of ['deroule-cadrage', 'deroule-construction', 'deroule-formation', 'deroule-fantome', 'deroule-livraison']) {
    await expect(page.getByTestId(testid)).toBeVisible()
  }
  // La formule retenue au départ garde sa bande peuplée pendant ce temps.
  await expect(page.getByTestId('deroule-evenement').first()).toBeVisible()
})

// `overflow-hidden` écrête en silence, `toBeVisible` de Playwright ne détecte pas cet
// écrêtage par un ancêtre. Même gabarit que « La preuve », pire cas propre au déroulé.
test('sur une petite hauteur, la scène du déroulé ne déborde pas silencieusement de son cadre', async ({ page }) => {
  const resolutions = [
    { width: 1366, height: 768 },
    { width: 1024, height: 700 },
    { width: 1280, height: 800 },
    { width: 1280, height: 600 },
  ]
  const pireCasDeroule =
    '/configurateur?cadrage&formation&express&partenaire&pages=4&langue=3&redaction=15&reprise&photos&visuels&blog&article=10&membre&formulaire&rdv&newsletter&paiement&seo&seo-local&perf&a11y&rgpd&legal&migration&domaine'

  for (const taille of resolutions) {
    await page.setViewportSize(taille)
    await page.goto(pireCasDeroule)
    await page.getByTestId('onglet-deroule').click()
    // `objet-scene`, pas `apercu` : depuis la Task 11, c'est lui qui écrête, l'aperçu se
    // contente d'accueillir la barre d'onglets et de lui laisser le reste en flex.
    const debordement = await page
      .getByTestId('objet-scene')
      .evaluate((el) => el.scrollHeight - el.clientHeight)
    expect(debordement, `débordement à ${taille.width}x${taille.height}`).toBeLessThanOrEqual(6)

    const contexte = `pire cas ${taille.width}x${taille.height}`
    await confine(page, 'deroule-livraison', contexte)
    await confine(page, 'deroule-fantome', contexte)
  }

  // État par défaut : deroule-livraison est à `left: 100%`, exactement le cas qui dépassait.
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/configurateur')
  await page.getByTestId('onglet-deroule').click()
  await confine(page, 'deroule-livraison', 'état par défaut')
  await confine(page, 'deroule-fantome', 'état par défaut')
})
