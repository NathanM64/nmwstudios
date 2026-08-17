import { readFileSync } from 'node:fs'

/** Extrait les propriétés personnalisées d'un bloc CSS désigné par son en-tête exact. */
export function readTokens(cssPath: string, blockHeader: string): Record<string, string> {
  const css = readFileSync(cssPath, 'utf8')
  const start = css.indexOf(blockHeader)
  if (start === -1) throw new Error(`Bloc introuvable : ${blockHeader}`)

  const open = css.indexOf('{', start)
  let depth = 0
  let end = open
  for (let i = open; i < css.length; i++) {
    if (css[i] === '{') depth++
    if (css[i] === '}') {
      depth--
      if (depth === 0) {
        end = i
        break
      }
    }
  }

  const body = css.slice(open + 1, end)
  const tokens: Record<string, string> = {}
  for (const [, name, value] of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    tokens[name] = value.trim()
  }
  return tokens
}
