import { describe, expect, it } from 'vitest'
import { contrastRatio, parseColor } from '@/lib/color/contrast'
import { STYLES, STYLE_DEFAUT, styleParId } from '@/lib/config/styles'

const REQUISES = [
  '--m-fond', '--m-fond-2', '--m-texte', '--m-texte-sourd', '--m-accent',
  '--m-accent-contraste', '--m-bord', '--m-titre-famille', '--m-corps-famille',
  '--m-titre-graisse', '--m-titre-taille', '--m-rayon', '--m-densite',
] as const

describe('directions de style', () => {
  it('en déclare exactement trois', () => {
    expect(STYLES.map((s) => s.id)).toEqual(['editorial', 'franc', 'premium'])
  })

  it('donne un libellé non vide à chacune', () => {
    for (const style of STYLES) expect(style.libelle.length).toBeGreaterThan(0)
  })

  it('déclare toutes les variables requises dans chaque style', () => {
    // Une variable manquante ferait retomber la maquette sur une valeur héritée du site,
    // donc un rendu incohérent plutôt qu'une erreur visible.
    for (const style of STYLES) {
      for (const nom of REQUISES) {
        expect(style.variables[nom], `${style.id} sans ${nom}`).toBeTruthy()
      }
    }
  })

  it("n'introduit aucune variable hors du préfixe de la maquette", () => {
    for (const style of STYLES) {
      for (const nom of Object.keys(style.variables)) expect(nom.startsWith('--m-')).toBe(true)
    }
  })

  it('tient le texte courant à 4,5:1 sur le fond, dans chaque style', () => {
    for (const style of STYLES) {
      const texte = parseColor(style.variables['--m-texte']).rgb
      const fond = parseColor(style.variables['--m-fond']).rgb
      expect(contrastRatio(texte, fond), style.id).toBeGreaterThanOrEqual(4.5)
    }
  })

  it('tient le texte sourdine à 4,5:1 sur le fond, dans chaque style', () => {
    for (const style of STYLES) {
      const sourd = parseColor(style.variables['--m-texte-sourd']).rgb
      const fond = parseColor(style.variables['--m-fond']).rgb
      expect(contrastRatio(sourd, fond), style.id).toBeGreaterThanOrEqual(4.5)
    }
  })

  it("tient l'accent à 4,5:1 sur le fond, dans chaque style", () => {
    for (const style of STYLES) {
      const accent = parseColor(style.variables['--m-accent']).rgb
      const fond = parseColor(style.variables['--m-fond']).rgb
      expect(contrastRatio(accent, fond), style.id).toBeGreaterThanOrEqual(4.5)
    }
  })

  it("tient le texte posé sur l'accent, pour les boutons pleins", () => {
    for (const style of STYLES) {
      const dessus = parseColor(style.variables['--m-accent-contraste']).rgb
      const accent = parseColor(style.variables['--m-accent']).rgb
      expect(contrastRatio(dessus, accent), style.id).toBeGreaterThanOrEqual(4.5)
    }
  })

  it('retombe sur une direction connue pour un identifiant inconnu', () => {
    expect(styleParId('licorne')).toBeUndefined()
    expect(styleParId(STYLE_DEFAUT)).toBeDefined()
  })
})
