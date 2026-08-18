import { expect, test } from '@playwright/test'
import { contrastRatio, parseColor } from '../../lib/color/contrast'
import { GROUPES, OPTIONS, SOCLE_ID } from '../../lib/config/catalogue'
import { SCENES, sceneDeOption } from '../../lib/config/scenes'

test('la route du configurateur répond et s’annonce', async ({ page }) => {
  await page.goto('/configurateur')
  await expect(page.getByRole('heading', { level: 1, name: /configurez votre site/i })).toBeVisible()
})

test('l’aperçu est étiqueté comme une démonstration', async ({ page }) => {
  await page.goto('/configurateur')
  await expect(page.getByText('aperçu, pas votre futur site')).toBeVisible()
})

test('cocher une option la retient', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByRole('checkbox', { name: 'Un blog' }).check()
  await expect(page.getByRole('checkbox', { name: 'Un blog' })).toBeChecked()
})

test('le socle est affiché mais ne se décoche pas', async ({ page }) => {
  await page.goto('/configurateur')
  // .first() : le récapitulatif reprend aussi ce libellé, fermé mais présent dans le DOM.
  await expect(page.getByText('1 à 3 pages, formulaire de contact').first()).toBeVisible()
  await expect(page.getByRole('checkbox', { name: /1 à 3 pages/ })).toHaveCount(0)
})

test('le pas-à-pas incrémente une option quantifiable', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByRole('button', { name: 'Ajouter : 3 pages de plus' }).click()
  await page.getByRole('button', { name: 'Ajouter : 3 pages de plus' }).click()
  await expect(page.getByTestId('quantite-pages')).toHaveText('2')
})

test('le pas-à-pas ne descend pas sous zéro', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByRole('button', { name: 'Retirer : 3 pages de plus' }).click()
  await expect(page.getByTestId('quantite-pages')).toHaveText('0')
})

test('le pas-à-pas ne dépasse pas le maximum de l’option', async ({ page }) => {
  await page.goto('/configurateur')
  const ajouter = page.getByRole('button', { name: 'Ajouter : 3 pages de plus' })
  for (let i = 0; i < 6; i++) await ajouter.click()
  await expect(page.getByTestId('quantite-pages')).toHaveText('4')
})

test('les formules récurrentes s’excluent mutuellement', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByRole('radio', { name: 'Essentiel' }).check()
  await page.getByRole('radio', { name: 'Sérénité' }).check()
  await expect(page.getByRole('radio', { name: 'Essentiel' })).not.toBeChecked()
  await expect(page.getByRole('radio', { name: 'Sérénité' })).toBeChecked()
})

test('choisir une formule remplace la précédente dans le montant mensuel', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByRole('radio', { name: 'Essentiel' }).check()
  await page.getByRole('radio', { name: 'Sérénité' }).check()
  await expect(page.getByTestId('mensuel')).toContainText('190')
})

test('la barre affiche la fourchette et le mensuel ensemble', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByRole('radio', { name: 'Essentiel' }).check()
  await expect(page.getByTestId('fourchette')).toContainText('€')
  await expect(page.getByTestId('mensuel')).toContainText('90')
})

test('la fourchette monte quand on ajoute une option', async ({ page }) => {
  await page.goto('/configurateur')
  const avant = await page.getByTestId('fourchette').textContent()
  await page.getByRole('checkbox', { name: 'Un blog' }).check()
  await expect(page.getByTestId('fourchette')).not.toHaveText(avant ?? '')
})

test('le delta annonce le montant ajouté', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByRole('checkbox', { name: 'Un blog' }).check()
  await expect(page.getByTestId('delta')).toHaveText('+700 €')
})

test('la barre reste visible sans défilement', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/configurateur')
  await expect(page.getByTestId('fourchette')).toBeInViewport()
})

test('l’explication d’une option est masquée par défaut', async ({ page }) => {
  await page.goto('/configurateur')
  // toBeHidden() seul passerait aussi si le texte n'existait nulle part : toBeAttached()
  // force la preuve que le popover est bien dans le DOM, juste fermé.
  const explication = page.getByText(/Une section actualités que vous alimentez/)
  await expect(explication).toBeAttached()
  await expect(explication).toBeHidden()
})

