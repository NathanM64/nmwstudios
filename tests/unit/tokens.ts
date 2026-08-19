import { readFileSync } from 'node:fs'
import { composite, parseColor, type Rgb } from '@/lib/color/contrast'

function extractBlock(css: string, headerStart: number): Record<string, string> {
  const open = css.indexOf('{', headerStart)
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

/** Extrait les propriétés personnalisées d'un bloc CSS désigné par son en-tête exact. */
export function readTokens(cssPath: string, blockHeader: string): Record<string, string> {
  const css = readFileSync(cssPath, 'utf8')
  const start = css.indexOf(blockHeader)
  if (start === -1) throw new Error(`Bloc introuvable : ${blockHeader}`)
  return extractBlock(css, start)
}

/** Couleur pleine d'un jeton (hex ou rgba, canal alpha ignoré). */
export function solid(tokens: Record<string, string>, name: string): Rgb {
  return parseColor(tokens[name]).rgb
}

/** Pire cas d'ambiance : la couleur `rgba()` de `--ambient` au canal alpha le plus élevé.
 *  Cherche le bloc `blockHeader` qui définit `--ambient` (l'en-tête peut réapparaître sans lui). */
export function worstAmbientColor(cssPath: string, blockHeader: string): { rgb: Rgb; alpha: number } {
  const css = readFileSync(cssPath, 'utf8')
  let searchFrom = 0
  let ambient: string | undefined
  while (true) {
    const start = css.indexOf(blockHeader, searchFrom)
    if (start === -1) break
    const block = extractBlock(css, start)
    if ('--ambient' in block) {
      ambient = block['--ambient']
      break
    }
    searchFrom = start + blockHeader.length
  }
  if (ambient === undefined) throw new Error(`--ambient introuvable dans un bloc ${blockHeader}`)

  const couleurs = [...ambient.matchAll(/rgba\([^)]*\)/g)].map((m) => parseColor(m[0]))
  if (couleurs.length === 0) throw new Error(`aucune couleur rgba() dans --ambient (${blockHeader})`)

  return couleurs.reduce((pire, courante) => (courante.alpha > pire.alpha ? courante : pire))
}

/** Fond de page réellement rendu : le pire cas d'ambiance composé sur le canevas
 *  (`body` pose `background-image: var(--ambient)`, sous tout le texte, panneau ou non). */
export function ambientOverCanvas(tokens: Record<string, string>, ambient: { rgb: Rgb; alpha: number }): Rgb {
  return composite(ambient.rgb, ambient.alpha, solid(tokens, '--color-canvas'))
}

/** Surface composée sur le fond de page (ambiance sur canevas) : la couche réellement rendue sous `.panel`. */
export function surfaceOverCanvas(
  tokens: Record<string, string>,
  surfaceName: string,
  ambient: { rgb: Rgb; alpha: number }
): Rgb {
  const { rgb, alpha } = parseColor(tokens[surfaceName])
  return composite(rgb, alpha, ambientOverCanvas(tokens, ambient))
}

