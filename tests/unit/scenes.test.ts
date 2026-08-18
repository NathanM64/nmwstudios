import { describe, expect, it } from 'vitest'
import { OPTIONS } from '@/lib/config/catalogue'
import { SCENES, SCENE_PAR_GROUPE, sceneDeOption } from '@/lib/config/scenes'

describe('scènes', () => {
  it('en déclare exactement trois', () => {
    expect(SCENES.map((s) => s.id)).toEqual(['site', 'preuve', 'deroule'])
  })

  it('range chaque option du catalogue dans une scène déclarée', () => {
    const declarees = new Set(SCENES.map((s) => s.id))
    for (const option of OPTIONS) {
      expect(declarees.has(sceneDeOption(option.id))).toBe(true)
    }
  })

  it('répartit les 30 options en 14, 8 et 8', () => {
    const compte = { site: 0, preuve: 0, deroule: 0 }
    for (const option of OPTIONS) compte[sceneDeOption(option.id)]++
    expect(compte).toEqual({ site: 14, preuve: 8, deroule: 8 })
  })

  it('met dans la preuve ce qui se mesure, y compris hors du groupe conformité', () => {
    for (const id of ['seo', 'seo-local', 'legal', 'rgpd', 'a11y', 'migration', 'domaine', 'perf']) {
      expect(sceneDeOption(id)).toBe('preuve')
    }
  })

  it('met dans le déroulé ce qui se passe dans le temps', () => {
    for (const id of ['cadrage', 'formation', 'express', 'sans-suivi', 'heberg', 'essentiel', 'serenite', 'partenaire']) {
      expect(sceneDeOption(id)).toBe('deroule')
    }
  })

  it('garde un article sur le site, il se lit sur le blog et non dans un rapport', () => {
    expect(sceneDeOption('article')).toBe('site')
  })

  it('sort la livraison accélérée de son groupe technique pour la mettre dans le temps', () => {
    expect(sceneDeOption('express')).toBe('deroule')
  })

  it('retombe sur le site pour un identifiant inconnu', () => {
    expect(sceneDeOption('licorne')).toBe('site')
  })

  it('déclare un libellé pour chaque scène atteignable par un groupe', () => {
    for (const id of new Set(Object.values(SCENE_PAR_GROUPE))) {
      expect(SCENES.find((s) => s.id === id)?.libelle).toBeTruthy()
    }
  })
})
