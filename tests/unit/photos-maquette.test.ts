import { existsSync, readFileSync, statSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { DOMAINES } from '@/lib/config/domaines'

const DOSSIER = 'public/maquette'
const LICENCES = `${DOSSIER}/LICENCES.md`

describe('photos de la maquette', () => {
  for (const domaine of DOMAINES) {
    it(`fournit une image pour ${domaine.id}`, () => {
      const chemin = `${DOSSIER}/${domaine.id}.avif`
      expect(existsSync(chemin), `${chemin} manquant`).toBe(true)
      // Le poids est le sujet : une image non convertie passerait le test d'existence.
      expect(statSync(chemin).size, `${chemin} trop lourd`).toBeLessThan(80_000)
    })

    it(`consigne la licence et la source de ${domaine.id}`, () => {
      // Une image sans provenance écrite est une image qu'on ne peut plus défendre.
      const ligne = readFileSync(LICENCES, 'utf8')
        .split('\n')
        .find((l) => l.includes(`${domaine.id}.avif`))
      expect(ligne, `${domaine.id} absent de LICENCES.md`).toBeTruthy()
      expect(ligne, `${domaine.id} sans licence libre`).toMatch(/CC0|PDM|domaine public/i)
      expect(ligne, `${domaine.id} sans source`).toMatch(/https?:\/\//)
    })
  }
})
