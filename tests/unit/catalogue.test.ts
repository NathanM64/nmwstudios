import { describe, expect, it } from 'vitest'
import { GROUPES, OPTIONS, SOCLE_ID, optionParId } from '@/lib/config/catalogue'
import { LANGUES, TEXTES } from '@/lib/config/maquette'

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

  it('déclare un maximum strictement positif pour chaque option quantifiable', () => {
    const quantifiables = OPTIONS.filter((o) => o.quantifiable)
    expect(quantifiables.length).toBeGreaterThan(0)
    for (const option of quantifiables) expect(option.quantifiable!.max).toBeGreaterThan(0)
  })

  it('donne une carte d’état à chaque option du groupe récurrent, lue par l’aperçu', () => {
    const recurrentes = OPTIONS.filter((o) => o.groupe === 'recurrent')
    expect(recurrentes.length).toBeGreaterThan(0)
    for (const option of recurrentes) expect(option.carte?.length).toBeGreaterThan(0)
  })

  it('nomme assez de pages dans chaque langue pour les tranches et les textes rédigés', () => {
    // Couplage assumé : `TEXTES[langue].pages` alimente la navigation (3 + max × 3 entrées)
    // et la liste des pages rédigées (une par unité de `redaction`).
    const tranches = optionParId('pages')!.quantifiable!.max
    const redigees = optionParId('redaction')!.quantifiable!.max
    for (const langue of LANGUES) {
      const attendu = Math.max(3 + tranches * 3, redigees)
      expect(TEXTES[langue].pages.length, `pages manquantes en ${langue}`).toBeGreaterThanOrEqual(attendu)
      expect(new Set(TEXTES[langue].pages).size, `doublon de page en ${langue}`).toBe(TEXTES[langue].pages.length)
    }
  })

  it('offre assez d’articles nommés dans chaque langue pour la quantité maximale', () => {
    const max = optionParId('article')!.quantifiable!.max
    for (const langue of LANGUES) {
      expect(TEXTES[langue].articles.length, `articles manquants en ${langue}`).toBeGreaterThanOrEqual(max)
    }
  })

  it('offre une langue de maquette de plus que le maximum de l’option, le français compris', () => {
    expect(LANGUES.length).toBe(optionParId('langue')!.quantifiable!.max + 1)
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
