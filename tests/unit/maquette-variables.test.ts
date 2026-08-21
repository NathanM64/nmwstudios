import { readFileSync, readdirSync } from 'node:fs'
import { basename, join } from 'node:path'
import { describe, expect, it } from 'vitest'

const DOSSIER = 'components/config/scenes'
/** `DocumentMaquette` écrit du balisage de maquette hors du dossier des scènes, et c'est lui qui
 *  portera la structure des scènes hautes : la règle doit le couvrir aussi. */
const HORS_DOSSIER = ['components/config/DocumentMaquette.tsx']
const CSS = readFileSync('app/globals.css', 'utf8')

/** Couleurs littérales, tailles et rayons en dur : tout doit passer par les variables `--m-*`,
 *  lues dans `app/globals.css` et nulle part ailleurs. C'est la règle qui empêche l'explosion
 *  combinatoire, donc celle qu'il faut protéger d'une distraction. */
const INTERDITS = [
  /#[0-9a-fA-F]{3,8}\b/,
  /\brgba?\(/,
  /\btext-\[\d/,
  /\btext-(foreground|muted-foreground|accent)\b/,
  /\bbg-(surface|surface-raised|canvas|accent|maquette)\b/,
  /\bborder-(border|border-strong|accent)\b/,
  /\brounded(-(sm|md|lg|full|none))?\b/,
  /var\(--color-/,
]

/** `m-auto` est un utilitaire de marge de Tailwind, pas une classe de la maquette. */
const HORS_MAQUETTE = new Set(['m-auto'])

describe('orthogonalité du style', () => {
  const scenes = readdirSync(DOSSIER)
    .filter((f) => f.endsWith('.tsx'))
    .map((f) => join(DOSSIER, f))
  const chemins = [...scenes, ...HORS_DOSSIER]

  it('trouve les composants de scène', () => {
    expect(scenes.length).toBeGreaterThanOrEqual(3)
  })

  for (const chemin of chemins) {
    const fichier = basename(chemin)
    const source = readFileSync(chemin, 'utf8')

    it(`n'écrit aucune couleur, taille ni rayon en dur dans ${fichier}`, () => {
      for (const motif of INTERDITS) {
        const trouve = motif.exec(source)
        expect(trouve?.[0], `${fichier} contient ${trouve?.[0]}`).toBeUndefined()
      }
    })

    it(`habille ${fichier} par les classes de la maquette`, () => {
      // Sans cette vérification, retirer tout l'habillage suffirait à satisfaire la liste noire.
      expect(source).toMatch(/\bm-[a-z]/)
    })

    it(`ne référence aucune classe de maquette inexistante dans ${fichier}`, () => {
      // Une classe mal orthographiée ne fait rien du tout, et rien ne le signale à l'écran.
      // Le tiret devant exclut les propriétés personnalisées : `--m-photo-fond` est une
      // variable, pas une classe, et l'exiger dans le CSS n'aurait aucun sens.
      const classes = [...new Set(source.match(/(?<!-)\bm-[a-z][a-z0-9-]*/g) ?? [])].filter(
        (c) => !HORS_MAQUETTE.has(c)
      )
      expect(classes.length).toBeGreaterThan(0)
      for (const classe of classes) {
        expect(CSS.includes(`.${classe} `) || CSS.includes(`.${classe},`) || CSS.includes(`.${classe} {`), `${fichier} : .${classe} n’est pas déclarée dans app/globals.css`).toBe(true)
      }
    })
  }
})
