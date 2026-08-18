import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'

/** Scripts réellement injectés dans une page prérendue, hors `noModule` que les navigateurs modernes ignorent. */
export function readFirstLoadBytes(htmlPath, staticRoot) {
  const html = readFileSync(htmlPath, 'utf8')

  const sources = [...html.matchAll(/<script\b([^>]*)>/g)]
    .map(([, attributs]) => attributs)
    .filter((attributs) => !/nomodule/i.test(attributs))
    .map((attributs) => /src="(\/_next\/[^"]+\.js)"/.exec(attributs)?.[1])
    .filter(Boolean)

  const uniques = [...new Set(sources)]
  if (uniques.length === 0) {
    throw new Error(`Aucun script trouvé dans ${htmlPath} — le format du rendu a changé.`)
  }

  return uniques.reduce(
    (total, src) => total + gzipSync(readFileSync(join(staticRoot, src.replace('/_next', '')))).byteLength,
    0
  )
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const octets = readFirstLoadBytes('.next/server/app/agences.html', '.next')
  console.log(`JavaScript de première charge : ${(octets / 1024).toFixed(1)} ko gzip, hors polyfills noModule`)
}
