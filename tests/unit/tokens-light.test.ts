import { describe, expect, it } from 'vitest'
import { contrastRatio } from '@/lib/color/contrast'
import { readTokens, solid, surfaceOverCanvas, worstAmbientColor } from './tokens'

const dark = readTokens('app/globals.css', '@theme')
const light = readTokens('app/globals.css', "[data-theme='light']")
const ambient = worstAmbientColor('app/globals.css', "[data-theme='light']")

describe('jetons du thème clair', () => {
  it('redéfinit exactement les mêmes jetons de couleur que le sombre', () => {
    const darkColors = Object.keys(dark).filter((k) => k.startsWith('--color-')).sort()
    const lightColors = Object.keys(light).filter((k) => k.startsWith('--color-')).sort()
    expect(lightColors).toEqual(darkColors)
  })

  it('tient 4,5:1 pour le texte courant sur le fond de page', () => {
    expect(contrastRatio(solid(light, '--color-foreground'), solid(light, '--color-canvas'))).toBeGreaterThanOrEqual(4.5)
  })

  it('tient 4,5:1 pour le texte secondaire sur le fond de page', () => {
    expect(
      contrastRatio(solid(light, '--color-muted-foreground'), solid(light, '--color-canvas'))
    ).toBeGreaterThanOrEqual(4.5)
  })

  it('tient 4,5:1 pour le texte courant posé sur un panneau de verre', () => {
    expect(
      contrastRatio(solid(light, '--color-foreground'), surfaceOverCanvas(light, '--color-surface', ambient))
    ).toBeGreaterThanOrEqual(4.5)
  })

  it('tient 4,5:1 pour le texte secondaire posé sur un panneau de verre', () => {
    expect(
      contrastRatio(solid(light, '--color-muted-foreground'), surfaceOverCanvas(light, '--color-surface', ambient))
    ).toBeGreaterThanOrEqual(4.5)
  })

  it("tient 4,5:1 pour l'accent posé sur un panneau de verre", () => {
    expect(
      contrastRatio(solid(light, '--color-accent'), surfaceOverCanvas(light, '--color-surface', ambient))
    ).toBeGreaterThanOrEqual(4.5)
  })
})
