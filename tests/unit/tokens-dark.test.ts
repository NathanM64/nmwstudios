import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { contrastRatio } from '@/lib/color/contrast'
import { ambientOverCanvas, readTokens, solid, surfaceOverCanvas, worstAmbientColor } from './tokens'

const dark = readTokens('app/globals.css', '@theme')
const ambient = worstAmbientColor('app/globals.css', ':root')
const fondDePage = ambientOverCanvas(dark, ambient)

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
    expect(contrastRatio(solid(dark, '--color-foreground'), fondDePage)).toBeGreaterThanOrEqual(4.5)
  })

  it('tient 4,5:1 pour le texte secondaire sur le fond de page', () => {
    expect(contrastRatio(solid(dark, '--color-muted-foreground'), fondDePage)).toBeGreaterThanOrEqual(4.5)
  })

  it("tient 4,5:1 pour l'accent sur le fond de page", () => {
    expect(contrastRatio(solid(dark, '--color-accent'), fondDePage)).toBeGreaterThanOrEqual(4.5)
  })

  it('tient 4,5:1 pour le texte courant posé sur un panneau de verre', () => {
    expect(
      contrastRatio(solid(dark, '--color-foreground'), surfaceOverCanvas(dark, '--color-surface', ambient))
    ).toBeGreaterThanOrEqual(4.5)
  })

  it('tient 4,5:1 pour le texte secondaire posé sur un panneau de verre', () => {
    expect(
      contrastRatio(solid(dark, '--color-muted-foreground'), surfaceOverCanvas(dark, '--color-surface', ambient))
    ).toBeGreaterThanOrEqual(4.5)
  })

  it("tient 4,5:1 pour l'accent posé sur un panneau de verre", () => {
    expect(
      contrastRatio(solid(dark, '--color-accent'), surfaceOverCanvas(dark, '--color-surface', ambient))
    ).toBeGreaterThanOrEqual(4.5)
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