test('l’explication s’ouvre au clic et se ferme à Échap', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByRole('button', { name: 'Que comprend : Un blog' }).click()
  await expect(page.getByText(/Une section actualités que vous alimentez/)).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByText(/Une section actualités que vous alimentez/)).toBeHidden()
})

test('l’explication s’atteint au clavier', async ({ page }) => {
  await page.goto('/configurateur')
  const bouton = page.getByRole('button', { name: 'Que comprend : Un blog' })
  await bouton.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByText(/Une section actualités que vous alimentez/)).toBeVisible()
})

test('l’aperçu montre trois entrées de navigation par défaut', async ({ page }) => {
  await page.goto('/configurateur')
  await expect(page.getByTestId('apercu-nav').getByRole('listitem')).toHaveCount(3)
})

test('ajouter une tranche de pages enrichit la navigation de l’aperçu', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByRole('button', { name: 'Ajouter : 3 pages de plus' }).click()
  await expect(page.getByTestId('apercu-nav').getByRole('listitem')).toHaveCount(6)
})

test('cocher le blog fait apparaître la section actualités dans l’aperçu', async ({ page }) => {
  await page.goto('/configurateur')
  await expect(page.getByTestId('apercu-blog')).toHaveCount(0)
  await page.getByRole('checkbox', { name: 'Un blog' }).check()
  await expect(page.getByTestId('apercu-blog')).toBeVisible()
})

test('cocher l’espace membre ajoute le bouton de connexion dans l’aperçu', async ({ page }) => {
  await page.goto('/configurateur')
  await expect(page.getByTestId('apercu-connexion')).toHaveCount(0)
  await page.getByRole('checkbox', { name: 'Espace membre' }).check()
  await expect(page.getByTestId('apercu-connexion')).toBeVisible()
})

test('l’accessibilité affiche un ratio de contraste mesuré et conforme', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByRole('checkbox', { name: 'Accessibilité RGAA' }).check()
  const jetons = await page.evaluate(() => {
    const styles = getComputedStyle(document.documentElement)
    return {
      texte: styles.getPropertyValue('--color-foreground').trim(),
      fond: styles.getPropertyValue('--color-canvas').trim(),
    }
  })
  // Rejoue le calcul depuis les jetons réellement rendus : un ratio codé en dur
  // ou lu sur la mauvaise paire de jetons ne coïnciderait pas avec ce résultat.
  const attendu = contrastRatio(parseColor(jetons.texte).rgb, parseColor(jetons.fond).rgb)
  const texte = await page.getByTestId('apercu-a11y').textContent()
  const ratio = Number(/(\d+[.,]\d+)/.exec(texte ?? '')?.[1].replace(',', '.'))
  expect(ratio).toBeGreaterThanOrEqual(4.5)
  expect(ratio).toBeCloseTo(attendu, 2)
})

test('le ratio de contraste est remesuré au changement de thème', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByRole('checkbox', { name: 'Accessibilité RGAA' }).check()
  const avant = await page.getByTestId('apercu-a11y').textContent()
  await page.getByRole('button', { name: 'Changer de thème' }).click()
  await expect(page.getByTestId('apercu-a11y')).not.toHaveText(avant ?? '')
})

test('le SEO affiche l’extrait de résultat de recherche', async ({ page }) => {
  await page.goto('/configurateur')
  await expect(page.getByTestId('apercu-seo')).toHaveCount(0)
  await page.getByRole('checkbox', { name: 'Fondations SEO' }).check()
  await expect(page.getByTestId('apercu-seo')).toBeVisible()
})

test('la langue supplémentaire ajoute un sélecteur qui bascule l’aperçu', async ({ page }) => {
  await page.goto('/configurateur')
  await expect(page.getByTestId('apercu-langue')).toHaveCount(0)
  await page.getByRole('button', { name: 'Ajouter : Une langue de plus' }).click()
  await expect(page.getByTestId('apercu-langue')).toBeVisible()
  await page.getByTestId('apercu-langue').selectOption('en')
  await expect(page.getByTestId('apercu-nav')).toContainText('Home')
})

test('la formule récurrente affiche sa carte d’état', async ({ page }) => {
  await page.goto('/configurateur')
  await expect(page.getByTestId('carte-etat')).toHaveCount(0)
  await page.getByRole('radio', { name: 'Sérénité' }).check()
  await expect(page.getByTestId('carte-etat')).toContainText('4 h')
})

