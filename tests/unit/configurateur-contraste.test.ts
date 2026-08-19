import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { composite, contrastRatio, parseColor } from '@/lib/color/contrast'
import { STYLES } from '@/lib/config/styles'
import { ambientOverCanvas, readTokens, solid, surfaceOverCanvas, worstAmbientColor } from './tokens'

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

    // La légende collante ne pose plus de bande : son titre se lit sur le fond de page lui-même.
    it(`tient le titre de groupe collant sur le fond de page en thème ${nom}`, () => {
      expect(contrastRatio(solid(tokens, '--color-accent'), ambientOverCanvas(tokens, ambient))).toBeGreaterThanOrEqual(4.5)
    })

    it(`tient le libellé de carte sur l’état retenu en thème ${nom}`, () => {
      // État retenu à 4 %, pas 10 % : mesuré, voir CarteOption.tsx.
      const retenu = composite(solid(tokens, '--color-accent'), 0.04, verre)
      expect(contrastRatio(solid(tokens, '--color-foreground'), retenu)).toBeGreaterThanOrEqual(4.5)
      expect(contrastRatio(solid(tokens, '--color-muted-foreground'), retenu)).toBeGreaterThanOrEqual(4.5)
    })

  }
})

// Les jetons ne modélisent pas une opacité écrite dans un composant : c'est par là que la
// ligne non retenue de « La preuve » est passée à 3,5:1 sans faire rougir un seul test.
// La maquette a sa palette propre depuis le 19/08/2026 : le modèle porte sur les trois
// directions, plus sur les jetons du site, que la scène ne lit plus.
describe('opacité posée dans une scène de l’aperçu', () => {
  const source = readFileSync('components/config/scenes/ScenePreuve.tsx', 'utf8')
  const trouve = /retenu \? '[^']*' : 'opacity-(\d+)'/.exec(source)

  it('la ligne non retenue porte une opacité repérable sur le texte courant de la maquette', () => {
    expect(trouve, 'opacité de la ligne non retenue introuvable dans ScenePreuve.tsx').not.toBeNull()
    // Sans cette vérification, le modèle ci-dessous pourrait viser une couleur que la ligne n'utilise plus.
    expect(source).toMatch(/data-retenu[\s\S]{0,800}?m-corps/)
  })

  for (const style of STYLES) {
    it(`tient 4,5:1 pour la ligne non retenue en direction ${style.id}`, () => {
      const fond = parseColor(style.variables['--m-fond']).rgb
      const rendu = composite(parseColor(style.variables['--m-texte']).rgb, Number(trouve![1]) / 100, fond)
      expect(contrastRatio(rendu, fond), style.id).toBeGreaterThanOrEqual(4.5)
    })
  }
})

// Le fond blanc de la légende collante est parti d'une classe, pas d'un jeton : les compositions
// ci-dessus ne l'auraient pas vu revenir.
describe('fond de la légende collante', () => {
  const source = readFileSync('components/config/PanneauOptions.tsx', 'utf8')

  it('la légende ne repose ni sur un aplat de canevas ni sur un flou', () => {
    expect(source).toMatch(/entete-groupe/)
    expect(source, 'aplat de canevas revenu sur la légende').not.toMatch(/bg-canvas/)
    expect(source, 'flou revenu sur la légende').not.toMatch(/backdrop-blur/)
  })
})
