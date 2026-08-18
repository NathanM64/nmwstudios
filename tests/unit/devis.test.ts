import { describe, expect, it } from 'vitest'
import { CONFIG_VIDE, calculer, formaterEuros } from '@/lib/config/devis'

describe('calculer', () => {
  it('facture le socle seul sur une configuration vide', () => {
    expect(calculer(CONFIG_VIDE).total).toBe(1500)
  })

  it('compte le socle même si la configuration ne le mentionne pas', () => {
    expect(calculer({ blog: 1 }).total).toBe(2200)
  })

  it('multiplie une option quantifiable par sa quantité', () => {
    expect(calculer({ pages: 2 }).total).toBe(1500 + 1200)
  })

  it('plafonne une quantité au maximum déclaré', () => {
    expect(calculer({ pages: 99 }).total).toBe(1500 + 4 * 600)
  })

  it('ne compte qu’une fois une option non quantifiable', () => {
    expect(calculer({ blog: 5 }).total).toBe(2200)
  })

  it('ignore une quantité nulle ou négative', () => {
    expect(calculer({ blog: 0, rdv: -3 }).total).toBe(1500)
  })

  it('ignore une option inconnue', () => {
    expect(calculer({ licorne: 4 }).total).toBe(1500)
  })

  it('applique un pourcentage au total des forfaits', () => {
    expect(calculer({ blog: 1, express: 1 }).total).toBe(Math.round(2200 * 1.3))
  })

  it('tient le mensuel à part et le laisse hors du pourcentage', () => {
    const devis = calculer({ essentiel: 1, express: 1 })
    expect(devis.mensuel).toBe(90)
    expect(devis.total).toBe(Math.round(1500 * 1.3))
  })

  it('encadre le total par une fourchette arrondie à la centaine', () => {
    const devis = calculer({ pages: 2, seo: 1 })
    expect(devis.total).toBe(3300)
    expect(devis.bas).toBe(3300)
    expect(devis.haut).toBe(3800)
  })

  it('arrondit bas et haut sur un total non-multiple de cent', () => {
    const devis = calculer({ redaction: 1 })
    expect(devis.total).toBe(1650)
    expect(devis.bas).toBe(1600)
    expect(devis.haut).toBe(1900)
  })

  it('expose la base hors pourcentage', () => {
    expect(calculer({ blog: 1, express: 1 }).base).toBe(2200)
  })
})

describe('formaterEuros', () => {
  it('sépare les milliers par une espace insécable et suffixe l’euro', () => {
    expect(formaterEuros(3800)).toBe('3 800 €')
  })

  it('laisse un montant court intact', () => {
    expect(formaterEuros(90)).toBe('90 €')
  })
})
