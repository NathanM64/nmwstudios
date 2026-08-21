import { describe, expect, it } from 'vitest'
import { partiesActives, positionCible, type Bornes, type Mesures } from '@/lib/config/defilement'

const MESURES: Mesures = {
  offsets: { 'site-haut': 0, 'site-navigation': 100, 'preuve-haut': 900, 'deroule-haut': 1400 },
  hauteurDocument: 2000,
  hauteurFenetre: 700,
}

const BORNES: Bornes = { site: { haut: 0, bas: 900 }, preuve: { haut: 900, bas: 1400 }, deroule: { haut: 1400, bas: 2000 } }

describe('position du rouleau', () => {
  it("pose l'ancre en haut de la fenêtre à progression nulle", () => {
    expect(positionCible({ ancre: 'preuve-haut', progression: 0 }, MESURES, BORNES)).toBe(900)
  })

  it('atteint la destination à progression pleine', () => {
    expect(positionCible({ ancre: 'site-haut', vers: 'site-navigation', progression: 1 }, MESURES, BORNES)).toBe(100)
  })

  it('interpole entre les deux', () => {
    expect(positionCible({ ancre: 'site-haut', vers: 'site-navigation', progression: 0.5 }, MESURES, BORNES)).toBe(50)
  })

  it("ne bouge pas quand la destination est la même ancre", () => {
    // Trois groupes visent le rapport : traverser le premier ne doit pas emmener au déroulé.
    expect(positionCible({ ancre: 'preuve-haut', vers: 'preuve-haut', progression: 1 }, MESURES, BORNES)).toBe(900)
  })

  it("reste sur place quand la destination n'est pas mesurée", () => {
    // Une option absente de la configuration ne rend pas son bloc, donc pas son ancre.
    expect(positionCible({ ancre: 'site-navigation', vers: 'site-contact', progression: 1 }, MESURES, BORNES)).toBe(
      100
    )
  })

  it('borne la progression hors de zéro et un', () => {
    expect(positionCible({ ancre: 'site-haut', vers: 'site-navigation', progression: -3 }, MESURES, BORNES)).toBe(0)
    expect(positionCible({ ancre: 'site-haut', vers: 'site-navigation', progression: 9 }, MESURES, BORNES)).toBe(100)
  })

  it('ne descend jamais sous le bas du document', () => {
    // 2000 - 700 : au-delà, la fenêtre montrerait du vide sous la dernière partie.
    expect(positionCible({ ancre: 'preuve-haut', vers: 'deroule-haut', progression: 1 }, MESURES, BORNES)).toBe(1300)
  })

  it('reste en place sans destination', () => {
    expect(positionCible({ ancre: 'site-navigation', progression: 1 }, MESURES, BORNES)).toBe(100)
  })

  it('retombe en haut pour une ancre non mesurée', () => {
    expect(positionCible({ ancre: 'site-contact', progression: 0 }, MESURES, BORNES)).toBe(0)
  })

  it('ne rend jamais une position négative', () => {
    expect(positionCible({ ancre: 'site-haut', progression: 0 }, { ...MESURES, hauteurDocument: 300 }, BORNES)).toBe(
      0
    )
  })

  it('pose la tête quand la partie visée tient dans une fenêtre', () => {
    // La preuve fait exactement une fenêtre : viser sa dernière ligne montrerait le déroulé
    // dessous, ce que `.maquette-partie` interdit.
    const mesures: Mesures = { offsets: { 'site-contenu': 300 }, hauteurDocument: 4000, hauteurFenetre: 700 }
    const bornes: Bornes = { site: { haut: 0, bas: 700 } }
    expect(positionCible({ ancre: 'site-contenu', progression: 0 }, mesures, bornes)).toBe(0)
  })

  it('laisse descendre dans une partie plus longue qu’une fenêtre', () => {
    const mesures: Mesures = { offsets: { 'deroule-mensuel': 2900 }, hauteurDocument: 4000, hauteurFenetre: 700 }
    const bornes: Bornes = { deroule: { haut: 1600, bas: 4000 } }
    expect(positionCible({ ancre: 'deroule-mensuel', progression: 0 }, mesures, bornes)).toBe(2900)
  })

  it('ne défile jamais au delà de la fin de la partie visée', () => {
    const mesures: Mesures = { offsets: { 'site-contenu': 800 }, hauteurDocument: 4000, hauteurFenetre: 700 }
    const bornes: Bornes = { site: { haut: 0, bas: 900 } }
    // 900 - 700 : au delà, la partie d'après entrerait dans la fenêtre.
    expect(positionCible({ ancre: 'site-contenu', progression: 0 }, mesures, bornes)).toBe(200)
  })

  it('ignore la borne de partie pendant une lecture', () => {
    // Sans cette exception, lire le formulaire se figerait à la fin du site et la preuve ne
    // serait jamais atteinte : la lecture traverse les parties, la pose non.
    const mesures: Mesures = { offsets: { 'site-navigation': 100, 'preuve-haut': 900 }, hauteurDocument: 4000, hauteurFenetre: 700 }
    const bornes: Bornes = { site: { haut: 0, bas: 700 } }
    expect(positionCible({ ancre: 'site-navigation', vers: 'preuve-haut', progression: 1 }, mesures, bornes)).toBe(
      900
    )
  })

  it('pose sans borne quand la partie n’est pas encore mesurée', () => {
    // Premier rendu : `bornes` est vide, et la pose doit rester celle d'avant plutôt que zéro.
    expect(positionCible({ ancre: 'site-navigation', progression: 0 }, MESURES, {})).toBe(100)
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
