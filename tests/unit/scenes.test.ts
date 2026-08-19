import { describe, expect, it } from 'vitest'
import { OPTIONS } from '@/lib/config/catalogue'
import { ANCRE_PAR_GROUPE, SCENES, partieDeAncre, sceneDeOption } from '@/lib/config/scenes'

describe('scènes', () => {
  it('en déclare exactement trois', () => {
    expect(SCENES.map((s) => s.id)).toEqual(['site', 'preuve', 'deroule'])
  })

  it('répartit les 30 options en 14, 8 et 8', () => {
    const compte = { site: 0, preuve: 0, deroule: 0 }
    for (const option of OPTIONS) compte[sceneDeOption(option.id)]++
    expect(compte).toEqual({ site: 14, preuve: 8, deroule: 8 })
  })

  it('déclare un libellé pour chaque scène atteignable par un groupe', () => {
    for (const id of new Set(Object.values(ANCRE_PAR_GROUPE).map(partieDeAncre))) {
      expect(SCENES.find((s) => s.id === id)?.libelle).toBeTruthy()
    }
  })
})
