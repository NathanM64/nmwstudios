import { describe, expect, it } from 'vitest'
import { composite, contrastRatio, parseColor, relativeLuminance } from '@/lib/color/contrast'

describe('parseColor', () => {
  it('lit un hexadécimal à six chiffres', () => {
    expect(parseColor('#0a0a0f')).toEqual({ rgb: { r: 10, g: 10, b: 15 }, alpha: 1 })
  })

  it('lit un hexadécimal à trois chiffres', () => {
    expect(parseColor('#fff')).toEqual({ rgb: { r: 255, g: 255, b: 255 }, alpha: 1 })
  })

  it('lit une couleur rgba avec son canal alpha', () => {
    expect(parseColor('rgba(255, 255, 255, 0.045)')).toEqual({
      rgb: { r: 255, g: 255, b: 255 },
      alpha: 0.045,
    })
  })

  it('rejette une valeur non reconnue', () => {
    expect(() => parseColor('bleu')).toThrow(/couleur non reconnue/i)
  })
})

describe('composite', () => {
  it('mélange une surface translucide avec son fond', () => {
    const result = composite({ r: 255, g: 255, b: 255 }, 0.045, { r: 10, g: 10, b: 15 })
    expect(result).toEqual({ r: 21, g: 21, b: 26 })
  })

  it('rend le fond intact à alpha nul', () => {
    expect(composite({ r: 255, g: 255, b: 255 }, 0, { r: 10, g: 10, b: 15 })).toEqual({
      r: 10,
      g: 10,
      b: 15,
    })
  })
})

describe('relativeLuminance', () => {
  it('vaut 0 pour le noir et 1 pour le blanc', () => {
    expect(relativeLuminance({ r: 0, g: 0, b: 0 })).toBe(0)
    expect(relativeLuminance({ r: 255, g: 255, b: 255 })).toBe(1)
  })
})

describe('contrastRatio', () => {
  it('donne 21 entre noir et blanc', () => {
    expect(contrastRatio({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 })).toBeCloseTo(21, 5)
  })

  it('donne 1 pour deux couleurs identiques', () => {
    expect(contrastRatio({ r: 60, g: 60, b: 60 }, { r: 60, g: 60, b: 60 })).toBeCloseTo(1, 5)
  })

  it('donne la valeur de référence de #777777 sur blanc', () => {
    expect(contrastRatio({ r: 119, g: 119, b: 119 }, { r: 255, g: 255, b: 255 })).toBeCloseTo(4.48, 2)
  })

  it('est symétrique', () => {
    const a = { r: 122, g: 162, b: 255 }
    const b = { r: 10, g: 10, b: 15 }
    expect(contrastRatio(a, b)).toBeCloseTo(contrastRatio(b, a), 10)
  })
})
