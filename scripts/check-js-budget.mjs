import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'

const BUDGET_BYTES = 30 * 1024

export function readFirstLoadBytes(manifestPath, staticRoot, route = '/page') {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  const files = manifest?.pages?.[route]

  if (!Array.isArray(files)) {
    throw new Error(
      `Route absente du manifeste : ${route}. Routes connues : ${Object.keys(manifest?.pages ?? {}).join(', ')}`
    )
  }

  return files
    .filter((f) => f.endsWith('.js'))
    .reduce((total, f) => total + gzipSync(readFileSync(join(staticRoot, f))).byteLength, 0)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  // Essayer d'abord le format app-build-manifest, sinon builder-manifest
  let bytes = 0
  try {
    bytes = readFirstLoadBytes('.next/app-build-manifest.json', '.next')
  } catch {
    const manifest = JSON.parse(readFileSync('.next/build-manifest.json', 'utf8'))
    const files = manifest?.rootMainFiles ?? []
    bytes = files
      .filter((f) => f.endsWith('.js'))
      .reduce((total, f) => total + gzipSync(readFileSync(join('.next', f))).byteLength, 0)
  }
  const ko = (bytes / 1024).toFixed(1)

  if (bytes > BUDGET_BYTES) {
    console.error(`✗ Budget dépassé : ${ko} ko gzip sur / (plafond ${BUDGET_BYTES / 1024} ko)`)
    process.exit(1)
  }
  console.log(`✓ ${ko} ko gzip sur / (plafond ${BUDGET_BYTES / 1024} ko)`)
}
