export const AUDIENCE_COOKIE = 'nmw-audience'
export const AUDIENCE_MAX_AGE = 60 * 60 * 24 * 90

export type Audience = 'entreprise' | 'agence'

export const AUDIENCES = [
  { id: 'entreprise', label: 'Entreprise', href: '/' },
  { id: 'agence', label: 'Agence', href: '/agences' },
] as const satisfies readonly { id: Audience; label: string; href: string }[]
