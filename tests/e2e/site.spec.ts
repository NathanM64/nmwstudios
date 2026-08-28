import { expect, test } from '@playwright/test'

const PAGES = ['/', '/renfort/', '/projet-complet/', '/reprise-et-maintenance/', '/mentions-legales/']

// Le site ne vend plus l'absence de tiers au lecteur, mais les mentions légales l'affirment
// et la CSP du Caddyfile l'impose. Une dépendance ajoutée casserait les deux sans bruit.
test('aucune requête tierce, aucun cookie', async ({ page, context }) => {
  const externes: string[] = []
  page.on('request', (requete) => {
    const url = new URL(requete.url())
    if (url.hostname !== '127.0.0.1' && url.hostname !== 'localhost' && url.protocol !== 'data:') externes.push(requete.url())
  })

  for (const chemin of PAGES) {
    await page.goto(chemin, { waitUntil: 'networkidle' })
  }

  expect(externes).toEqual([])
  expect(await context.cookies()).toEqual([])
})

// Une mesure d'audience hébergée sur le même domaine ne serait ni une requête tierce ni un
// cookie : le filet du dessus ne la verrait pas, et les mentions légales deviendraient fausses
// en silence. Celui-ci la voit. S'il casse, c'est le paragraphe « Données personnelles » qu'il
// faut réécrire, pas le test.
test('aucun script hors du paquet Next', async ({ page }) => {
  await page.goto('/', { waitUntil: 'load' })

  const chemins = await page.evaluate(() =>
    [...document.querySelectorAll('script[src]')].map(
      (balise) => new URL((balise as HTMLScriptElement).src).pathname,
    ),
  )

  expect(chemins.length).toBeGreaterThan(0)
  for (const chemin of chemins) expect(chemin).toMatch(/^\/_next\/static\//)
})

// Rejoué depuis la refonte précédente : les variables next/font se posent sur <html>, et
// sur <body> la police n’était jamais appliquée sans que rien ne le signale. Le test lit la
// famille calculée puis la donne à document.fonts.check : next/font renomme les familles.
test('les polices du site sont réellement appliquées', async ({ page }) => {
  await page.goto('/')

  const polices = await page.evaluate(async () => {
    await document.fonts.ready
    const premiere = (liste: string) => liste.split(',')[0].trim().replace(/^["']|["']$/g, '')
    const titre = premiere(getComputedStyle(document.querySelector('h1')!).fontFamily)
    const corps = premiere(getComputedStyle(document.body).fontFamily)
    return {
      titre,
      corps,
      titreCharge: document.fonts.check(`700 32px "${titre}"`),
      corpsCharge: document.fonts.check(`16px "${corps}"`),
    }
  })

  expect(polices.titre).toContain('Schibsted')
  expect(polices.corps).toContain('Hanken')
  expect(polices.titreCharge).toBe(true)
  expect(polices.corpsCharge).toBe(true)
})

test('les deux pages se répondent', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText("n’ont pas d’équipe")

  await page.getByRole('link', { name: 'Reprise et maintenance', exact: true }).first().click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('tout est à refaire')
})

// Les trois renvois de la section « références » pointent vers des ancres de l'autre page :
// un identifiant renommé les casse en silence.
test('les ancres visées depuis l’accueil existent', async ({ page }) => {
  await page.goto('/')
  const ancres = await page
    .locator('a[href*="/reprise-et-maintenance/#"]')
    .evaluateAll((liens) => liens.map((l) => (l as HTMLAnchorElement).hash.slice(1)))
  expect(ancres.length).toBeGreaterThan(0)

  await page.goto('/reprise-et-maintenance/')
  for (const ancre of ancres) {
    await expect(page.locator(`#${ancre}`)).toHaveCount(1)
  }
})

// La canonique du layout vaut '/' pour tout le monde : une page ajoutée qui oublie de la
// reposer se déclare copie de l'accueil, et og:url part avec elle. Rien ne le signalerait.
test('chaque page se déclare à sa propre adresse', async ({ page }) => {
  for (const chemin of PAGES) {
    await page.goto(chemin)
    const tetes = await page.evaluate(() => ({
      canonique: document.querySelector('link[rel=canonical]')?.getAttribute('href'),
      ogUrl: document.querySelector('meta[property="og:url"]')?.getAttribute('content'),
      schemas: [...document.querySelectorAll('script[type="application/ld+json"]')].map(
        (balise) => balise.textContent ?? '',
      ),
    }))

    expect(tetes.canonique, chemin).toBe(`https://nmwstudios.com${chemin}`)
    expect(tetes.ogUrl, chemin).toBe(tetes.canonique)
    expect(tetes.schemas.length, chemin).toBeGreaterThan(0)
    for (const schema of tetes.schemas) expect(() => JSON.parse(schema)).not.toThrow()
  }
})

// Le formulaire est le seul chemin de conversion du site depuis qu'il remplace le mailto
// seul. Une charge utile mal formée ou une erreur avalée ne se verrait nulle part ailleurs.
test('le formulaire poste ce qu’il faut et dit ce qui se passe', async ({ page }) => {
  await page.goto('/')

  let charge: Record<string, string> | null = null
  await page.route('**/api/contact', async (route) => {
    charge = route.request().postDataJSON()
    await route.fulfill({ status: 204 })
  })

  await page.getByLabel('Votre nom').fill('Agence Truc')
  await page.getByLabel('Votre adresse').fill('directeur@agence.fr')
  await page.getByLabel('Ce que vous avez sur les bras').fill('Un Symfony 4 que personne ne veut.')
  await page.getByRole('button', { name: 'Envoyer' }).click()

  await expect(page.getByRole('status')).toContainText('C’est parti')
  expect(charge).toEqual({
    nom: 'Agence Truc',
    email: 'directeur@agence.fr',
    message: 'Un Symfony 4 que personne ne veut.',
    piege: '',
  })
})

// Un envoi qui échoue doit laisser une porte de sortie, pas un formulaire muet.
test('un échec d’envoi renvoie vers l’adresse mail', async ({ page }) => {
  await page.goto('/')
  await page.route('**/api/contact', (route) => route.fulfill({ status: 502, json: {} }))

  await page.getByLabel('Votre nom').fill('A')
  await page.getByLabel('Votre adresse').fill('a@b.fr')
  await page.getByLabel('Ce que vous avez sur les bras').fill('Bonjour')
  await page.getByRole('button', { name: 'Envoyer' }).click()

  // Restreint au bloc contact : Next pose son propre role="alert" pour annoncer les routes.
  await expect(page.locator('#contact').getByRole('alert')).toContainText('contact@nmwstudios.com')
})
