import { describe, expect, it } from 'vitest'
import { decoder, encoder } from '@/lib/config/url'

describe('encoder', () => {
  it('omet une configuration vide', () => {
    expect(encoder({})).toBe('')
  })

  it('écrit une option simple sans valeur', () => {
    expect(encoder({ blog: 1 })).toBe('blog')
  })

  it('écrit la quantité au-delà de un', () => {
    expect(encoder({ pages: 3 })).toBe('pages=3')
  })

  it('ignore les quantités nulles', () => {
    expect(encoder({ blog: 0, rdv: 1 })).toBe('rdv')
  })

  it('suit l’ordre du catalogue, pas celui de l’objet', () => {
    expect(encoder({ seo: 1, blog: 1 })).toBe('blog&seo')
  })
})

describe('decoder', () => {
  it('lit une chaîne vide comme une configuration vide', () => {
    expect(decoder('')).toEqual({})
  })

  it('lit un drapeau sans valeur comme une quantité de un', () => {
    expect(decoder('blog')).toEqual({ blog: 1 })
  })

  it('lit une quantité explicite', () => {
    expect(decoder('pages=3')).toEqual({ pages: 3 })
  })

  it('accepte le point d’interrogation en tête', () => {
    expect(decoder('?blog')).toEqual({ blog: 1 })
  })

  it('ignore un identifiant inconnu', () => {
    expect(decoder('licorne=2&blog')).toEqual({ blog: 1 })
  })

  it('ignore une valeur non numérique', () => {
    expect(decoder('pages=beaucoup')).toEqual({})
  })

  it('ignore une quantité négative ou nulle', () => {
    expect(decoder('pages=-1&blog=0')).toEqual({})
  })

  it('plafonne une quantité quantifiable au maximum déclaré', () => {
    expect(decoder('pages=99')).toEqual({ pages: 4 })
  })

  it('plafonne la rédaction très au-delà de son maximum déclaré', () => {
    expect(decoder('redaction=999')).toEqual({ redaction: 15 })
  })

  it('fait l’aller-retour sans perte', () => {
    const config = { pages: 2, blog: 1, seo: 1, essentiel: 1 }
    expect(decoder(encoder(config))).toEqual(config)
  })
})
