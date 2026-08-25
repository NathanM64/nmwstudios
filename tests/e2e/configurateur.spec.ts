import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import { contrastRatio, parseColor } from '../../lib/color/contrast'
import { GROUPES, SOCLE_ID, optionParId } from '../../lib/config/catalogue'
import { formaterEuros } from '../../lib/config/devis'
import { SUSPENSION_MS } from '../../components/config/PanneauOptions'
import { amenerLaPartie, dansLaFenetre } from './fenetre'

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

test('la barre affiche le prix et le mensuel ensemble', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByRole('radio', { name: 'Essentiel' }).check()
  await expect(page.getByTestId('prix')).toContainText('€')
  await expect(page.getByTestId('mensuel')).toContainText('90')
})

test('le prix monte quand on ajoute une option', async ({ page }) => {
  await page.goto('/configurateur')
  const lirePrix = async () =>
    Number(((await page.getByTestId('prix').textContent()) ?? '').replace(/\D/g, ''))

  const avant = await lirePrix()
  await page.getByRole('checkbox', { name: 'Un blog' }).check()
  // Une régression qui soustrairait ferait aussi « changer » le texte : on compare les nombres.
  await expect.poll(lirePrix).toBe(avant + 700)
})

test('le delta annonce le montant ajouté', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByRole('checkbox', { name: 'Un blog' }).check()
  await expect(page.getByTestId('delta')).toHaveText('+700 €')
})

test('changer de formule récurrente déclenche aussi un delta, sur le mensuel', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByRole('radio', { name: 'Partenaire' }).check()
  await expect(page.getByTestId('delta')).toHaveText('+300 €/mois')
})

test('le prix et le mensuel s’annoncent aux lecteurs d’écran', async ({ page }) => {
  await page.goto('/configurateur')
  await expect(page.getByTestId('prix')).toHaveAttribute('aria-live', 'polite')
  await expect(page.getByTestId('mensuel')).toHaveAttribute('aria-live', 'polite')
})

test('le delta n’est pas annoncé, décoratif et redondant avec le prix', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByRole('checkbox', { name: 'Un blog' }).check()
  await expect(page.getByTestId('delta')).not.toHaveAttribute('aria-live', 'polite')
})

test('ouvrir un lien de configuration partagé n’affiche aucun delta fantôme', async ({ page }) => {
  await page.goto('/configurateur?blog&pages=2')
  await expect(page.getByTestId('delta')).toHaveCount(0)
})

test('la barre reste visible sans défilement', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/configurateur')
  await expect(page.getByTestId('prix')).toBeInViewport()
})

test('l’aperçu montre trois entrées de navigation par défaut', async ({ page }) => {
  await page.goto('/configurateur')
  await expect(page.getByTestId('site-nav').getByRole('listitem')).toHaveCount(3)
})

test('ajouter une tranche de pages enrichit la navigation de l’aperçu', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByRole('button', { name: 'Ajouter : 3 pages de plus' }).click()
  await expect(page.getByTestId('site-nav').getByRole('listitem')).toHaveCount(6)
})

test('cocher le blog fait apparaître la section actualités dans l’aperçu', async ({ page }) => {
  await page.goto('/configurateur')
  await expect(page.getByTestId('site-blog')).toHaveCount(0)
  await page.getByRole('checkbox', { name: 'Un blog' }).check()
  await expect(page.getByTestId('site-blog')).toBeVisible()
})

