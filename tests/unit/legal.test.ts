import { describe, expect, it } from 'vitest'
import { LEGAL } from '@/lib/legal'

describe('mentions légales', () => {
  it('renseigne toutes les mentions obligatoires', () => {
    for (const champ of [
      'denomination',
      'formeJuridique',
      'siret',
      'adresse',
      'directeurPublication',
      'tva',
      'email',
    ] as const) {
      expect(LEGAL[champ], `mention obligatoire vide : ${champ}`).toBeTruthy()
    }
    expect(LEGAL.hebergeur.nom).toBeTruthy()
    expect(LEGAL.hebergeur.adresse).toBeTruthy()
  })

  it('porte un SIRET à quatorze chiffres', () => {
    expect(LEGAL.siret.replace(/\s/g, '')).toMatch(/^\d{14}$/)
  })
})
