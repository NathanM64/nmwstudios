import { describe, expect, it } from 'vitest'
import { contrastRatio, parseColor } from '@/lib/color/contrast'
import { STYLES, STYLE_DEFAUT, styleParId } from '@/lib/config/styles'

const REQUISES = [
  '--m-fond', '--m-fond-2', '--m-texte', '--m-texte-sourd', '--m-accent',
  '--m-accent-contraste', '--m-bord', '--m-titre-famille', '--m-corps-famille',
  '--m-titre-graisse', '--m-titre-taille-base', '--m-rayon', '--m-densite-base',
] as const

/** Les huit valeurs que le palier multiplie. `styles.ts` ne pose que le `-base` : poser la
 *  dérivée en ligne écraserait le calcul de `.maquette-page` et figerait le palier. */
const DERIVEES = [
  '--m-titre-taille', '--m-sous-titre-taille', '--m-corps-taille', '--m-texte-taille',
  '--m-menu-taille', '--m-legende-taille', '--m-chiffre-taille', '--m-densite',
] as const

describe('directions de style', () => {
  it('en déclare exactement cinq', () => {
    expect(STYLES.map((s) => s.id)).toEqual(['enseigne', 'clinique', 'velours', 'nocturne', 'affiche'])
  })

  it('donne un libellé non vide à chacune', () => {
    for (const style of STYLES) expect(style.libelle.length).toBeGreaterThan(0)
  })

  it('déclare toutes les variables requises dans chaque style', () => {
    // Une variable manquante ferait retomber la maquette sur une valeur héritée du site,
    // donc un rendu incohérent plutôt qu'une erreur visible.
    for (const style of STYLES) {
      for (const nom of REQUISES) {
        expect(style.variables[nom], `${style.id} sans ${nom}`).toBeTruthy()
      }
    }
  })

  it('déclare ses deux polices par variable, jamais par pile littérale', () => {
    // Une pile écrite en dur échappe à `next/font` : ni sous-ensemble, ni `swap`, ni garantie
    // que la police soit réellement chargée.
    for (const style of STYLES) {
      for (const nom of ['--m-titre-famille', '--m-corps-famille'] as const) {
        expect(style.variables[nom], `${style.id} ${nom}`).toMatch(/^var\(--font-[a-z-]+\)/)
      }
    }
  })

  it('ne pose aucune dérivée du palier en ligne', () => {
    for (const style of STYLES) {
      for (const nom of DERIVEES) {
        expect(style.variables[nom], `${style.id} pose ${nom} en ligne`).toBeUndefined()
        expect(style.variables[`${nom}-base`], `${style.id} sans ${nom}-base`).toBeTruthy()
      }
    }
  })

  it("n'introduit aucune variable hors du préfixe de la maquette", () => {
    for (const style of STYLES) {
      for (const nom of Object.keys(style.variables)) expect(nom.startsWith('--m-')).toBe(true)
    }
  })

  it('tient le texte courant à 4,5:1 sur le fond, dans chaque style', () => {
    for (const style of STYLES) {
      const texte = parseColor(style.variables['--m-texte']).rgb
      const fond = parseColor(style.variables['--m-fond']).rgb
      expect(contrastRatio(texte, fond), style.id).toBeGreaterThanOrEqual(4.5)
    }
  })

  it('tient ses trois encres sur toutes les surfaces réellement peintes', () => {
    // Le fond nu ne suffit pas : `.m-jeton`, `.m-repere` et `.m-couloir` composent `--m-texte`
    // avec le fond, et c'est sur ces surfaces que le contraste tombe le plus bas. Trouvé le
    // 21/08/2026 par axe, qui ne voyait que la direction par défaut.
    const melange = (avant: string, arriere: string, part: number) => {
      const a = parseColor(avant).rgb
      const b = parseColor(arriere).rgb
      const c = (k: 'r' | 'g' | 'b') => Math.round(a[k] * part + b[k] * (1 - part))
      return { r: c('r'), g: c('g'), b: c('b') }
    }
    for (const style of STYLES) {
      const v = style.variables
      const surfaces: [string, { r: number; g: number; b: number }][] = [
        ['fond', parseColor(v['--m-fond']).rgb],
        ['fond-2', parseColor(v['--m-fond-2']).rgb],
        ['couloir', melange(v['--m-texte'], v['--m-fond'], 0.05)],
        ['repere', melange(v['--m-texte'], v['--m-fond'], 0.12)],
        ['jeton sur fond', melange(v['--m-texte'], v['--m-fond'], 0.18)],
        ['jeton sur fond-2', melange(v['--m-texte'], v['--m-fond-2'], 0.18)],
        ['teinte', melange(v['--m-accent'], v['--m-fond'], 0.16)],
      ]
      // L'accent n'est pas ici : rien ne prouve qu'il soit jamais peint sur une surface
      // composée, et l'exiger assombrirait les cinq palettes pour une contrainte inventée.
      // C'est axe, sur les cinq directions, qui juge les paires réelles.
      for (const encre of ['--m-texte', '--m-texte-sourd'] as const) {
        for (const [nom, fond] of surfaces) {
          const rapport = contrastRatio(parseColor(v[encre]).rgb, fond)
          expect(rapport, `${style.id} ${encre} sur ${nom}`).toBeGreaterThanOrEqual(4.5)
        }
      }
    }
  })

  it('tient le texte sourdine à 4,5:1 sur le fond, dans chaque style', () => {
    for (const style of STYLES) {
      const sourd = parseColor(style.variables['--m-texte-sourd']).rgb
      const fond = parseColor(style.variables['--m-fond']).rgb
      expect(contrastRatio(sourd, fond), style.id).toBeGreaterThanOrEqual(4.5)
    }
  })

  it("tient l'accent à 4,5:1 sur le fond, dans chaque style", () => {
    for (const style of STYLES) {
      const accent = parseColor(style.variables['--m-accent']).rgb
      const fond = parseColor(style.variables['--m-fond']).rgb
      expect(contrastRatio(accent, fond), style.id).toBeGreaterThanOrEqual(4.5)
    }
  })

  it("tient le texte posé sur l'accent, pour les boutons pleins", () => {
    for (const style of STYLES) {
      const dessus = parseColor(style.variables['--m-accent-contraste']).rgb
      const accent = parseColor(style.variables['--m-accent']).rgb
      expect(contrastRatio(dessus, accent), style.id).toBeGreaterThanOrEqual(4.5)
    }
  })

  it('retombe sur une direction connue pour un identifiant inconnu', () => {
    expect(styleParId('licorne')).toBeUndefined()
    expect(styleParId(STYLE_DEFAUT)).toBeDefined()
  })
})
