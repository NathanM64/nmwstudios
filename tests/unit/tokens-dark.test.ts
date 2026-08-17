import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { composite, contrastRatio, parseColor } from '@/lib/color/contrast'
import { readTokens } from './tokens'

const dark = readTokens('app/globals.css', '@theme')

function solid(name: string) {
  const { rgb } = parseColor(dark[name])
  return rgb
}

/** Surface translucide aplatie sur le fond de page. */
function surfaceOverCanvas(name: string) {
  const { rgb, alpha } = parseColor(dark[name])
  return composite(rgb, alpha, solid('--color-canvas'))
}

describe('jetons du thème sombre', () => {
  it('définit tous les jetons attendus', () => {
    for (const name of [
      '--color-canvas',
      '--color-surface',
      '--color-surface-raised',
      '--color-foreground',
      '--color-muted-foreground',
      '--color-accent',
      '--color-accent-2',
      '--color-border',
      '--color-border-strong',
    ]) {
      expect(dark[name], `jeton manquant : ${name}`).toBeDefined()
    }
  })

  it('tient 4,5:1 pour le texte courant sur le fond de page', () => {
    expect(contrastRatio(solid('--color-foreground'), solid('--color-canvas'))).toBeGreaterThanOrEqual(4.5)
  })

  it('tient 4,5:1 pour le texte secondaire sur le fond de page', () => {
    expect(contrastRatio(solid('--color-muted-foreground'), solid('--color-canvas'))).toBeGreaterThanOrEqual(4.5)
  })

  it('tient 4,5:1 pour le texte courant posé sur un panneau de verre', () => {
    expect(contrastRatio(solid('--color-foreground'), surfaceOverCanvas('--color-surface'))).toBeGreaterThanOrEqual(4.5)
  })

  it('tient 4,5:1 pour le texte secondaire posé sur un panneau de verre', () => {
    expect(contrastRatio(solid('--color-muted-foreground'), surfaceOverCanvas('--color-surface'))).toBeGreaterThanOrEqual(4.5)
  })

  it("tient 4,5:1 pour l'accent posé sur un panneau de verre", () => {
    expect(contrastRatio(solid('--color-accent'), surfaceOverCanvas('--color-surface'))).toBeGreaterThanOrEqual(4.5)
  })

  it('déclare le flou du verre dans un jeton statique', () => {
    const css = readTokens('app/globals.css', ':root')
    expect(css['--glass']).toMatch(/blur\(28px\)/)
  })

  it("n'anime ni le flou ni aucun filtre", () => {
    const css = readFileSync('app/globals.css', 'utf8')
    const animations = [...css.matchAll(/(transition|animation)(-property|-name)?\s*:\s*([^;]+);/g)]

    for (const [, propriete, , valeur] of animations) {
      expect(valeur, `${propriete} vise un filtre : ${valeur}`).not.toMatch(/filter|\ball\b/)
    }
  })
})
