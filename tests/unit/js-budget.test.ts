import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { readFirstLoadBytes } from '@/scripts/check-js-budget.mjs'

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