test('cocher l’espace membre ajoute le bouton de connexion dans l’aperçu', async ({ page }) => {
  await page.goto('/configurateur')
  await expect(page.getByTestId('site-connexion')).toHaveCount(0)
  await page.getByRole('checkbox', { name: 'Espace membre' }).check()
  await expect(page.getByTestId('site-connexion')).toBeVisible()
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

test('le contraste mesuré ne s’affiche que si l’accessibilité est retenue', async ({ page }) => {
  await page.goto('/configurateur')

  const a11y = page.getByRole('checkbox', { name: 'Accessibilité RGAA', exact: true })

  // L'assertion négative vient après une apparition constatée : sans cela, on
  // mesurerait l'absence d'un rendu pas encore arrivé, pas celle de la condition.
  await a11y.check()
  await expect(page.getByTestId('apercu-a11y')).toBeVisible()

  await a11y.uncheck()
  await expect(page.getByTestId('apercu-a11y')).toHaveCount(0)
})

test('le SEO affiche l’extrait de résultat de recherche', async ({ page }) => {
  await page.goto('/configurateur')
  await expect(page.getByTestId('preuve-serp')).toHaveCount(0)
  await page.getByRole('checkbox', { name: 'Fondations SEO' }).check()
  await expect(page.getByTestId('preuve-serp')).toBeVisible()
})

test('la langue supplémentaire ajoute un sélecteur qui bascule l’aperçu', async ({ page }) => {
  await page.goto('/configurateur')
  await expect(page.getByTestId('site-langue')).toHaveCount(0)
  await page.getByRole('button', { name: 'Ajouter : Une langue de plus' }).click()
  await expect(page.getByTestId('site-langue')).toBeVisible()
  await page.getByTestId('site-langue').selectOption('en')
  await expect(page.getByTestId('site-nav')).toContainText('Home')
})

test('la formule récurrente peuple la bande mensuelle', async ({ page }) => {
  await page.goto('/configurateur')
  // La bande existe toujours, montée avec le reste du document : c'est son contenu qui
  // dépend de la formule, et « 4 h » n'appartient qu'à Sérénité et au-dessus.
  await expect(page.getByTestId('deroule-mois')).not.toContainText('4 h')
  await page.getByRole('radio', { name: 'Sérénité' }).check()
  await expect(page.getByTestId('deroule-mois')).toContainText('4 h')
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

test('un lien partagé plafonne une quantité au-delà du maximum de l’option', async ({ page }) => {
  await page.goto('/configurateur?pages=99')
  await expect(page.getByTestId('quantite-pages')).toHaveText('4')
  await page.goto('/configurateur?redaction=999')
  await expect(page.getByTestId('quantite-redaction')).toHaveText('15')
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

test('le configurateur précharge ses polices dans le <head>, pas ailleurs dans le flux', async ({ request }) => {
  const html = await (await request.get('/configurateur')).text()
  // Le bug d'origine émettait le préchargement dans le flux : on isole le <head> pour ne pas le manquer.
  const tete = /<head[^>]*>([\s\S]*?)<\/head>/i.exec(html)?.[1] ?? ''
  expect(tete).toContain('as="font"')
})

test('le compteur dit ce qu’on incrémente', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByRole('button', { name: 'Ajouter : J’écris vos textes' }).click()
  await expect(page.getByTestId('unite-redaction')).toHaveText('page')
  await page.getByRole('button', { name: 'Ajouter : J’écris vos textes' }).click()
  await expect(page.getByTestId('unite-redaction')).toHaveText('pages')
})

test('le compteur de quantité s’annonce aux lecteurs d’écran', async ({ page }) => {
  await page.goto('/configurateur')
  await expect(page.getByTestId('quantite-pages')).toHaveAttribute('aria-live', 'polite')
})

test('l’aperçu reste visible quand on fait défiler les options', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/configurateur')
  await page.getByRole('radio', { name: 'Partenaire' }).scrollIntoViewIfNeeded()
  // Le repère est la fenêtre elle-même, pas un artefact de scène : défiler jusqu'au suivi
  // mensuel sort la navigation du site de la fenêtre sans la retirer du DOM.
  await expect(page.getByTestId('objet-scene')).toBeInViewport()
})

test('cocher le référencement bascule l’aperçu sur « La preuve »', async ({ page }) => {
  await page.goto('/configurateur')
  await expect(page.getByTestId('site-nav')).toBeVisible()
  await page.getByRole('checkbox', { name: 'Fondations SEO' }).check()
  await expect(page.getByTestId('preuve-serp')).toBeVisible()
  await expect.poll(() => dansLaFenetre(page, 'site-nav')).toBe(false)
})

test('cocher une option visible garde la scène du site', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByRole('checkbox', { name: 'Un blog' }).check()
  await expect(page.getByTestId('site-blog')).toBeVisible()
  // La page vise l'endroit de l'option, pas la tête de sa partie : `toBeVisible` est vrai en
  // permanence, les trois parties étant montées, c'est la partie qui doit rester dans la fenêtre.
  await expect.poll(() => dansLaFenetre(page, 'partie-site')).toBe(true)
})

test('la scène du site garde tout ce qui a été coché', async ({ page }) => {
  await page.goto('/configurateur')
  await page.getByRole('checkbox', { name: 'Un blog' }).check()
  // Le référencement emmène l'aperçu sur « La preuve » : le sujet est l'aller-retour, et les deux
  // moitiés mordent. Le constat final est la seule garantie de cumul entre groupes du dépôt : une
  // mutation qui retire le blog dès que le SEO est acheté fait tomber ce test par `site-blog`.
  await page.getByRole('checkbox', { name: 'Fondations SEO' }).check()
  // Le retour passe par un défilement, que la suspension du relevé avalerait sans être rejoué.
  await page.waitForTimeout(SUSPENSION_MS + 400)
  await amenerLaPartie(page, 'site')
  expect(await dansLaFenetre(page, 'site-blog'), 'le blog coché avant le SEO a disparu de la scène').toBe(true)
})

test('« La preuve » ne montre l’extrait qu’une fois le référencement acheté', async ({ page }) => {
  await page.goto('/configurateur')
  await expect(page.getByTestId('preuve-serp')).toHaveCount(0)
  await page.getByRole('checkbox', { name: 'Fondations SEO' }).check()
  await expect(page.getByTestId('preuve-serp')).toBeVisible()
})

test('« La preuve » ne montre la vitesse et le domaine qu’une fois achetés, chacun indépendamment', async ({ page }) => {
  await page.goto('/configurateur')
  await expect(page.getByTestId('preuve-cascade')).toHaveCount(0)
  await expect(page.getByTestId('preuve-domaine')).toHaveCount(0)
  await page.getByRole('checkbox', { name: 'Domaine et e-mails professionnels' }).check()
  await expect(page.getByTestId('preuve-domaine')).toBeVisible()
  await expect(page.getByTestId('preuve-cascade')).toHaveCount(0)
})

test('le référencement local affiche une fiche d’établissement, sans contredire le SEO', async ({ page }) => {
  await page.goto('/configurateur')
  const ligne = page.getByTestId('preuve-ligne').filter({ hasText: 'Fiche locale et horaires' })
  await expect(ligne).toHaveAttribute('data-retenu', 'non')
  await page.getByRole('checkbox', { name: 'Référencement local' }).check()
  await expect(ligne).toContainText('Bègles')
  await expect(page.getByTestId('preuve-serp')).toHaveCount(0)
})

test('la migration affiche la redirection des adresses de l’ancien site', async ({ page }) => {
  await page.goto('/configurateur')
  await expect(page.getByTestId('preuve-redirections')).toHaveCount(0)
  await page.getByRole('checkbox', { name: 'Migration de votre site actuel' }).check()
  await expect(page.getByTestId('preuve-redirections')).toContainText('301')
})

test('le RGPD affiche une bannière de consentement dans « La preuve »', async ({ page }) => {
  await page.goto('/configurateur')
  await expect(page.getByTestId('preuve-rgpd')).toHaveCount(0)
  await page.getByRole('checkbox', { name: 'Conformité RGPD' }).check()
  await expect(page.getByTestId('preuve-rgpd')).toBeVisible()
})

test('les mentions légales affichent une ligne de pied de page', async ({ page }) => {
  await page.goto('/configurateur')
  await expect(page.getByTestId('preuve-legal')).toHaveCount(0)
  await page.getByRole('checkbox', { name: 'Mentions légales et CGV' }).check()
  await expect(page.getByTestId('preuve-legal')).toContainText('Mentions légales')
})

test('la scène du déroulé propose un repli sans rien cocher, puis assume l’auto-gestion', async ({ page }) => {
  // Le défaut « essentiel » ne s’applique qu’en l’absence de configuration dans l’URL.
  await page.goto('/configurateur?blog')
  await expect(page.getByTestId('deroule-mois')).toContainText('vous')
  await page.getByRole('radio', { name: 'Essentiel' }).check()
  await expect(page.getByTestId('deroule-evenement')).not.toHaveCount(0)
  await page.getByRole('radio', { name: 'Je m’en occupe moi-même' }).check()
  await expect(page.getByTestId('deroule-evenement')).toHaveCount(0)
  await expect(page.getByTestId('deroule-mois')).toContainText('vous')
})

test('chaque section du panneau est introduite par une phrase', async ({ page }) => {
  await page.goto('/configurateur')
  for (const groupe of GROUPES) {
    await expect(page.getByText(groupe.intro, { exact: false })).toBeVisible()
  }
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

test('aucune adresse n’est jamais demandée, le récapitulatif s’envoie par la messagerie du visiteur', async ({ page }) => {
  await page.goto('/configurateur')
  await expect(page.getByTestId('prix')).toBeVisible()
  // .first() : le récapitulatif final de fin de panneau reprend aussi ce bouton.
  await page.getByRole('button', { name: 'Recevoir le récapitulatif' }).first().click()
  await expect(page.getByRole('textbox', { name: /adresse e-mail/i })).toHaveCount(0)
  await expect(page.getByRole('checkbox', { name: /j’accepte/i })).toHaveCount(0)
})

test('le récapitulatif n’affiche jamais de montant en euros pour une majoration en pourcentage', async ({ page }) => {
  await page.goto('/configurateur?express')
  await page.getByRole('button', { name: 'Recevoir le récapitulatif' }).first().click()
  const recap = page.getByTestId('recapitulatif')
  await expect(recap).toContainText('+30 %')
  await expect(recap).not.toContainText('30 €')
})

test('le récapitulatif multiplie le prix d’une option quantifiable par sa quantité', async ({ page }) => {
  await page.goto('/configurateur?pages=3')
  await page.getByRole('button', { name: 'Recevoir le récapitulatif' }).first().click()
  const recap = page.getByTestId('recapitulatif')
  await expect(recap).toContainText('1 800 €')
  await expect(recap).not.toContainText('600 €')
})

test('le récapitulatif liste les options retenues, et seulement celles-ci', async ({ page }) => {
  await page.goto('/configurateur?blog&seo')
  await page.getByRole('button', { name: 'Recevoir le récapitulatif' }).first().click()
  const recap = page.getByTestId('recapitulatif')
  await expect(recap).toContainText('Un blog')
  await expect(recap).toContainText('Fondations SEO')
  await expect(recap).not.toContainText('Prise de rendez-vous')
})

test('le récapitulatif propose un lien mailto qui reprend la configuration', async ({ page }) => {
  await page.goto('/configurateur?blog')
  await page.getByRole('button', { name: 'Recevoir le récapitulatif' }).first().click()
  const lien = page.getByRole('link', { name: /envoyer par e-mail/i })
  await expect(lien).toBeVisible()
  const href = await lien.getAttribute('href')
  expect(href).toContain('mailto:contact@nmwstudios.com')
  expect(decodeURIComponent(href ?? '')).toContain('blog')
})

test('le bloc Prix de l’accueil mène au configurateur', async ({ page }) => {
  await page.goto('/')
  await page.locator('#prix').scrollIntoViewIfNeeded()
  await page.getByRole('link', { name: /configurer votre site/i }).click()
  await expect(page).toHaveURL(/\/configurateur/)
})

test('le prix socle de l’accueil vient du catalogue, avec la typographie de formaterEuros', async ({ page }) => {
  await page.goto('/')
  const texte = await page.locator('#prix').textContent()
  // .textContent() brut, pas toContainText() : Playwright normalise les espaces et masquerait
  // une régression vers l'espace ordinaire à la place de la fine insécable de formaterEuros.
  expect(texte).toContain(formaterEuros(optionParId(SOCLE_ID)!.prix))
})

test('la page d’accueil reste statique malgré le prix dérivé du catalogue', async () => {
  const manifeste = JSON.parse(readFileSync('.next/prerender-manifest.json', 'utf8'))
  expect(manifeste.routes['/']?.compute).toBe('static')
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
  // .first() : le récapitulatif final de fin de panneau reprend aussi ce bouton.
  await page.getByRole('button', { name: 'Copier le lien' }).first().click()
  const copie = await page.evaluate(() => navigator.clipboard.readText())
  expect(copie).toContain('blog')
})

test('copier le lien affiche une confirmation brève', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/configurateur')
  await page.getByRole('button', { name: 'Copier le lien' }).first().click()
  await expect(page.getByRole('button', { name: 'Lien copié' }).first()).toBeVisible()
})

test('l’échec de la copie est signalé, pas silencieux', async ({ page }) => {
  await page.goto('/configurateur')
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: () => Promise.reject(new Error('refusé')) },
      configurable: true,
    })
  })
  await page.getByRole('button', { name: 'Copier le lien' }).first().click()
  await expect(page.getByRole('button', { name: /échec/i }).first()).toBeVisible()
})

