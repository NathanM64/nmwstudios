export type SceneId = 'site' | 'preuve' | 'deroule'

export const SCENES: readonly { id: SceneId; libelle: string }[] = [
  { id: 'site', libelle: 'Le site' },
  { id: 'preuve', libelle: 'La preuve' },
  { id: 'deroule', libelle: 'Le déroulé' },
] as const
