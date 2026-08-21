export type StyleId = 'enseigne' | 'clinique' | 'velours' | 'nocturne' | 'affiche'

/** Bloc de structure propre à une direction. C'est lui qui empêche les cinq d'être cinq
 *  palettes sur la même page, et une direction n'en pose jamais deux. */
export type Geste = 'bandeau' | 'bande' | 'centre' | 'rail' | 'aplat'

export type Style = {
  id: StyleId
  libelle: string
  geste: Geste
  variables: Record<string, string>
}

/** Préfixe `--m-` : la maquette ne doit jamais hériter d'un jeton du site, ni le polluer.
 *  Les valeurs littérales vivent ici et nulle part ailleurs, c'est ce qui rend une
 *  sixième direction gratuite. Plancher de taille à 0,875 rem : sous cette valeur le texte
 *  rendu passe sous les 10 px que `tests/e2e/document-defilant.spec.ts` exige. */
export const STYLES: readonly Style[] = [
  {
    id: 'enseigne',
    libelle: 'Enseigne',
    geste: 'bandeau',
    variables: {
      '--m-schema': 'light',
      '--m-fond': '#F4F2EB',
      '--m-fond-2': '#E7E3D6',
      '--m-texte': '#0E2A22',
      '--m-texte-sourd': '#4E4F42',
      '--m-accent': '#A8341F',
      '--m-accent-2': '#C79A43',
      '--m-accent-contraste': '#F4F2EB',
      '--m-bord': '#DAD5C6',
      '--m-titre-famille': 'var(--font-fraunces), Georgia, serif',
      '--m-corps-famille': 'var(--font-chivo), system-ui, sans-serif',
      '--m-titre-graisse': '400',
      '--m-corps-graisse': '400',
      '--m-titre-taille-base': '3.5rem',
      '--m-titre-interligne': '1.02',
      '--m-titre-suivi': '-0.02em',
      '--m-corps-taille-base': '1.25rem',
      '--m-sous-titre-taille-base': '1.25rem',
      '--m-texte-taille-base': '1rem',
      '--m-menu-taille-base': '0.9375rem',
      '--m-legende-taille-base': '0.875rem',
      '--m-chiffre-taille-base': '4rem',
      '--m-rayon': '0.125rem',
      '--m-rayon-2': '0.25rem',
      '--m-densite-base': '1.15',
      '--m-aplat':
        'radial-gradient(90% 80% at 18% 10%, #E8C98A 0%, rgba(232, 201, 138, 0) 62%), linear-gradient(158deg, #7C8A5B 0%, #3E5340 52%, #16261F 100%)',
      '--m-ombre': '0 1px 2px rgba(14, 42, 34, 0.06), 0 14px 32px -20px rgba(14, 42, 34, 0.35)',
      '--m-photo-teinte': '#C79A43',
      '--m-photo-voile': '0.22',
    },
  },
  {
    id: 'clinique',
    libelle: 'Clinique',
    geste: 'bande',
    variables: {
      '--m-schema': 'light',
      '--m-fond': '#FCFBF8',
      '--m-fond-2': '#F0EEE7',
      '--m-texte': '#1B1E1C',
      '--m-texte-sourd': '#4F5450',
      '--m-accent': '#3E5C48',
      '--m-accent-2': '#C8B79B',
      '--m-accent-contraste': '#FCFBF8',
      '--m-bord': '#E2E0D8',
      '--m-titre-famille': 'var(--font-newsreader), Georgia, serif',
      '--m-corps-famille': 'var(--font-manrope), system-ui, sans-serif',
      '--m-titre-graisse': '300',
      '--m-corps-graisse': '400',
      '--m-titre-taille-base': '3.25rem',
      '--m-titre-interligne': '1.12',
      '--m-titre-suivi': '-0.01em',
      '--m-corps-taille-base': '1.25rem',
      '--m-sous-titre-taille-base': '1.1875rem',
      '--m-texte-taille-base': '1rem',
      '--m-menu-taille-base': '1rem',
      '--m-legende-taille-base': '0.875rem',
      '--m-chiffre-taille-base': '3.5rem',
      '--m-rayon': '0.375rem',
      '--m-rayon-2': '0.625rem',
      '--m-densite-base': '1.2',
      '--m-aplat':
        'radial-gradient(90% 110% at 78% 6%, #F2EADC 0%, rgba(242, 234, 220, 0) 58%), linear-gradient(150deg, #A8B5A4 0%, #6C7F6E 48%, #39463C 100%)',
      '--m-ombre': '0 1px 2px rgba(27, 30, 28, 0.05), 0 16px 36px -24px rgba(27, 30, 28, 0.3)',
      '--m-photo-teinte': '#3E5C48',
      '--m-photo-voile': '0.18',
    },
  },
  {
    id: 'velours',
    libelle: 'Velours',
    geste: 'centre',
    variables: {
      '--m-schema': 'light',
      '--m-fond': '#EDEAE3',
      '--m-fond-2': '#E1DDD3',
      '--m-texte': '#181712',
      '--m-texte-sourd': '#4B483F',
      '--m-accent': '#33427A',
      '--m-accent-2': '#9A9384',
      '--m-accent-contraste': '#EDEAE3',
      '--m-bord': '#D6D1C5',
      '--m-titre-famille': 'var(--font-instrument), Georgia, serif',
      '--m-corps-famille': 'var(--font-inter-tight), system-ui, sans-serif',
      '--m-titre-graisse': '400',
      '--m-corps-graisse': '300',
      '--m-titre-taille-base': '3.75rem',
      '--m-titre-interligne': '1.06',
      '--m-titre-suivi': '-0.005em',
      '--m-corps-taille-base': '1.25rem',
      '--m-sous-titre-taille-base': '1.25rem',
      '--m-texte-taille-base': '1rem',
      '--m-menu-taille-base': '0.9375rem',
      '--m-legende-taille-base': '0.875rem',
      '--m-chiffre-taille-base': '4.25rem',
      '--m-rayon': '0',
      '--m-rayon-2': '0',
      '--m-densite-base': '1.3',
      '--m-aplat':
        'radial-gradient(120% 100% at 30% 0%, #D9D2C4 0%, rgba(217, 210, 196, 0) 55%), linear-gradient(155deg, #8F927F 0%, #5B6156 45%, #2A2C26 100%)',
      '--m-ombre': '0 1px 2px rgba(24, 23, 18, 0.05), 0 20px 44px -28px rgba(24, 23, 18, 0.32)',
      '--m-photo-teinte': '#9A9384',
      '--m-photo-voile': '0.30',
    },
  },
  {
    id: 'nocturne',
    libelle: 'Nocturne',
    geste: 'rail',
    variables: {
      '--m-schema': 'dark',
      '--m-fond': '#12161C',
      '--m-fond-2': '#1B212A',
      '--m-texte': '#E9E5DB',
      '--m-texte-sourd': '#ACB3B9',
      '--m-accent': '#D08355',
      '--m-accent-2': '#7B8791',
      '--m-accent-contraste': '#12161C',
      '--m-bord': '#2A313B',
      '--m-titre-famille': 'var(--font-syne), system-ui, sans-serif',
      '--m-corps-famille': 'var(--font-inter-tight), system-ui, sans-serif',
      '--m-titre-graisse': '700',
      '--m-corps-graisse': '300',
      '--m-titre-taille-base': '3.5rem',
      '--m-titre-interligne': '0.98',
      '--m-titre-suivi': '-0.04em',
      '--m-corps-taille-base': '1.25rem',
      '--m-sous-titre-taille-base': '1.125rem',
      '--m-texte-taille-base': '1rem',
      '--m-menu-taille-base': '0.9375rem',
      '--m-legende-taille-base': '0.875rem',
      '--m-chiffre-taille-base': '4rem',
      '--m-rayon': '0.1875rem',
      '--m-rayon-2': '0.375rem',
      '--m-densite-base': '1.1',
      '--m-aplat':
        'radial-gradient(90% 130% at 82% 0%, rgba(208, 131, 85, 0.55) 0%, rgba(208, 131, 85, 0) 62%), linear-gradient(160deg, #2C3A43 0%, #1A2229 48%, #0D1114 100%)',
      '--m-ombre': '0 1px 0 rgba(233, 229, 219, 0.06), 0 18px 40px -24px rgba(0, 0, 0, 0.9)',
      '--m-photo-teinte': '#D08355',
      '--m-photo-voile': '0.42',
    },
  },
  {
    id: 'affiche',
    libelle: 'Affiche',
    geste: 'aplat',
    variables: {
      '--m-schema': 'light',
      '--m-fond': '#F7F2E8',
      '--m-fond-2': '#EDE5D6',
      '--m-texte': '#111014',
      '--m-texte-sourd': '#4E4C55',
      '--m-accent': '#2438C8',
      '--m-accent-2': '#E0563A',
      '--m-accent-contraste': '#F7F2E8',
      '--m-bord': '#DCD3C2',
      '--m-titre-famille': 'var(--font-familjen), system-ui, sans-serif',
      '--m-corps-famille': 'var(--font-familjen), system-ui, sans-serif',
      '--m-titre-graisse': '700',
      '--m-corps-graisse': '400',
      '--m-titre-taille-base': '4rem',
      '--m-titre-interligne': '0.96',
      '--m-titre-suivi': '-0.045em',
      '--m-corps-taille-base': '1.3125rem',
      '--m-sous-titre-taille-base': '1.25rem',
      '--m-texte-taille-base': '1rem',
      '--m-menu-taille-base': '1rem',
      '--m-legende-taille-base': '0.875rem',
      '--m-chiffre-taille-base': '4.5rem',
      '--m-rayon': '0',
      '--m-rayon-2': '0',
      '--m-densite-base': '1.05',
      '--m-aplat':
        'radial-gradient(100% 110% at 12% 0%, #F0C9A2 0%, rgba(240, 201, 162, 0) 58%), linear-gradient(145deg, #8FA0C9 0%, #3C4E92 46%, #1C265C 100%)',
      '--m-ombre': '0 1px 2px rgba(17, 16, 20, 0.06), 0 14px 30px -20px rgba(36, 56, 200, 0.4)',
      '--m-photo-teinte': '#2438C8',
      '--m-photo-voile': '0.34',
    },
  },
] as const

export const STYLE_DEFAUT: StyleId = 'enseigne'

const PAR_ID = new Map(STYLES.map((s) => [s.id, s]))

export function styleParId(id: string): Style | undefined {
  return PAR_ID.get(id as StyleId)
}
