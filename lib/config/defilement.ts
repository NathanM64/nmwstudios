import type { AncreId, SceneId } from '@/lib/config/scenes'

/** `vers` est la destination de l'interpolation, explicite et non déduite de l'ordre du
 *  document : trois groupes visent la même ancre, et déduire ferait déborder sur la suivante. */
export type Cible = { ancre: AncreId; vers?: AncreId; progression: number }

export type Mesures = {
  /** Décalage de chaque ancre depuis le haut du rouleau, en pixels logiques. Partiel : un bloc
   *  dont l'option n'est pas retenue n'est pas rendu, donc son ancre n'existe pas. */
  offsets: Partial<Record<AncreId, number>>
  hauteurDocument: number
  hauteurFenetre: number
}

const borner = (valeur: number, bas: number, haut: number) => Math.min(Math.max(valeur, bas), haut)

/** Position la plus basse atteignable : au delà, la fenêtre montrerait du vide sous la
 *  dernière partie. */
export function positionMax(mesures: Mesures): number {
  return Math.max(0, mesures.hauteurDocument - mesures.hauteurFenetre)
}

export function positionCible(cible: Cible, mesures: Mesures): number {
  const depart = mesures.offsets[cible.ancre]
  if (depart === undefined) return 0

  const arrivee = (cible.vers === undefined ? undefined : mesures.offsets[cible.vers]) ?? depart
  const brut = depart + (arrivee - depart) * borner(cible.progression, 0, 1)
  return borner(brut, 0, positionMax(mesures))
}

export function partiesActives(
  bornes: Partial<Record<SceneId, { haut: number; bas: number }>>,
  position: number,
  hauteurFenetre: number
): SceneId[] {
  const bas = position + hauteurFenetre
  return (Object.keys(bornes) as SceneId[]).filter((partie) => {
    const borne = bornes[partie]!
    return borne.bas > position && borne.haut < bas
  })
}

/** Écart de mesure toléré, en pixels logiques. Hauteur de document, hauteur de fenêtre et bornes
 *  des parties passent par trois arrondis différents : le haut de la dernière partie sort de
 *  quelques centièmes de pixel au delà de la position la plus basse. Au delà d'un pixel ce n'est
 *  plus du bruit, c'est une partie plus courte qu'une fenêtre, et rabattre y mentirait. */
const TOLERANCE_MESURE = 1

/** Partie que la fenêtre montre à son bord haut, `position` étant ce bord : c'est elle que le
 *  bandeau nomme, et elle est donc toujours dans la fenêtre.
 *
 *  Un haut hors d'atteinte du bruit de mesure près se rabat sur `max` : sans quoi la page arrivée
 *  en bas nommerait encore l'avant-dernière partie. Le rabattement se compare toujours à
 *  `position` et ne déclare jamais une partie atteinte d'office. */
export function partieAuHaut(
  bornes: Partial<Record<SceneId, { haut: number; bas: number }>>,
  position: number,
  max: number
): SceneId | undefined {
  let trouvee: SceneId | undefined
  for (const partie of Object.keys(bornes) as SceneId[]) {
    const borne = bornes[partie]!
    const haut = borne.haut - max < TOLERANCE_MESURE ? Math.min(borne.haut, max) : borne.haut
    if (haut > position || borne.bas <= position) continue
    if (trouvee === undefined || borne.haut > bornes[trouvee]!.haut) trouvee = partie
  }
  return trouvee
}