test('la page dit ce qui n’est jamais inclus', async ({ page }) => {
  await page.goto('/configurateur')
  const bloc = page.getByTestId('jamais-inclus')
  await expect(bloc).toContainText('photographie')
  await expect(bloc).toContainText('logo')
})

test('sur grand écran, la page ne défile pas, seul le panneau le fait', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 })
  await page.goto('/configurateur')
  const defilementPage = await page.evaluate(
    () => document.documentElement.scrollHeight > document.documentElement.clientHeight + 1
  )
  expect(defilementPage).toBe(false)

  const panneauDefile = await page
    .getByTestId('colonne-options')
    .evaluate((el) => el.scrollHeight > el.clientHeight + 1)
  expect(panneauDefile).toBe(true)
})

test('l’aperçu remplit la hauteur disponible entre l’en-tête et la barre de prix', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 })
  await page.goto('/configurateur')
  const panneau = (await page.getByTestId('colonne-options').boundingBox())!
  const apercu = (await page.getByTestId('apercu').boundingBox())!
  // Avant correction, `self-start` figeait l’aperçu à sa hauteur minimale plutôt
  // que de suivre la hauteur de la grille, qu’on lit ici sur le panneau voisin.
  expect(apercu.height).toBeGreaterThan(panneau.height * 0.7)
})

