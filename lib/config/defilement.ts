import { partieDeAncre, type AncreId, type SceneId } from '@/lib/config/scenes'

/** `vers` est la destination de l'interpolation, explicite et non déduite de l'ordre du
 *  document : trois groupes visent la même ancre, et déduire ferait déborder sur la suivante. */
export type Cible = { ancre: AncreId; vers?: AncreId; progression: number }

/** Haut et bas de chaque partie, en pixels logiques depuis le haut du rouleau. Partiel pour la
 *  même raison que les décalages : une partie non rendue n'a pas de bornes. */
export type Bornes = Partial<Record<SceneId, { haut: number; bas: number }>>

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
function positionMax(mesures: Mesures): number {
  return Math.max(0, mesures.hauteurDocument - mesures.hauteurFenetre)
}

export function positionCible(cible: Cible, mesures: Mesures, bornes: Bornes): number {
  const depart = mesures.offsets[cible.ancre]
  if (depart === undefined) return 0

  // Lecture : interpolation vers l'ancre du groupe suivant, sans borne de partie. La borner
  // figerait le parcours à la fin d'une partie, et la suivante ne serait jamais atteinte.
  if (cible.vers !== undefined) {
    const arrivee = mesures.offsets[cible.vers] ?? depart
    const brut = depart + (arrivee - depart) * borner(cible.progression, 0, 1)
    return borner(brut, 0, positionMax(mesures))
  }

  // Pose : jamais au delà de la fin de la partie visée. Une partie vaut au moins une fenêtre,
  // et poser un repère bas y ferait entrer la partie d'après.
  const borne = bornes[partieDeAncre(cible.ancre)]
  const plancher = borne === undefined ? 0 : borne.haut
  const plafond = borne === undefined ? depart : Math.max(borne.haut, borne.bas - mesures.hauteurFenetre)
  return borner(borner(depart, plancher, plafond), 0, positionMax(mesures))
}

export function partiesActives(
  bornes: Bornes,
  position: number,
  hauteurFenetre: number
): SceneId[] {
  const bas = position + hauteurFenetre
  return (Object.keys(bornes) as SceneId[]).filter((partie) => {
    const borne = bornes[partie]!
    return borne.bas > position && borne.haut < bas
  })
}
