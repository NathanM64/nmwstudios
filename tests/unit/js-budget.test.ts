import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { listerRoutesPrerendues, readFirstLoadBytes } from '@/scripts/check-js-budget.mjs'

function fixture(html: string, fichiers: Record<string, string>) {
  const racine = mkdtempSync(join(tmpdir(), 'poids-'))
  mkdirSync(join(racine, 'static', 'chunks'), { recursive: true })
  for (const [nom, code] of Object.entries(fichiers)) {
    writeFileSync(join(racine, 'static', 'chunks', nom), code)
  }
  writeFileSync(join(racine, 'page.html'), html)
  return racine
}

function balise(nom: string, attributs: string) {
  return `<script src="/_next/static/chunks/${nom}" ${attributs}></script>`
}

describe('readFirstLoadBytes', () => {
  it('mesure la taille gzip des scripts injectés', () => {
    const code = 'console.log("bonjour")'
    const racine = fixture(balise('a.js', 'async=""'), { 'a.js': code })
    expect(readFirstLoadBytes(join(racine, 'page.html'), racine)).toBe(
      gzipSync(Buffer.from(code)).byteLength
    )
  })

  it('exclut le noModule et ne compte que le script éligible qui l’accompagne', () => {
    const polyfills = `const inutile = "${'x'.repeat(4000)}"`
    const charge = 'console.log("bonjour")'
    const racine = fixture(balise('poly.js', 'noModule=""') + balise('b.js', 'async="" crossorigin=""'), {
      'poly.js': polyfills,
      'b.js': charge,
    })

    expect(readFirstLoadBytes(join(racine, 'page.html'), racine)).toBe(
      gzipSync(Buffer.from(charge)).byteLength
    )
  })

  it('échoue bruyamment si le format du rendu a changé', () => {
    const racine = fixture('<p>rien</p>', { 'a.js': 'x' })
    expect(() => readFirstLoadBytes(join(racine, 'page.html'), racine)).toThrow(/aucun script/i)
  })
})

function dossierDeRoutes(noms: string[]) {
  const appDir = join(mkdtempSync(join(tmpdir(), 'routes-')), 'app')
  mkdirSync(appDir, { recursive: true })
  for (const nom of noms) writeFileSync(join(appDir, nom), '')
  return appDir
}

describe('listerRoutesPrerendues', () => {
  it('associe chaque page HTML statique à sa route, index.html devenant /', () => {
    const appDir = dossierDeRoutes(['index.html', 'agences.html', 'configurateur.html'])
    expect(listerRoutesPrerendues(appDir).map((r) => r.route)).toEqual(['/', '/agences', '/configurateur'])
  })

  it('exclut les routes internes de Next, préfixées par un tiret bas', () => {
    const appDir = dossierDeRoutes(['agences.html', '_not-found.html', '_global-error.html'])
    expect(listerRoutesPrerendues(appDir).map((r) => r.route)).toEqual(['/agences'])
  })

  it('ignore les fichiers non HTML voisins des pages', () => {
    const appDir = dossierDeRoutes(['agences.html', 'agences.meta', 'agences.rsc', 'agences.segments'])
    expect(listerRoutesPrerendues(appDir).map((r) => r.route)).toEqual(['/agences'])
  })
})
