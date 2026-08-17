import { describe, expect, it } from 'vitest'
import { composite, contrastRatio, parseColor } from '@/lib/color/contrast'
import { readTokens } from './tokens'

const dark = readTokens('app/globals.css', '@theme')
const light = readTokens('app/globals.css', "[data-theme='light']")

function solid(name: string) {
  return parseColor(light[name]).rgb
}

function surfaceOverCanvas(name: string) {
  const { rgb, alpha } = parseColor(light[name])
  return composite(rgb, alpha, solid('--color-canvas'))
}

describe('jetons du thème clair', () => {
  it('redéfinit exactement les mêmes jetons de couleur que le sombre', () => {
    const darkColors = Object.keys(dark).filter((k) => k.startsWith('--color-')).sort()
    const lightColors = Object.keys(light).filter((k) => k.startsWith('--color-')).sort()
    expect(lightColors).toEqual(darkColors)
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
})
