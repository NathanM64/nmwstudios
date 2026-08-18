import { optionParId, type GroupeId } from '@/lib/config/catalogue'

export type SceneId =
  | 'site' | 'recherche' | 'conformite' | 'technique' | 'exploitation' | 'planning'

/** Le groupe est trop grossier : le référencement se lit dans Google, un article
 *  se lit sur le blog. RGPD et mentions légales restent en conformité malgré leur
 *  rendu sur la page : elles y voisinent le contraste mesuré, un ensemble cohérent. */
const SCENE_PAR_OPTION: Record<string, SceneId> = {
  seo: 'recherche',
  'seo-local': 'recherche',
  legal: 'conformite',
  rgpd: 'conformite',
  a11y: 'conformite',
  migration: 'technique',
  domaine: 'technique',
  perf: 'technique',
  cadrage: 'planning',
  formation: 'planning',
  express: 'planning',
  'sans-suivi': 'exploitation',
  heberg: 'exploitation',
  essentiel: 'exploitation',
  serenite: 'exploitation',
  partenaire: 'exploitation',
}

/** Repli par groupe pour toute option non listée ci-dessus. */
export const SCENE_PAR_GROUPE: Record<GroupeId, SceneId> = {
  socle: 'site',
  volume: 'site',
  contenu: 'site',
  fonctionnel: 'site',
  visibilite: 'site',
  conformite: 'conformite',
  technique: 'technique',
  services: 'planning',
  recurrent: 'exploitation',
}

export const SCENES: readonly { id: SceneId; libelle: string }[] = [
  { id: 'site', libelle: 'Votre site' },
  { id: 'recherche', libelle: 'Dans Google' },
  { id: 'conformite', libelle: 'Conformité' },
  { id: 'technique', libelle: 'Technique' },
  { id: 'planning', libelle: 'Déroulé' },
  { id: 'exploitation', libelle: 'Au quotidien' },
] as const

export function sceneDeOption(id: string): SceneId {
  const explicite = SCENE_PAR_OPTION[id]
  if (explicite) return explicite
  const option = optionParId(id)
  return option ? SCENE_PAR_GROUPE[option.groupe] : 'site'
}
