import { describe, expect, it } from 'vitest'
import { GROUPES, OPTIONS } from '@/lib/config/catalogue'
import {
  ANCRES,
  ANCRE_DE_TETE,
  ANCRE_PAR_GROUPE,
  SCENES,
  ancreDeOption,
  partieDeAncre,
  premiereAncreDe,
  sceneDeOption,
} from '@/lib/config/scenes'

/** Scène de chaque option telle qu'elle était avant le passage aux ancres. Les trois filets du
 *  lot A cliquent `onglet-${sceneDeOption(id)}` : cette table est ce qui les garde valides. */
const SCENE_ATTENDUE: Record<string, string> = {
  socle: 'site',
  pages: 'site', blog: 'site', langue: 'site',
  redaction: 'site', reprise: 'site', photos: 'site', visuels: 'site',
  formulaire: 'site', rdv: 'site', newsletter: 'site', paiement: 'site', membre: 'site',
  seo: 'preuve', 'seo-local': 'preuve', article: 'site',
  legal: 'preuve', rgpd: 'preuve', a11y: 'preuve',
  migration: 'preuve', domaine: 'preuve', perf: 'preuve', express: 'deroule',
  cadrage: 'deroule', formation: 'deroule',
  'sans-suivi': 'deroule', heberg: 'deroule', essentiel: 'deroule',
  serenite: 'deroule', partenaire: 'deroule',
}

describe('ancres du document', () => {
  it('fait avancer les ancres des groupes dans le sens du document', () => {
    // Descendre le catalogue doit descendre la page : une ancre de groupe placée au-dessus de
    // celle du groupe précédent la ferait remonter, et rien d'autre ne le verrait.
    const rangs = GROUPES.map((g) => ANCRES.findIndex((a) => a.id === ANCRE_PAR_GROUPE[g.id]))
    expect(rangs).toEqual([...rangs].sort((a, b) => a - b))
  })

  it('rattache chaque ancre à une partie déclarée', () => {
    const parties = new Set(SCENES.map((s) => s.id))
    for (const ancre of ANCRES) expect(parties.has(ancre.partie), ancre.id).toBe(true)
  })

  it('donne une ancre à chacun des neuf groupes', () => {
    for (const groupe of GROUPES) {
      expect(ANCRE_PAR_GROUPE[groupe.id], groupe.id).toBeDefined()
      expect(ANCRES.some((a) => a.id === ANCRE_PAR_GROUPE[groupe.id]), groupe.id).toBe(true)
    }
  })

  it('donne à chaque partie une première ancre, qui lui appartient', () => {
    for (const scene of SCENES) {
      expect(partieDeAncre(premiereAncreDe(scene.id))).toBe(scene.id)
    }
  })

  it('fait de la tête d’une partie sa première ancre', () => {
    // Presser un repère vise `premiereAncreDe` ; l'enveloppe de la partie porte `ANCRE_DE_TETE`.
    // Les voir diverger, c'est viser une ancre interne ou en poser deux au même endroit.
    for (const scene of SCENES) {
      expect(ANCRE_DE_TETE[scene.id], scene.id).toBe(premiereAncreDe(scene.id))
    }
  })

  it('garde pour chaque option la scène qu’elle avait avant les ancres', () => {
    expect(Object.keys(SCENE_ATTENDUE)).toHaveLength(OPTIONS.length)
    for (const option of OPTIONS) {
      expect(sceneDeOption(option.id), option.id).toBe(SCENE_ATTENDUE[option.id])
    }
  })

  it('retombe sur le haut du site pour un identifiant inconnu', () => {
    expect(ancreDeOption('licorne')).toBe('site-haut')
  })
})