test('cocher une option se reflète dans l’URL', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByRole('checkbox', { name: 'Un blog' }).check()
  await expect(page).toHaveURL(/[?&]blog(&|$)/)
})

test('une URL configurée restitue l’état à l’ouverture', async ({ page }) => {
  await page.goto('/configurateur?blog&pages=2&essentiel')
  await expect(page.getByRole('checkbox', { name: 'Un blog' })).toBeChecked()
  await expect(page.getByTestId('quantite-pages')).toHaveText('2')
  await expect(page.getByTestId('mensuel')).toContainText('90')
})

test('configurer ne remplit pas l’historique', async ({ page }) => {
  await page.goto('/configurateur')
  const longueurInitiale = await page.evaluate(() => history.length)
  await page.getByRole('checkbox', { name: 'Un blog' }).check()
  await expect(page).toHaveURL(/blog/)
  await page.getByRole('checkbox', { name: 'Prise de rendez-vous' }).check()
  await expect(page).toHaveURL(/rdv/)
  // Longueur inchangée malgré l’URL qui bouge : la preuve que c’est replaceState, pas pushState.
  expect(await page.evaluate(() => history.length)).toBe(longueurInitiale)
  await page.goBack()
  await expect(page).not.toHaveURL(/configurateur/)
})

test('le configurateur précharge ses polices dans le HTML servi', async ({ request }) => {
  const html = await (await request.get('/configurateur')).text()
  expect(html).toContain('as="font"')
})

test('le compteur dit ce qu’on incrémente', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByRole('button', { name: 'Ajouter : J’écris vos textes' }).click()
  await expect(page.getByTestId('unite-redaction')).toHaveText('page')
  await page.getByRole('button', { name: 'Ajouter : J’écris vos textes' }).click()
  await expect(page.getByTestId('unite-redaction')).toHaveText('pages')
})

test('l’infobulle s’ouvre près de son bouton, pas dans un coin', async ({ page }) => {
  await page.goto('/configurateur')
  const bouton = page.getByRole('button', { name: 'Que comprend : Un blog' })
  await bouton.click()
  const cible = await bouton.boundingBox()
  const bulle = await page.locator('#explication-blog').boundingBox()
  // Sans marge, un popover se colle en haut à gauche du viewport : on vérifie qu'il n'y est pas.
  expect(bulle!.x).toBeGreaterThan(20)
  expect(bulle!.y).toBeGreaterThan(20)
  expect(Math.abs(bulle!.y - cible!.y)).toBeLessThan(400)
})

test('l’aperçu reste visible quand on fait défiler les options', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/configurateur')
  await page.getByRole('radio', { name: 'Partenaire' }).scrollIntoViewIfNeeded()
  await expect(page.getByTestId('apercu-nav')).toBeInViewport()
})

test('cocher le référencement bascule l’aperçu sur la scène de recherche', async ({ page }) => {
  await page.goto('/configurateur')
  await expect(page.getByTestId('apercu-nav')).toBeVisible()
  await page.getByRole('checkbox', { name: 'Fondations SEO' }).check()
  await expect(page.getByTestId('apercu-seo')).toBeVisible()
  await expect(page.getByTestId('apercu-nav')).toHaveCount(0)
})

test('cocher une option visible garde la scène du site', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByRole('checkbox', { name: 'Un blog' }).check()
  await expect(page.getByTestId('apercu-blog')).toBeVisible()
  await expect(page.getByTestId('apercu-nav')).toBeVisible()
})

test('les vignettes ramènent à la scène du site', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByRole('checkbox', { name: 'Fondations SEO' }).check()
  await page.getByRole('button', { name: 'Votre site', exact: true }).click()
  await expect(page.getByTestId('apercu-nav')).toBeVisible()
})

test('la scène du site garde tout ce qui a été coché', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByRole('checkbox', { name: 'Un blog' }).check()
  await page.getByRole('checkbox', { name: 'Fondations SEO' }).check()
  await page.getByRole('button', { name: 'Votre site', exact: true }).click()
  await expect(page.getByTestId('apercu-blog')).toBeVisible()
})

