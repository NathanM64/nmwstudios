import { describe, expect, it } from 'vitest'
import { GROUPES, OPTIONS } from '@/lib/config/catalogue'
import { SCENES } from '@/lib/config/scenes'
import {
  ENDROITS,
  ENDROIT_DE_TETE,
  endroitDeOption,
  endroitDuGroupe,
  partieDeEndroit,
  repliDe,
  sceneDeOption,
} from '@/lib/config/endroits'

/** Partie de chaque option telle qu'elle était avant le modèle des endroits : cette table est ce
 *  qui garde la répartition fidèle, quatorze, huit et huit. */
const PARTIE_ATTENDUE: Record<string, string> = {
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

describe('table des endroits', () => {
  it('sert chaque option du catalogue exactement une fois', () => {
    const servies = ENDROITS.flatMap((e) => e.sert)
    expect([...servies].sort()).toEqual(OPTIONS.map((o) => o.id).sort())
  })

  it('exige un motif dès qu’un endroit sert plusieurs options', () => {
    // C'est le défaut du lot A : huit options visaient une ancre sans que rien ne le déclare.
    for (const endroit of ENDROITS) {
      if (endroit.sert.length > 1) expect(endroit.partage, endroit.id).toBeTruthy()
    }
  })

  it('n’écrit pas de motif là où il n’y a rien à justifier', () => {
    for (const endroit of ENDROITS) {
      if (endroit.sert.length <= 1) expect(endroit.partage, endroit.id).toBeUndefined()
    }
  })

  it('rattache chaque endroit à une partie déclarée', () => {
    const parties = new Set(SCENES.map((s) => s.id))
    for (const endroit of ENDROITS) expect(parties.has(endroit.partie), endroit.id).toBe(true)
  })

  it('ne déclare pas deux fois le même identifiant', () => {
    expect(new Set(ENDROITS.map((e) => e.id)).size).toBe(ENDROITS.length)
    // Les deux quantités ci-dessus bougent ensemble : une entrée perdue s'y noierait.
    expect(ENDROITS).toHaveLength(24)
  })

  it('donne à chacun des neuf groupes un endroit permanent', () => {
    // La lecture du formulaire vise cet endroit en permanence, sans rien cocher : conditionnel,
    // il manquerait au relevé et renverrait l'aperçu en tête de document.
    for (const groupe of GROUPES) {
      const id = endroitDuGroupe(groupe.id)
      expect(id, groupe.id).toBeDefined()
      expect(ENDROITS.find((e) => e.id === id)!.permanent, groupe.id).toBe(true)
    }
  })

  it('fait avancer les endroits des groupes dans le sens du document', () => {
    // Descendre le catalogue doit descendre la page : un endroit de groupe placé au-dessus de
    // celui du groupe précédent la ferait remonter, et rien d'autre ne le verrait.
    const rangs = GROUPES.map((g) => ENDROITS.findIndex((e) => e.id === endroitDuGroupe(g.id)))
    expect(rangs).toEqual([...rangs].sort((a, b) => a - b))
  })

  it('donne à chaque partie une tête, qui est son premier endroit et lui appartient', () => {
    for (const scene of SCENES) {
      const tete = ENDROIT_DE_TETE[scene.id]
      expect(partieDeEndroit(tete), scene.id).toBe(scene.id)
      expect(tete, scene.id).toBe(ENDROITS.find((e) => e.partie === scene.id)!.id)
      expect(ENDROITS.find((e) => e.id === tete)!.permanent, scene.id).toBe(true)
    }
  })

  it('donne à chaque partie un groupe qui vise sa tête', () => {
    // `amenerLaPartie` n'a que le défilement du formulaire pour atteindre une partie : sans
    // groupe visant sa tête, elle lève une exception au lieu d'échouer ici.
    for (const scene of SCENES) {
      expect(GROUPES.some((g) => endroitDuGroupe(g.id) === ENDROIT_DE_TETE[scene.id]), scene.id).toBe(true)
    }
  })

  it('replie chaque endroit conditionnel sur un permanent de sa propre partie', () => {
    for (const endroit of ENDROITS) {
      const repli = repliDe(endroit.id)
      expect(partieDeEndroit(repli), endroit.id).toBe(endroit.partie)
      expect(ENDROITS.find((e) => e.id === repli)!.permanent, endroit.id).toBe(true)
      if (endroit.permanent) expect(repli, endroit.id).toBe(endroit.id)
    }
  })

  it('replie sur le permanent le plus proche, jamais un plus lointain', () => {
    // Un repli trop lointain passerait le filet ci-dessus : lui seul vérifie la proximité.
    const rang = new Map(ENDROITS.map((e, i) => [e.id, i]))
    for (const endroit of ENDROITS) {
      if (endroit.permanent) continue
      const repli = repliDe(endroit.id)
      const entre = ENDROITS.slice(rang.get(repli)! + 1, rang.get(endroit.id)!)
      expect(entre.some((e) => e.partie === endroit.partie && e.permanent), endroit.id).toBe(false)
    }
  })

  it('garde pour chaque option la partie qu’elle avait avant les endroits', () => {
    expect(Object.keys(PARTIE_ATTENDUE)).toHaveLength(OPTIONS.length)
    for (const option of OPTIONS) {
      expect(sceneDeOption(option.id), option.id).toBe(PARTIE_ATTENDUE[option.id])
    }
  })

  it('répartit les 30 options en 14, 8 et 8', () => {
    const compte = { site: 0, preuve: 0, deroule: 0 }
    for (const option of OPTIONS) compte[sceneDeOption(option.id)]++
    expect(compte).toEqual({ site: 14, preuve: 8, deroule: 8 })
  })

  it('retombe sur le haut du site pour un identifiant inconnu', () => {
    expect(endroitDeOption('licorne')).toBe('site-haut')
  })
})
