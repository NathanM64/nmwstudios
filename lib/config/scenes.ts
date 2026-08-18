import { optionParId, type GroupeId } from '@/lib/config/catalogue'

export type SceneId = 'site' | 'preuve' | 'deroule'

/** Le groupe est trop grossier : la livraison accélérée est technique par nature
 *  mais ne se démontre que sur une ligne de temps. */
const SCENE_PAR_OPTION: Record<string, SceneId> = {
  seo: 'preuve',
  'seo-local': 'preuve',
  express: 'deroule',
}

export const SCENE_PAR_GROUPE: Record<GroupeId, SceneId> = {
  socle: 'site',
  volume: 'site',
  contenu: 'site',
  fonctionnel: 'site',
  visibilite: 'site',
  conformite: 'preuve',
  technique: 'preuve',
  services: 'deroule',
  recurrent: 'deroule',
}

export const SCENES: readonly { id: SceneId; libelle: string }[] = [
  { id: 'site', libelle: 'Le site' },
  { id: 'preuve', libelle: 'La preuve' },
  { id: 'deroule', libelle: 'Le déroulé' },
] as const

export function sceneDeOption(id: string): SceneId {
  const explicite = SCENE_PAR_OPTION[id]
  if (explicite) return explicite
  const option = optionParId(id)
  return option ? SCENE_PAR_GROUPE[option.groupe] : 'site'
}