test('la molette défile le panneau même quand le curseur est sur l’aperçu', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 })
  await page.goto('/configurateur')
  const panneau = page.getByTestId('colonne-options')
  const avant = await panneau.evaluate((el) => el.scrollTop)

  const boite = (await page.getByTestId('apercu').boundingBox())!
  await page.mouse.move(boite.x + boite.width / 2, boite.y + boite.height / 2)
  await page.mouse.wheel(0, 400)

  await expect.poll(() => panneau.evaluate((el) => el.scrollTop)).toBeGreaterThan(avant)
})

test('la molette sur l’aperçu ne fait pas défiler la page elle-même', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 })
  await page.goto('/configurateur')
  const boite = (await page.getByTestId('apercu').boundingBox())!
  await page.mouse.move(boite.x + boite.width / 2, boite.y + boite.height / 2)
  await page.mouse.wheel(0, 400)
  const scrollPage = await page.evaluate(() => document.documentElement.scrollTop)
  expect(scrollPage).toBe(0)
})

test('la molette directement sur le panneau continue de le faire défiler nativement', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 })
  await page.goto('/configurateur')
  const panneau = page.getByTestId('colonne-options')
  const boite = (await panneau.boundingBox())!
  await page.mouse.move(boite.x + boite.width / 2, boite.y + 10)
  const avant = await panneau.evaluate((el) => el.scrollTop)
  await page.mouse.wheel(0, 400)
  await expect.poll(() => panneau.evaluate((el) => el.scrollTop)).toBeGreaterThan(avant)
})