test('la vignette de la scène active porte aria-pressed, les autres non', async ({ page }) => {
  await page.goto('/configurateur')
  await expect(page.getByRole('button', { name: 'Votre site', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('button', { name: 'Dans Google', exact: true })).toHaveAttribute('aria-pressed', 'false')
  await page.getByRole('checkbox', { name: 'Fondations SEO' }).check()
  await expect(page.getByRole('button', { name: 'Votre site', exact: true })).toHaveAttribute('aria-pressed', 'false')
  await expect(page.getByRole('button', { name: 'Dans Google', exact: true })).toHaveAttribute('aria-pressed', 'true')
})

test('ouvrir l’infobulle d’une option de recherche bascule aussi la scène, sans acheter l’option', async ({ page }) => {
  await page.goto('/configurateur')
  await expect(page.getByTestId('apercu-nav')).toBeVisible()
  await page.getByRole('button', { name: 'Que comprend : Fondations SEO' }).click()
  // La scène change, mais rien n'a été acheté : l'extrait ne doit pas apparaître pour autant.
  await expect(page.getByTestId('apercu-recherche-vide')).toBeVisible()
  await expect(page.getByTestId('apercu-seo')).toHaveCount(0)
  await expect(page.getByTestId('apercu-nav')).toHaveCount(0)
  await expect(page.getByRole('checkbox', { name: 'Fondations SEO' })).not.toBeChecked()
})

test('la scène de recherche ne montre l’extrait qu’une fois le référencement acheté', async ({ page }) => {
  await page.goto('/configurateur')
  // Bascule de scène seule, sans toucher la configuration : isole la garde de la scène.
  await page.getByRole('button', { name: 'Dans Google', exact: true }).click()
  await expect(page.getByTestId('apercu-seo')).toHaveCount(0)
  await page.getByRole('checkbox', { name: 'Fondations SEO' }).check()
  await expect(page.getByTestId('apercu-seo')).toBeVisible()
})

test('la scène technique ne montre perf et domaine qu’une fois achetés, chacun indépendamment', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByRole('button', { name: 'Technique', exact: true }).click()
  await expect(page.getByTestId('apercu-perf')).toHaveCount(0)
  await expect(page.getByTestId('apercu-domaine')).toHaveCount(0)
  await page.getByRole('checkbox', { name: 'Domaine et e-mails professionnels' }).check()
  await expect(page.getByTestId('apercu-domaine')).toBeVisible()
  await expect(page.getByTestId('apercu-perf')).toHaveCount(0)
})

test('le référencement local affiche une fiche d’établissement, sans contredire le SEO', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByRole('button', { name: 'Dans Google', exact: true }).click()
  await expect(page.getByTestId('apercu-recherche-vide')).toBeVisible()
  await page.getByRole('checkbox', { name: 'Référencement local' }).check()
  await expect(page.getByTestId('apercu-seo-local')).toContainText('Bègles')
  await expect(page.getByTestId('apercu-recherche-vide')).toHaveCount(0)
})

test('la migration affiche la redirection des adresses de l’ancien site', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByRole('button', { name: 'Technique', exact: true }).click()
  await expect(page.getByTestId('apercu-technique-vide')).toBeVisible()
  await page.getByRole('checkbox', { name: 'Migration de votre site actuel' }).check()
  await expect(page.getByTestId('apercu-migration')).toContainText('redirigées')
  await expect(page.getByTestId('apercu-technique-vide')).toHaveCount(0)
})

test('le RGPD affiche une bannière de consentement dans la scène conformité', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByRole('button', { name: 'Conformité', exact: true }).click()
  await expect(page.getByTestId('apercu-rgpd')).toHaveCount(0)
  await page.getByRole('checkbox', { name: 'Conformité RGPD' }).check()
  await expect(page.getByTestId('apercu-rgpd')).toBeVisible()
})

test('les mentions légales affichent une ligne de pied de page', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByRole('button', { name: 'Conformité', exact: true }).click()
  await expect(page.getByTestId('apercu-legal')).toHaveCount(0)
  await page.getByRole('checkbox', { name: 'Mentions légales et CGV' }).check()
  await expect(page.getByTestId('apercu-legal')).toContainText('Mentions légales')
})

