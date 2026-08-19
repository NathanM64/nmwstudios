import { optionParId, type GroupeId } from '@/lib/config/catalogue'

export type SceneId = 'site' | 'preuve' | 'deroule'

export const SCENES: readonly { id: SceneId; libelle: string }[] = [
  { id: 'site', libelle: 'Le site' },
  { id: 'preuve', libelle: 'La preuve' },
  { id: 'deroule', libelle: 'Le déroulé' },
] as const

export type AncreId =
  | 'site-haut'
  | 'site-navigation'
  | 'site-contenu'
  | 'site-actualites'
  | 'site-contact'
  | 'preuve-haut'
  | 'deroule-haut'
  | 'deroule-mensuel'

/** Ordre du document. L'interpolation va d'une ancre à la suivante de cette liste. */
export const ANCRES: readonly { id: AncreId; partie: SceneId }[] = [
  { id: 'site-haut', partie: 'site' },
  { id: 'site-navigation', partie: 'site' },
  { id: 'site-contenu', partie: 'site' },
  { id: 'site-actualites', partie: 'site' },
  { id: 'site-contact', partie: 'site' },
  { id: 'preuve-haut', partie: 'preuve' },
  { id: 'deroule-haut', partie: 'deroule' },
  { id: 'deroule-mensuel', partie: 'deroule' },
] as const

export const ANCRE_PAR_GROUPE: Record<GroupeId, AncreId> = {
  socle: 'site-haut',
  volume: 'site-navigation',
  contenu: 'site-contenu',
  fonctionnel: 'site-contact',
  visibilite: 'preuve-haut',
  conformite: 'preuve-haut',
  technique: 'preuve-haut',
  services: 'deroule-haut',
  recurrent: 'deroule-mensuel',
}

/** Le groupe est trop grossier : un article se voit dans les actualités du site alors que son
 *  groupe vise le rapport, et la livraison accélérée est technique mais ne se démontre que sur
 *  une ligne de temps. */
const ANCRE_PAR_OPTION: Partial<Record<string, AncreId>> = {
  blog: 'site-actualites',
  article: 'site-actualites',
  membre: 'site-navigation',
  seo: 'preuve-haut',
  'seo-local': 'preuve-haut',
  express: 'deroule-haut',
}

const PARTIE = new Map(ANCRES.map((a) => [a.id, a.partie]))

export function partieDeAncre(ancre: AncreId): SceneId {
  return PARTIE.get(ancre) ?? 'site'
}

export function premiereAncreDe(partie: SceneId): AncreId {
  return (ANCRES.find((a) => a.partie === partie) ?? ANCRES[0]).id
}

export function ancreDeOption(id: string): AncreId {
  const explicite = ANCRE_PAR_OPTION[id]
  if (explicite) return explicite
  const option = optionParId(id)
  return option ? ANCRE_PAR_GROUPE[option.groupe] : 'site-haut'
}

export function sceneDeOption(id: string): SceneId {
  return partieDeAncre(ancreDeOption(id))
}
