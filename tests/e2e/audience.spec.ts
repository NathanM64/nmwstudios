import { expect, test } from '@playwright/test'

test('le commutateur navigue vers la porte agence', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Agence' }).click()
  await expect(page).toHaveURL('/agences')
  await expect(page.getByRole('link', { name: 'Agence' })).toHaveAttribute('aria-current', 'page')
})

test('le choix est mémorisé dans un cookie', async ({ page, context }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Agence' }).click()
  const cookie = (await context.cookies()).find((c) => c.name === 'nmw-audience')
  expect(cookie?.value).toBe('agence')
})

test('la porte entreprise rappelle discrètement le choix précédent', async ({ page, context }) => {
  await context.addCookies([
    { name: 'nmw-audience', value: 'agence', domain: '127.0.0.1', path: '/' },
  ])
  await page.goto('/')
  await expect(page).toHaveURL('/')
  await expect(page.getByRole('link', { name: /revenir à la version agence/i })).toBeVisible()
})

test('les deux portes portent le dock', async ({ page }) => {
  for (const url of ['/', '/agences']) {
    await page.goto(url)
    await expect(page.getByRole('navigation', { name: 'Sections de la page' })).toBeVisible()
  }
})