test('la vignette « Déroulé » atteint la scène de planification sans rien cocher', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByRole('button', { name: 'Déroulé', exact: true }).click()
  await expect(page.getByTestId('apercu-planning')).toBeVisible()
  await expect(page.getByTestId('apercu-nav')).toHaveCount(0)
})

test('la scène « Au quotidien » propose un repli sans rien cocher, puis la carte de l’auto-gestion', async ({ page }) => {
  // Le défaut « essentiel » ne s’applique qu’en l’absence de configuration dans l’URL.
  await page.goto('/configurateur?blog')
  await page.getByRole('button', { name: 'Au quotidien', exact: true }).click()
  await expect(page.getByTestId('apercu-exploitation-vide')).toBeVisible()
  await expect(page.getByTestId('carte-etat')).toHaveCount(0)
  await page.getByRole('radio', { name: 'Je m’en occupe moi-même' }).check()
  await expect(page.getByTestId('carte-etat')).toContainText('Vous gardez la main')
  await expect(page.getByTestId('apercu-exploitation-vide')).toHaveCount(0)
})

test('chaque section du panneau est introduite par une phrase', async ({ page }) => {
  await page.goto('/configurateur')
  await expect(page.getByText('Le point de départ.', { exact: false })).toBeVisible()
  await expect(page.getByText('quelqu’un doit s’en occuper', { exact: false })).toBeVisible()
})

test('le configurateur occupe la largeur de l’écran', async ({ page }) => {
  await page.setViewportSize({ width: 1850, height: 1000 })
  await page.goto('/configurateur')
  const grille = await page.getByTestId('grille-configurateur').boundingBox()
  expect(grille!.width).toBeGreaterThan(1500)
})

test('l’aperçu occupe nettement plus de place que le panneau', async ({ page }) => {
  await page.setViewportSize({ width: 1850, height: 1000 })
  await page.goto('/configurateur')
  const apercu = await page.getByTestId('colonne-apercu').boundingBox()
  const panneau = await page.getByTestId('colonne-options').boundingBox()
  expect(apercu!.width).toBeGreaterThan(panneau!.width * 2)
})

test('le dock des sections d’accueil n’apparaît pas sur le configurateur', async ({ page }) => {
  await page.goto('/configurateur')
  await expect(page.getByRole('navigation', { name: 'Sections de la page' })).toHaveCount(0)
  await expect(page.getByRole('link', { name: 'Revenir à l’accueil' })).toBeVisible()
})

test('aucune adresse n’est demandée avant d’avoir vu le prix', async ({ page }) => {
  await page.goto('/configurateur')
  await expect(page.getByTestId('fourchette')).toBeVisible()
  // includeHidden : par défaut getByRole ignore un popover fermé, un textbox absent le passerait aussi.
  const email = page.getByRole('textbox', { name: /adresse e-mail/i, includeHidden: true })
  await expect(email).toBeAttached()
  await expect(email).toBeHidden()
})

test('le récapitulatif n’affiche jamais de montant en euros pour une majoration en pourcentage', async ({ page }) => {
  await page.goto('/configurateur?express')
  await page.getByRole('button', { name: 'Recevoir le récapitulatif' }).click()
  const recap = page.getByTestId('recapitulatif')
  await expect(recap).toContainText('+30 %')
  await expect(recap).not.toContainText('30 €')
})

test('le récapitulatif multiplie le prix d’une option quantifiable par sa quantité', async ({ page }) => {
  await page.goto('/configurateur?pages=3')
  await page.getByRole('button', { name: 'Recevoir le récapitulatif' }).click()
  const recap = page.getByTestId('recapitulatif')
  await expect(recap).toContainText('1 800 €')
  await expect(recap).not.toContainText('600 €')
})

test('le récapitulatif liste les options retenues', async ({ page }) => {
  await page.goto('/configurateur?blog&seo')
  await page.getByRole('button', { name: 'Recevoir le récapitulatif' }).click()
  const recap = page.getByTestId('recapitulatif')
  await expect(recap).toContainText('Un blog')
  await expect(recap).toContainText('Fondations SEO')
})

test('le récapitulatif demande une adresse et un consentement', async ({ page }) => {
  await page.goto('/configurateur?blog')
  await page.getByRole('button', { name: 'Recevoir le récapitulatif' }).click()
  await expect(page.getByRole('textbox', { name: /adresse e-mail/i })).toBeVisible()
  await expect(page.getByRole('checkbox', { name: /j’accepte/i })).toBeVisible()
})

