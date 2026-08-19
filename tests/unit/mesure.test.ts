import { describe, expect, it } from 'vitest'
import { lireChargement } from '@/lib/config/mesure'

function entree(duration: number): PerformanceEntry {
  return { duration, entryType: 'navigation', name: '', startTime: 0, toJSON: () => ({}) } as PerformanceEntry
}

describe('lireChargement', () => {
  it('rend la durée de navigation en secondes', () => {
    expect(lireChargement([entree(410)])).toBeCloseTo(0.41, 3)
  })

  it('rend null quand le navigateur ne fournit aucune entrée', () => {
    // Sans mesure, on n'affiche rien plutôt qu'un chiffre inventé.
    expect(lireChargement([])).toBeNull()
  })

  it('rend null sur une durée nulle, que certains navigateurs renvoient au montage', () => {
    expect(lireChargement([entree(0)])).toBeNull()
  })
})
