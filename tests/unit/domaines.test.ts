import { describe, expect, it } from 'vitest'
import { LANGUES } from '@/lib/config/maquette'
import { DOMAINES, DOMAINE_DEFAUT, EDITORIAL, editorialDe } from '@/lib/config/domaines'
import { optionParId } from '@/lib/config/catalogue'

describe('domaines de la maquette', () => {
  it('en déclare sept, dont le générique', () => {
    expect(DOMAINES).toHaveLength(7)
    expect(DOMAINES.map((d) => d.id)).toContain(DOMAINE_DEFAUT)
  })

  it('donne un libellé non vide à chacun', () => {
    for (const d of DOMAINES) expect(d.libelle.length).toBeGreaterThan(0)
  })

  it('fournit chaque domaine dans les quatre langues', () => {
    // Un domaine ajouté sans traduction rendrait une maquette à trous, sans erreur visible.
    for (const d of DOMAINES) {
      for (const langue of LANGUES) {
        expect(EDITORIAL[d.id]?.[langue], `${d.id} en ${langue}`).toBeDefined()
      }
    }
  })

  it('fournit assez de noms de pages pour la quantité maximale de tranches', () => {
    const max = optionParId('pages')?.quantifiable?.max
    expect(max).toBeGreaterThan(0)
    for (const d of DOMAINES) {
      for (const langue of LANGUES) {
        expect(EDITORIAL[d.id][langue].pages.length).toBeGreaterThanOrEqual(3 + max! * 3)
      }
    }
  })

  it('fournit assez de titres d’articles pour la quantité maximale', () => {
    const max = optionParId('article')?.quantifiable?.max
    for (const d of DOMAINES) {
      for (const langue of LANGUES) {
        expect(EDITORIAL[d.id][langue].articles.length).toBeGreaterThanOrEqual(max!)
      }
    }
  })

  it('donne exactement trois services et trois blocs repris partout', () => {
    for (const d of DOMAINES) {
      for (const langue of LANGUES) {
        expect(EDITORIAL[d.id][langue].services).toHaveLength(3)
        expect(EDITORIAL[d.id][langue].blocsRepris).toHaveLength(3)
      }
    }
  })

  it('ne laisse aucune chaîne vide', () => {
    for (const d of DOMAINES) {
      for (const langue of LANGUES) {
        const e = EDITORIAL[d.id][langue]
        expect(e.enseigne.length).toBeGreaterThan(0)
        expect(e.surtitre.length).toBeGreaterThan(0)
        expect(e.titre.length).toBeGreaterThan(0)
        expect(e.corps.length).toBeGreaterThan(0)
        expect(e.recherche.titre.length).toBeGreaterThan(0)
        expect(e.recherche.description.length).toBeGreaterThan(0)
      }
    }
  })

  // Le caractère est écrit en échappement : sinon ce fichier serait lui-même une occurrence
  // que la vérification de clôture remonterait, et elle perdrait son sens.
  it("n'emploie jamais le tiret cadratin, que le propriétaire refuse", () => {
    for (const d of DOMAINES) {
      for (const langue of LANGUES) {
        expect(JSON.stringify(EDITORIAL[d.id][langue])).not.toContain('\u2014')
      }
    }
  })

  it('retombe sur le domaine générique pour un identifiant inconnu', () => {
    expect(editorialDe('licorne', 'fr')).toEqual(EDITORIAL[DOMAINE_DEFAUT].fr)
  })
})