test('le bloc Prix de l’accueil mène au configurateur', async ({ page }) => {
  await page.goto('/')
  await page.locator('#prix').scrollIntoViewIfNeeded()
  await page.getByRole('link', { name: /configurer votre site/i }).click()
  await expect(page).toHaveURL(/\/configurateur/)
})

test('le configurateur est utilisable au clavier seul', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByRole('checkbox', { name: 'Un blog' }).focus()
  await page.keyboard.press('Space')
  await expect(page.getByRole('checkbox', { name: 'Un blog' })).toBeChecked()
})

test('la formule Essentiel est retenue par défaut', async ({ page }) => {
  await page.goto('/configurateur')
  await expect(page.getByRole('radio', { name: 'Essentiel' })).toBeChecked()
  await expect(page.getByTestId('mensuel')).toContainText('90')
})

test('le suivi mensuel se refuse sans quitter la page', async ({ page }) => {
  await page.goto('/configurateur')
  // Le défaut est déjà à 90 € : sans ce constat, décocher ne prouverait rien, le compteur partirait déjà de 0.
  await expect(page.getByTestId('mensuel')).toContainText('90')
  await page.getByRole('radio', { name: 'Je m’en occupe moi-même' }).check()
  await expect(page.getByTestId('mensuel')).toContainText('0 €')
})

test('une URL explicite prime sur le défaut', async ({ page }) => {
  await page.goto('/configurateur?blog')
  await expect(page.getByRole('radio', { name: 'Essentiel' })).not.toBeChecked()
})

test('le bouton de partage copie l’adresse de la configuration', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/configurateur?blog')
  await page.getByRole('button', { name: 'Copier le lien' }).click()
  const copie = await page.evaluate(() => navigator.clipboard.readText())
  expect(copie).toContain('blog')
})

test('la page dit ce qui n’est jamais inclus', async ({ page }) => {
  await page.goto('/configurateur')
  const bloc = page.getByTestId('jamais-inclus')
  await expect(bloc).toContainText('photographie')
  await expect(bloc).toContainText('logo')
})

// Options sans traduction visuelle dans l’aperçu aujourd’hui, chacune pour une raison précise.
const SANS_RENDU = new Set([
  SOCLE_ID, // acquis d’office, aucun contrôle à cocher
  'redaction', 'reprise', 'photos', 'visuels', // le contenu réel n’est pas simulé, le gabarit reste fixe
  'formulaire', 'newsletter', 'paiement', // aucune traduction dans la scène « site » aujourd’hui
  'article', // se lit sur le blog publié, pas dans cet aperçu
  'a11y', // le ratio s’affiche dès la scène conformité, indépendamment de l’achat
  'cadrage', 'formation', 'express', // scène planning : texte fixe, rien ne s’y voit par construction
])

test('basculer sur sa scène et cocher une option change l’aperçu, pour tout le catalogue', async ({ page }) => {
  for (const option of OPTIONS.filter((o) => !SANS_RENDU.has(o.id))) {
    await page.goto(option.id === 'essentiel' ? '/configurateur?blog' : '/configurateur')

    const scene = sceneDeOption(option.id)
    const libelleScene = SCENES.find((s) => s.id === scene)!.libelle
    await page.getByRole('button', { name: libelleScene, exact: true }).click()

    // Le ratio de contraste se mesure de façon asynchrone : on le laisse se poser avant
    // de figer l’état « avant », sinon son apparition seule fausserait le constat.
    if (scene === 'conformite') await expect(page.getByTestId('apercu-a11y')).toBeVisible()

    const avant = await page.getByTestId('apercu').innerHTML()

    const exclusif = GROUPES.find((g) => g.id === option.groupe)?.exclusif === true
    if (option.quantifiable) {
      await page.getByRole('button', { name: `Ajouter : ${option.libelle}` }).click()
    } else if (exclusif) {
      await page.getByRole('radio', { name: option.libelle }).check()
    } else {
      await page.getByRole('checkbox', { name: option.libelle }).check()
    }

    const apres = await page.getByTestId('apercu').innerHTML()
    expect(apres, `« ${option.libelle} » ne change rien dans l’aperçu`).not.toBe(avant)
  }
})
