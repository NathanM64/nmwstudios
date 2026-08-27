import { expect, test } from '@playwright/test'

const PAGES = ['/', '/reprise-et-maintenance/', '/mentions-legales/']

// Le site affiche qu'il ne charge rien d'ailleurs et ne suit personne. Un filet le vérifie,
// parce que c'est le genre de promesse qu'une dépendance ajoutée casse sans bruit.
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

  // Le relevé affiche ce compte au lecteur : une ressource ajoutée doit le faire mentir ici
  // avant de le faire mentir en production. Les URI data: ont déjà été comptées pour un tiers.
  await page.goto('/', { waitUntil: 'load' })
  const releve = page.getByRole('definition')
  await expect(releve).toHaveCount(2)
  await expect(releve.first()).toHaveText('0')
  await expect(releve.last()).toHaveText('0')
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
