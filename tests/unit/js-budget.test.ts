import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { readFirstLoadBytes } from '@/scripts/check-js-budget.mjs'

function fixture(contents: string) {
  const root = mkdtempSync(join(tmpdir(), 'budget-'))
  const staticDir = join(root, 'static', 'chunks')
  mkdirSync(staticDir, { recursive: true })
  writeFileSync(join(staticDir, 'a.js'), contents)
  writeFileSync(
    join(root, 'app-build-manifest.json'),
    JSON.stringify({ pages: { '/page': ['static/chunks/a.js'] } })
  )
  return root
}

describe('readFirstLoadBytes', () => {
  it('mesure la taille gzip des fichiers de la route', () => {
    const root = fixture('console.log("bonjour")')
    const expected = gzipSync(Buffer.from('console.log("bonjour")')).byteLength
    expect(readFirstLoadBytes(join(root, 'app-build-manifest.json'), root, '/page')).toBe(expected)
  })

  it('échoue bruyamment si la route est absente du manifeste', () => {
    const root = fixture('const x = 1')
    expect(() => readFirstLoadBytes(join(root, 'app-build-manifest.json'), root, '/inconnue')).toThrow(
      /route absente du manifeste/i
    )
  })
})
