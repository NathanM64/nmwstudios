import { describe, expect, it } from 'vitest'
import { partieAuHaut, partiesActives, positionCible, type Mesures } from '@/lib/config/defilement'

const MESURES: Mesures = {
  offsets: { 'site-haut': 0, 'site-navigation': 100, 'preuve-haut': 900, 'deroule-haut': 1400 },
  hauteurDocument: 2000,
  hauteurFenetre: 700,
}

describe('position du rouleau', () => {
  it("pose l'ancre en haut de la fenêtre à progression nulle", () => {
    expect(positionCible({ ancre: 'preuve-haut', progression: 0 }, MESURES)).toBe(900)
  })

  it('atteint la destination à progression pleine', () => {
    expect(positionCible({ ancre: 'site-haut', vers: 'site-navigation', progression: 1 }, MESURES)).toBe(100)
  })

  it('interpole entre les deux', () => {
    expect(positionCible({ ancre: 'site-haut', vers: 'site-navigation', progression: 0.5 }, MESURES)).toBe(50)
  })

  it("ne bouge pas quand la destination est la même ancre", () => {
    // Trois groupes visent le rapport : traverser le premier ne doit pas emmener au déroulé.
    expect(positionCible({ ancre: 'preuve-haut', vers: 'preuve-haut', progression: 1 }, MESURES)).toBe(900)
  })

  it("reste sur place quand la destination n'est pas mesurée", () => {
    // Une option absente de la configuration ne rend pas son bloc, donc pas son ancre.
    expect(positionCible({ ancre: 'site-navigation', vers: 'site-contact', progression: 1 }, MESURES)).toBe(100)
  })

  it('borne la progression hors de zéro et un', () => {
    expect(positionCible({ ancre: 'site-haut', vers: 'site-navigation', progression: -3 }, MESURES)).toBe(0)
    expect(positionCible({ ancre: 'site-haut', vers: 'site-navigation', progression: 9 }, MESURES)).toBe(100)
  })

  it('ne descend jamais sous le bas du document', () => {
    // 2000 - 700 : au-delà, la fenêtre montrerait du vide sous la dernière partie.
    expect(positionCible({ ancre: 'preuve-haut', vers: 'deroule-haut', progression: 1 }, MESURES)).toBe(1300)
  })

  it('reste en place sans destination', () => {
    expect(positionCible({ ancre: 'site-navigation', progression: 1 }, MESURES)).toBe(100)
  })

  it('retombe en haut pour une ancre non mesurée', () => {
    expect(positionCible({ ancre: 'site-contact', progression: 0 }, MESURES)).toBe(0)
  })

  it('ne rend jamais une position négative', () => {
    expect(positionCible({ ancre: 'site-haut', progression: 0 }, { ...MESURES, hauteurDocument: 300 })).toBe(0)
  })
})

describe('parties actives', () => {
  const BORNES = { site: { haut: 0, bas: 800 }, preuve: { haut: 800, bas: 1300 }, deroule: { haut: 1300, bas: 2000 } }

  it('retient la partie qui occupe la fenêtre', () => {
    expect(partiesActives(BORNES, 0, 700)).toEqual(['site'])
  })

  it('retient les deux parties à cheval sur la fenêtre', () => {
    expect(partiesActives(BORNES, 600, 700)).toEqual(['site', 'preuve'])
  })

  it('écarte les parties entièrement hors de la fenêtre', () => {
    // C'est cette liste qui décide de `inert` : une partie oubliée ici garde son sélecteur
    // de langue dans le parcours clavier alors qu'on ne la voit pas.
    expect(partiesActives(BORNES, 1400, 700)).toEqual(['deroule'])
  })

  it('écarte une partie dont le bas coïncide avec le haut de la fenêtre', () => {
    // Position exactement égale à `preuve.bas` : c'est le seul cas qui distingue `>` de `>=`,
    // et sans lui la borne pourrait glisser d'une unité sans faire rougir un test.
    expect(partiesActives(BORNES, 1300, 700)).toEqual(['deroule'])
  })
})

describe('partie au haut de la fenêtre', () => {
  const BORNES = { site: { haut: 0, bas: 800 }, preuve: { haut: 800, bas: 1300 }, deroule: { haut: 1300, bas: 2000 } }
  const MAX = 1300

  it('nomme la partie où tombe le haut de la fenêtre', () => {
    expect(partieAuHaut(BORNES, 0, MAX)).toBe('site')
    expect(partieAuHaut(BORNES, 799, MAX)).toBe('site')
  })

  it('bascule dès que le haut de la fenêtre atteint la partie suivante', () => {
    // Fin de traversée d'un groupe : le rouleau est intégralement sur la partie d'après, et
    // c'est elle que le bandeau doit nommer.
    expect(partieAuHaut(BORNES, 800, MAX)).toBe('preuve')
  })

  it('nomme la dernière partie quand la position la plus basse reste sous son haut', () => {
    // Hauteur de fenêtre et hauteur de document ne s'arrondissent pas de la même façon : sans
    // rabattement, la page arrivée en bas nommerait encore l'avant-dernière partie.
    expect(partieAuHaut(BORNES, 1299.9, 1299.9)).toBe('deroule')
  })

  it('ne nomme rien tant que rien n’est mesuré', () => {
    expect(partieAuHaut({}, 0, 0)).toBeUndefined()
  })
})
