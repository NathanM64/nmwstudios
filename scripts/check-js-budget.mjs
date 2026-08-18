import { readFileSync, readdirSync, realpathSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
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

/** Une route par page HTML statique, `index.html` devenant `/`. Exclut les routes internes de Next (`_not-found`, `_global-error`). */
export function listerRoutesPrerendues(appDir) {
  return readdirSync(appDir)
    .filter((nom) => nom.endsWith('.html') && !nom.startsWith('_'))
    .map((nom) => {
      const base = nom.slice(0, -'.html'.length)
      return { route: base === 'index' ? '/' : `/${base}`, fichier: join(appDir, nom) }
    })
    .sort((a, b) => a.route.localeCompare(b.route))
}

/* Comparer des chemins résolus, jamais des URL : `import.meta.url` percent-encode
   espaces et accents, et la comparaison échouerait sans rien mesurer. */
const lanceEnLigneDeCommande =
  process.argv[1] &&
  realpathSync(fileURLToPath(import.meta.url)) === realpathSync(resolve(process.argv[1]))

if (lanceEnLigneDeCommande) {
  for (const { route, fichier } of listerRoutesPrerendues('.next/server/app')) {
    const octets = readFirstLoadBytes(fichier, '.next')
    console.log(
      `JavaScript de première charge sur ${route} : ${(octets / 1024).toFixed(1)} ko gzip, hors polyfills noModule`
    )
  }
}
