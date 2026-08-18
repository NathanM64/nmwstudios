import { describe, expect, it } from 'vitest'
import { composite, contrastRatio } from '@/lib/color/contrast'
import { readTokens, solid, surfaceOverCanvas, worstAmbientColor } from './tokens'

const THEMES = [
  { nom: 'sombre', tokens: readTokens('app/globals.css', '@theme'), entete: ':root' },
  { nom: 'clair', tokens: readTokens('app/globals.css', "[data-theme='light']"), entete: "[data-theme='light']" },
] as const

describe('compositions d’états du configurateur', () => {
  for (const { nom, tokens, entete } of THEMES) {
    const ambient = worstAmbientColor('app/globals.css', entete)
    const verre = surfaceOverCanvas(tokens, '--color-surface', ambient)

    it(`tient le libellé sourdine sur le verre en thème ${nom}`, () => {
      expect(contrastRatio(solid(tokens, '--color-muted-foreground'), verre)).toBeGreaterThanOrEqual(4.5)
    })

    it(`tient l’étiquette d’accent sur le verre en thème ${nom}`, () => {
      expect(contrastRatio(solid(tokens, '--color-accent'), verre)).toBeGreaterThanOrEqual(4.5)
    })

    it(`tient le texte du bouton plein sur son accent en thème ${nom}`, () => {
      expect(
        contrastRatio(solid(tokens, '--color-canvas'), solid(tokens, '--color-accent'))
      ).toBeGreaterThanOrEqual(4.5)
    })

    it(`tient le texte sur l’état actif posé sur le verre en thème ${nom}`, () => {
      const actif = composite(solid(tokens, '--color-accent'), 0.2, verre)
      expect(contrastRatio(solid(tokens, '--color-foreground'), actif)).toBeGreaterThanOrEqual(4.5)
    })

    it(`tient l’explication de carte sur l’aplat de surface en thème ${nom}`, () => {
      expect(contrastRatio(solid(tokens, '--color-muted-foreground'), verre)).toBeGreaterThanOrEqual(4.5)
    })

    it(`tient le libellé de carte sur l’état retenu en thème ${nom}`, () => {
      // État retenu à 4 %, pas 10 % : mesuré, voir CarteOption.tsx.
      const retenu = composite(solid(tokens, '--color-accent'), 0.04, verre)
      expect(contrastRatio(solid(tokens, '--color-foreground'), retenu)).toBeGreaterThanOrEqual(4.5)
      expect(contrastRatio(solid(tokens, '--color-muted-foreground'), retenu)).toBeGreaterThanOrEqual(4.5)
    })
  }
})
