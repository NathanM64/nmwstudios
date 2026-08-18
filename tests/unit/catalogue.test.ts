import { describe, expect, it } from 'vitest'
import { GROUPES, OPTIONS, SOCLE_ID, optionParId } from '@/lib/config/catalogue'

describe('catalogue', () => {
  it('expose un socle à 1500 €', () => {
    const socle = optionParId(SOCLE_ID)
    expect(socle?.prix).toBe(1500)
    expect(socle?.unite).toBe('forfait')
  })

  it("n'a aucun identifiant en double", () => {
    const ids = OPTIONS.map((o) => o.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('rattache chaque option à un groupe déclaré', () => {
    const groupes = new Set(GROUPES.map((g) => g.id))
    for (const option of OPTIONS) expect(groupes.has(option.groupe)).toBe(true)
  })

  it('donne une explication non vide à chaque option', () => {
    for (const option of OPTIONS) expect(option.explication.length).toBeGreaterThan(0)
  })

  it('ne déclare de quantité maximale que sur les options quantifiables', () => {
    for (const option of OPTIONS) {
      if (option.quantifiable) expect(option.quantifiable.max).toBeGreaterThan(0)
    }
  })

  it("marque le groupe du récurrent comme exclusif", () => {
    expect(GROUPES.find((g) => g.id === 'recurrent')?.exclusif).toBe(true)
  })

  it('offre une échappatoire gratuite au groupe exclusif, sinon rien ne se décoche', () => {
    const sortie = optionParId('sans-suivi')
    expect(sortie?.groupe).toBe('recurrent')
    expect(sortie?.prix).toBe(0)
  })

  it('rend introuvable un identifiant inconnu', () => {
    expect(optionParId('inexistant')).toBeUndefined()
  })

  it('introduit chaque groupe par une phrase', () => {
    for (const groupe of GROUPES) {
      expect(groupe.intro.length).toBeGreaterThan(20)
      expect(groupe.intro).not.toContain('—')
    }
  })
})
