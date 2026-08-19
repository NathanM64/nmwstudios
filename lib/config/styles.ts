export type StyleId = 'editorial' | 'franc' | 'premium'

export type Style = {
  id: StyleId
  libelle: string
  variables: Record<string, string>
}

/** Préfixe `--m-` : la maquette ne doit jamais hériter d'un jeton du site, ni le polluer.
 *  Les valeurs littérales vivent ici et nulle part ailleurs, c'est ce qui rend un
 *  quatrième style gratuit. Plancher de taille à 0,75 rem : sous cette valeur le texte
 *  rendu passe sous les 10 px que `tests/e2e/apercu-forme.spec.ts` exige. */
export const STYLES: readonly Style[] = [
  {
    id: 'editorial',
    libelle: 'Éditorial',
    variables: {
      '--m-fond': '#faf8f5',
      '--m-fond-2': '#f0ece5',
      '--m-texte': '#1a1a19',
      '--m-texte-sourd': '#55524b',
      '--m-accent': '#7d5a34',
      '--m-accent-2': '#9c6b3a',
      '--m-accent-contraste': '#faf8f5',
      '--m-bord': '#e4e0d9',
      '--m-titre-famille': "Georgia, 'Times New Roman', serif",
      '--m-corps-famille': 'var(--font-sans)',
      '--m-titre-graisse': '400',
      '--m-corps-graisse': '400',
      '--m-titre-taille': '2.9rem',
      '--m-titre-interligne': '1.02',
      '--m-titre-suivi': '-0.015em',
      '--m-corps-taille': '1.0625rem',
      '--m-sous-titre-taille': '1.0625rem',
      '--m-texte-taille': '0.875rem',
      '--m-menu-taille': '0.875rem',
      '--m-legende-taille': '0.8125rem',
      '--m-chiffre-taille': '3.25rem',
      '--m-rayon': '0.125rem',
      '--m-rayon-2': '0.25rem',
      '--m-densite': '1.15',
      '--m-aplat': 'radial-gradient(90% 80% at 18% 10%, #cc9055 0%, rgba(204, 144, 85, 0) 62%), linear-gradient(158deg, #a2673a 0%, #7d5a34 52%, #46372a 100%)',
      '--m-ombre': '0 1px 2px rgba(38, 30, 20, 0.06), 0 14px 32px -20px rgba(38, 30, 20, 0.35)',
    },
  },
  {
    id: 'franc',
    libelle: 'Franc',
    variables: {
      '--m-fond': '#fffefc',
      '--m-fond-2': '#eef2f9',
      '--m-texte': '#14161a',
      '--m-texte-sourd': '#565b63',
      '--m-accent': '#2b3f8f',
      '--m-accent-2': '#3f63d6',
      '--m-accent-contraste': '#ffffff',
      '--m-bord': '#e4e8ef',
      '--m-titre-famille': 'var(--font-sans)',
      '--m-corps-famille': 'var(--font-sans)',
      '--m-titre-graisse': '600',
      '--m-corps-graisse': '400',
      '--m-titre-taille': '2.6rem',
      '--m-titre-interligne': '1.06',
      '--m-titre-suivi': '-0.03em',
      '--m-corps-taille': '1.0625rem',
      '--m-sous-titre-taille': '1rem',
      '--m-texte-taille': '0.875rem',
      '--m-menu-taille': '0.875rem',
      '--m-legende-taille': '0.8125rem',
      '--m-chiffre-taille': '3rem',
      '--m-rayon': '0.75rem',
      '--m-rayon-2': '1.125rem',
      '--m-densite': '1',
      '--m-aplat': 'radial-gradient(80% 72% at 78% 14%, #7c9bff 0%, rgba(124, 155, 255, 0) 62%), linear-gradient(150deg, #4069e0 0%, #2b3f8f 58%, #121a48 100%)',
      '--m-ombre': '0 1px 2px rgba(20, 24, 40, 0.05), 0 16px 34px -22px rgba(20, 24, 40, 0.34)',
    },
  },
  {
    id: 'premium',
    libelle: 'Premium',
    variables: {
      '--m-fond': '#121415',
      '--m-fond-2': '#1c1f20',
      '--m-texte': '#eef0f0',
      '--m-texte-sourd': '#a8b0af',
      '--m-accent': '#d9a441',
      '--m-accent-2': '#b98a35',
      '--m-accent-contraste': '#121415',
      '--m-bord': 'rgba(238, 240, 240, 0.14)',
      '--m-titre-famille': 'var(--font-sans)',
      '--m-corps-famille': 'var(--font-sans)',
      '--m-titre-graisse': '300',
      '--m-corps-graisse': '300',
      '--m-titre-taille': '2.8rem',
      '--m-titre-interligne': '1.04',
      '--m-titre-suivi': '-0.02em',
      '--m-corps-taille': '1.0625rem',
      '--m-sous-titre-taille': '1.0625rem',
      '--m-texte-taille': '0.875rem',
      '--m-menu-taille': '0.875rem',
      '--m-legende-taille': '0.8125rem',
      '--m-chiffre-taille': '3.5rem',
      '--m-rayon': '0.1875rem',
      '--m-rayon-2': '0.375rem',
      '--m-densite': '1.1',
      '--m-aplat': 'radial-gradient(72% 62% at 24% 8%, #9c7833 0%, rgba(156, 120, 51, 0) 60%), linear-gradient(155deg, #3d3221 0%, #211c14 56%, #14110d 100%)',
      '--m-ombre': '0 1px 0 rgba(238, 240, 240, 0.06), 0 18px 40px -24px rgba(0, 0, 0, 0.9)',
    },
  },
] as const

export const STYLE_DEFAUT: StyleId = 'editorial'

const PAR_ID = new Map(STYLES.map((s) => [s.id, s]))

export function styleParId(id: string): Style | undefined {
  return PAR_ID.get(id as StyleId)
}
