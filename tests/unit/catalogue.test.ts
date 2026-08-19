import { describe, expect, it } from 'vitest'
import { GROUPES, OPTIONS, SOCLE_ID, optionParId } from '@/lib/config/catalogue'
import { LANGUES } from '@/lib/config/maquette'
import { DOMAINES, EDITORIAL } from '@/lib/config/domaines'

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
    // Couplage assumé : `EDITORIAL[domaine][langue].pages` alimente la navigation
    // (3 + max × 3 entrées) et la liste des pages rédigées (une par unité de `redaction`).
    const tranches = optionParId('pages')!.quantifiable!.max
    const redigees = optionParId('redaction')!.quantifiable!.max
    const attendu = Math.max(3 + tranches * 3, redigees)
    for (const domaine of DOMAINES) {
      for (const langue of LANGUES) {
        const pages = EDITORIAL[domaine.id][langue].pages
        expect(pages.length, `pages manquantes pour ${domaine.id} en ${langue}`).toBeGreaterThanOrEqual(attendu)
        expect(new Set(pages).size, `doublon de page pour ${domaine.id} en ${langue}`).toBe(pages.length)
      }
    }
  })

  it('offre assez d’articles nommés dans chaque langue pour la quantité maximale', () => {
    const max = optionParId('article')!.quantifiable!.max
    for (const domaine of DOMAINES) {
      for (const langue of LANGUES) {
        const articles = EDITORIAL[domaine.id][langue].articles
        expect(articles.length, `articles manquants pour ${domaine.id} en ${langue}`).toBeGreaterThanOrEqual(max)
      }
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