test('le défilement au clavier fonctionne toujours dans le panneau', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 })
  await page.goto('/configurateur')
  const panneau = page.getByTestId('colonne-options')
  await page.getByRole('checkbox', { name: 'Un blog' }).focus()
  const avant = await panneau.evaluate((el) => el.scrollTop)
  await page.keyboard.press('PageDown')
  await expect.poll(() => panneau.evaluate((el) => el.scrollTop)).toBeGreaterThan(avant)
})

test('en bas du panneau, le récapitulatif final remplace la barre fixe, et l’inverse en haut', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 })
  await page.goto('/configurateur')

  await expect(page.getByTestId('barre-prix')).toBeVisible()
  await expect(page.getByTestId('recapitulatif-final')).not.toBeInViewport()

  await page.getByTestId('recapitulatif-final').scrollIntoViewIfNeeded()
  await expect(page.getByTestId('recapitulatif-final')).toBeInViewport()
  await expect(page.getByTestId('barre-prix')).toBeHidden()
})

test('la barre de prix garde un fond opaque sur grand écran', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 })
  await page.goto('/configurateur')
  const fond = await page.getByTestId('barre-prix').evaluate((el) => getComputedStyle(el).backgroundColor)
  // Fond transparent : `rgba(0, 0, 0, 0)`, alpha à zéro. Le fond opaque du jeton
  // `--color-canvas` a toujours un alpha à 1, quel que soit le thème.
  expect(fond).not.toMatch(/,\s*0\s*\)$/)
})
