import { describe, expect, it } from 'vitest'
import { optionParId } from '@/lib/config/catalogue'
import { CONFIG_VIDE, calculer, formaterEuros, suffixePrix } from '@/lib/config/devis'

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

  // Prix ferme depuis le 19/08/2026 : le total affiché est la somme exacte du catalogue,
  // sans arrondi ni marge. Chaque option a un prix arrêté, la somme aussi.
  it('donne la somme exacte du catalogue, y compris hors multiple de cent', () => {
    expect(calculer({ pages: 2, seo: 1 }).total).toBe(3300)
    expect(calculer({ redaction: 1 }).total).toBe(1650)
  })

  it("n'expose plus de bornes", () => {
    // Une borne réintroduite en silence redonnerait au visiteur deux nombres sans raison.
    expect(Object.keys(calculer({ blog: 1 })).sort()).toEqual(['base', 'mensuel', 'total'])
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

describe('suffixePrix', () => {
  it('additionne un montant en euros pour une option forfait', () => {
    expect(suffixePrix(optionParId('blog')!)).toBe('+700 €')
  })

  it('multiplie le forfait par la quantité pour une option quantifiable', () => {
    expect(suffixePrix(optionParId('pages')!, 3)).toBe('+1 800 €')
  })

  it('suffixe le mois pour une option mensuelle, sans addition', () => {
    expect(suffixePrix(optionParId('essentiel')!)).toBe('90 €/mois')
  })

  it('affiche une majoration en pourcentage, jamais un montant en euros', () => {
    expect(suffixePrix(optionParId('express')!)).toBe('+30 %')
  })
})
