import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { readFirstLoadBytes } from '@/scripts/check-js-budget.mjs'

function fixture(html: string, code: string) {
  const racine = mkdtempSync(join(tmpdir(), 'poids-'))
  mkdirSync(join(racine, 'static', 'chunks'), { recursive: true })
  writeFileSync(join(racine, 'static', 'chunks', 'a.js'), code)
  writeFileSync(join(racine, 'page.html'), html)
  return racine
}

describe('readFirstLoadBytes', () => {
  it('mesure la taille gzip des scripts injectés', () => {
    const code = 'console.log("bonjour")'
    const racine = fixture('<script src="/_next/static/chunks/a.js" async=""></script>', code)
    expect(readFirstLoadBytes(join(racine, 'page.html'), racine)).toBe(
      gzipSync(Buffer.from(code)).byteLength
    )
  })

  it('ignore les scripts noModule, que les navigateurs modernes ne chargent pas', () => {
    const racine = fixture('<script src="/_next/static/chunks/a.js" noModule=""></script>', 'const x = 1')
    expect(() => readFirstLoadBytes(join(racine, 'page.html'), racine)).toThrow(/aucun script/i)
  })

  it('échoue bruyamment si le format du rendu a changé', () => {
    const racine = fixture('<p>rien</p>', 'x')
    expect(() => readFirstLoadBytes(join(racine, 'page.html'), racine)).toThrow(/aucun script/i)
  })
})
