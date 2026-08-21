import { optionParId, type GroupeId } from '@/lib/config/catalogue'

export type SceneId = 'site' | 'preuve' | 'deroule'

export const SCENES: readonly { id: SceneId; libelle: string }[] = [
  { id: 'site', libelle: 'Le site' },
  { id: 'preuve', libelle: 'La preuve' },
  { id: 'deroule', libelle: 'Le déroulé' },
] as const

/** Ordre du document, vérifié contre les décalages publiés par `tests/e2e/document-defilant`.
 *  Cette liste ne dit pas où va l'interpolation : la destination est posée par `Cible.vers`. */
export const ANCRES = [
  { id: 'site-haut', partie: 'site' },
  { id: 'site-navigation', partie: 'site' },
  { id: 'site-contenu', partie: 'site' },
  { id: 'site-contact', partie: 'site' },
  { id: 'site-actualites', partie: 'site' },
  { id: 'preuve-haut', partie: 'preuve' },
  { id: 'deroule-haut', partie: 'deroule' },
  { id: 'deroule-mensuel', partie: 'deroule' },
] as const satisfies readonly { id: string; partie: SceneId }[]

/** Dérivée de la liste, jamais écrite à la main : une ancre oubliée dans `ANCRES` ne peut plus
 *  se glisser dans l'union et faire interpoler vers la mauvaise partie. */
export type AncreId = (typeof ANCRES)[number]['id']

/** Ancre de tête de chaque partie, celle que porte l'enveloppe. Écrite et non concaténée : un
 *  identifiant fabriqué au gabarit échappe au contrôle de type. */
export const ANCRE_DE_TETE: Record<SceneId, AncreId> = {
  site: 'site-haut',
  preuve: 'preuve-haut',
  deroule: 'deroule-haut',
}

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

// `AncreId` étant dérivée de `ANCRES`, toute ancre est ici : pas de repli à prévoir.
const PARTIE = new Map<AncreId, SceneId>(ANCRES.map((a) => [a.id, a.partie]))

export function partieDeAncre(ancre: AncreId): SceneId {
  return PARTIE.get(ancre)!
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
