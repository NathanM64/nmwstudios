import { describe, expect, it } from 'vitest'
import { OPTIONS, optionParId } from '@/lib/config/catalogue'
import { calculerDeroule } from '@/lib/config/duree'

describe('durées du catalogue', () => {
  it('donne une durée en jours à chaque option, éventuellement nulle', () => {
    for (const option of OPTIONS) {
      expect(typeof option.jours).toBe('number')
      expect(option.jours).toBeGreaterThanOrEqual(0)
    }
  })

  it('ne laisse pas déduire le TJM : le rapport prix sur jours varie', () => {
    // Un rapport constant permettrait de retrouver le tarif journalier par division.
    const rapports = OPTIONS.filter((o) => o.unite === 'forfait' && o.jours > 0)
      .map((o) => Math.round(o.prix / o.jours))
    expect(new Set(rapports).size).toBeGreaterThan(3)
  })

  it('ne donne aucune durée aux formules récurrentes, elles ne construisent rien', () => {
    for (const option of OPTIONS.filter((o) => o.groupe === 'recurrent')) {
      expect(option.jours).toBe(0)
    }
  })

  it("ne donne aucune durée à la livraison accélérée, c'est un facteur", () => {
    expect(optionParId('express')?.jours).toBe(0)
  })
})

describe('calculerDeroule', () => {
  it('construit le socle seul en une durée non nulle', () => {
    const deroule = calculerDeroule({})
    expect(deroule.construction).toBeGreaterThan(0)
    expect(deroule.cadrage).toBe(0)
    expect(deroule.formation).toBe(0)
  })

  it('allonge la construction quand on ajoute une option qui produit du travail', () => {
    const seul = calculerDeroule({})
    const avecMembre = calculerDeroule({ membre: 1 })
    expect(avecMembre.construction).toBeGreaterThan(seul.construction)
  })

  it("n'allonge pas la construction pour une formule récurrente", () => {
    expect(calculerDeroule({ serenite: 1 }).construction).toBe(calculerDeroule({}).construction)
  })

  it('compte les tranches des options quantifiables', () => {
    expect(calculerDeroule({ pages: 3 }).construction).toBeGreaterThan(calculerDeroule({ pages: 1 }).construction)
  })

  it('sort le cadrage de la construction, il la précède', () => {
    const deroule = calculerDeroule({ cadrage: 1 })
    expect(deroule.cadrage).toBeGreaterThan(0)
    expect(deroule.construction).toBe(calculerDeroule({}).construction)
  })

  it('sort la formation de la construction, elle la suit', () => {
    const deroule = calculerDeroule({ formation: 1 })
    expect(deroule.formation).toBeGreaterThan(0)
    expect(deroule.construction).toBe(calculerDeroule({}).construction)
  })

  it('comprime la construction et avance la livraison avec la livraison accélérée', () => {
    const normal = calculerDeroule({ membre: 1 })
    const presse = calculerDeroule({ membre: 1, express: 1 })
    expect(presse.construction).toBeLessThan(normal.construction)
    expect(presse.livraison).toBeLessThan(presse.livraisonSansExpress)
    expect(presse.livraisonSansExpress).toBeCloseTo(normal.livraison, 5)
  })

  it('laisse livraison et livraisonSansExpress égales sans accélération', () => {
    const deroule = calculerDeroule({ membre: 1 })
    expect(deroule.livraison).toBe(deroule.livraisonSansExpress)
  })

  it("place la livraison après le cadrage et la construction", () => {
    const deroule = calculerDeroule({ cadrage: 1, membre: 1 })
    expect(deroule.livraison).toBeCloseTo(deroule.cadrage + deroule.construction, 5)
  })

  it('couvre toute la ligne, formation comprise, dans le total affiché', () => {
    const deroule = calculerDeroule({ cadrage: 1, membre: 1, formation: 1 })
    expect(deroule.total).toBeGreaterThanOrEqual(deroule.livraison + deroule.formation)
  })
})
