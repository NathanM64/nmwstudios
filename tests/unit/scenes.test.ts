import { describe, expect, it } from 'vitest'
import { GROUPES, OPTIONS } from '@/lib/config/catalogue'
import { SCENES, SCENE_PAR_GROUPE, sceneDeOption } from '@/lib/config/scenes'

describe('scènes', () => {
  it('associe une scène à chacun des groupes du catalogue', () => {
    for (const groupe of GROUPES) expect(SCENE_PAR_GROUPE[groupe.id]).toBeDefined()
  })

  it('laisse les options visibles sur le site dans la scène de repos', () => {
    for (const id of ['socle', 'pages', 'blog', 'langue', 'membre', 'rdv', 'redaction']) {
      expect(sceneDeOption(id)).toBe('site')
    }
  })

  it('sort de la scène de repos pour ce qui ne se voit pas sur une page', () => {
    expect(sceneDeOption('seo')).toBe('recherche')
    expect(sceneDeOption('seo-local')).toBe('recherche')
    expect(sceneDeOption('a11y')).toBe('conformite')
    expect(sceneDeOption('migration')).toBe('technique')
    expect(sceneDeOption('perf')).toBe('technique')
    expect(sceneDeOption('formation')).toBe('planning')
    expect(sceneDeOption('express')).toBe('planning')
    expect(sceneDeOption('essentiel')).toBe('exploitation')
  })

  it('garde sur le site ce qui s’y voit, même dans un groupe spécialisé', () => {
    // Un article se lit sur le blog, la bannière RGPD s'affiche sur la page.
    expect(sceneDeOption('article')).toBe('site')
    expect(sceneDeOption('newsletter')).toBe('site')
    expect(sceneDeOption('paiement')).toBe('site')
  })

  it('couvre chaque option du catalogue sans exception', () => {
    for (const option of OPTIONS) {
      expect(SCENES.some((s) => s.id === sceneDeOption(option.id))).toBe(true)
    }
  })

  it('retombe sur la scène de repos pour un identifiant inconnu', () => {
    expect(sceneDeOption('licorne')).toBe('site')
  })

  it('déclare un libellé pour chaque scène atteignable', () => {
    const atteignables = new Set(Object.values(SCENE_PAR_GROUPE))
    for (const id of atteignables) expect(SCENES.find((s) => s.id === id)?.libelle).toBeTruthy()
  })
})
