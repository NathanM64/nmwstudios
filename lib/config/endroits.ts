import { type GroupeId } from '@/lib/config/catalogue'
import type { SceneId } from '@/lib/config/scenes'

export type Endroit = {
  id: string
  partie: SceneId
  /** Rendu même sans ses options : repli des endroits conditionnels qui le suivent. */
  permanent?: true
  /** Options visées ici. Chaque option du catalogue est visée exactement une fois. */
  sert: readonly string[]
  /** Groupes du formulaire dont la lecture vise cet endroit. Second axe, déclaré et non dérivé :
   *  « Technique » vise la preuve alors que la livraison accélérée se dessine sur le déroulé. */
  teteDeGroupe?: readonly GroupeId[]
  /** Motif du partage. Obligatoire dès que `sert` porte plus d'une option. */
  partage?: string
}

/** Ordre du document, mesuré par `tests/e2e/document-defilant` et non affirmé ici.
 *  L'endroit déclare les options qu'il sert : le viseur de chaque option s'en dérive. */
const TABLE_BRUTE = [
  { id: 'site-haut', partie: 'site', permanent: true, sert: ['socle'], teteDeGroupe: ['socle'] },
  { id: 'site-navigation', partie: 'site', permanent: true, sert: ['pages', 'langue', 'membre'],
    teteDeGroupe: ['volume'],
    partage: 'l’entête porte la navigation, le sélecteur de langue et le menu de compte ; le lot 3 en sort membre' },
  { id: 'site-contenu', partie: 'site', permanent: true, sert: ['photos', 'visuels'],
    teteDeGroupe: ['contenu'],
    partage: 'les deux options traitent la même image ; le lot 3 les sépare par l’emplacement vide' },
  { id: 'site-reprise', partie: 'site', permanent: true, sert: ['reprise'] },
  { id: 'site-contact', partie: 'site', permanent: true, sert: ['formulaire'], teteDeGroupe: ['fonctionnel'] },
  { id: 'site-newsletter', partie: 'site', sert: ['newsletter'] },
  { id: 'site-rdv', partie: 'site', sert: ['rdv'] },
  { id: 'site-paiement', partie: 'site', sert: ['paiement'] },
  { id: 'site-redaction', partie: 'site', permanent: true, sert: ['redaction'] },
  { id: 'site-actualites', partie: 'site', sert: ['blog', 'article'],
    partage: 'un article se pose dans la section d’actualités qui le porte ; le lot 3 les sépare' },

  { id: 'preuve-haut', partie: 'preuve', permanent: true, sert: [],
    teteDeGroupe: ['visibilite', 'conformite', 'technique'] },
  { id: 'preuve-ligne-seo', partie: 'preuve', permanent: true, sert: ['seo'] },
  { id: 'preuve-ligne-seo-local', partie: 'preuve', permanent: true, sert: ['seo-local'] },
  { id: 'preuve-ligne-perf', partie: 'preuve', permanent: true, sert: ['perf'] },
  { id: 'preuve-ligne-a11y', partie: 'preuve', permanent: true, sert: ['a11y'] },
  { id: 'preuve-ligne-rgpd', partie: 'preuve', permanent: true, sert: ['rgpd'] },
  { id: 'preuve-ligne-legal', partie: 'preuve', permanent: true, sert: ['legal'] },
  { id: 'preuve-ligne-migration', partie: 'preuve', permanent: true, sert: ['migration'] },
  { id: 'preuve-ligne-domaine', partie: 'preuve', permanent: true, sert: ['domaine'] },

  { id: 'deroule-haut', partie: 'deroule', permanent: true, sert: [], teteDeGroupe: ['services'] },
  // Le fantôme est posé `inset-y-0` sur la piste, la barre du cadrage à 32 % de son couloir :
  // l'express se mesure donc plus haut, et le filet d'ordre le constate plutôt que de le croire.
  { id: 'deroule-express', partie: 'deroule', sert: ['express'] },
  { id: 'deroule-cadrage', partie: 'deroule', sert: ['cadrage'] },
  { id: 'deroule-formation', partie: 'deroule', sert: ['formation'] },
  { id: 'deroule-mensuel', partie: 'deroule', permanent: true,
    sert: ['sans-suivi', 'heberg', 'essentiel', 'serenite', 'partenaire'],
    teteDeGroupe: ['recurrent'],
    partage: 'les cinq niveaux d’une même chose, qu’un client compare ; partage définitif, rien ne le défera' },
] as const satisfies readonly Endroit[]

/** Dérivée de la table, jamais écrite à la main : un endroit oublié ne peut plus se glisser
 *  dans l'union et faire viser le vide. */
export type EndroitId = (typeof TABLE_BRUTE)[number]['id']

// `satisfies` ne change pas le type inféré : un champ optionnel absent sort de l'union et sa
// lecture échoue ailleurs. Cette annotation le réintroduit sans élargir les id en `string`.
export const ENDROITS: readonly (Endroit & { id: EndroitId })[] = TABLE_BRUTE

const PAR_ID = new Map(ENDROITS.map((e) => [e.id, e]))
const RANG = new Map(ENDROITS.map((e, i) => [e.id, i]))
const VISEUR = new Map<string, EndroitId>(ENDROITS.flatMap((e) => e.sert.map((o) => [o, e.id])))
const PAR_GROUPE = new Map<GroupeId, EndroitId>(
  ENDROITS.flatMap((e) => (e.teteDeGroupe ?? []).map((g) => [g, e.id]))
)

// `EndroitId` étant dérivée de `TABLE_BRUTE`, tout endroit est ici : pas de repli à prévoir.
export function partieDeEndroit(id: EndroitId): SceneId {
  return PAR_ID.get(id)!.partie
}

/** Tête de chaque partie : son premier endroit, vérifié permanent par le filet unitaire. */
export const ENDROIT_DE_TETE: Record<SceneId, EndroitId> = {
  site: ENDROITS.find((e) => e.partie === 'site')!.id,
  preuve: ENDROITS.find((e) => e.partie === 'preuve')!.id,
  deroule: ENDROITS.find((e) => e.partie === 'deroule')!.id,
}

export function endroitDeOption(id: string): EndroitId {
  return VISEUR.get(id) ?? 'site-haut'
}

// Le filet unitaire exige un endroit permanent pour chacun des neuf groupes : aucun ne manque ici.
export function endroitDuGroupe(groupe: GroupeId): EndroitId {
  return PAR_GROUPE.get(groupe)!
}

export function sceneDeOption(id: string): SceneId {
  return partieDeEndroit(endroitDeOption(id))
}

/** Endroit réellement visable. Un conditionnel absent du document se replie sur le permanent le
 *  plus proche au-dessus de lui, dans sa propre partie : sans ce repli, viser un bloc non acheté
 *  renverrait la page en tête du document. */
export function repliDe(id: EndroitId): EndroitId {
  const endroit = PAR_ID.get(id)!
  if (endroit.permanent) return id
  for (let i = RANG.get(id)! - 1; i >= 0; i--) {
    const amont = ENDROITS[i]
    if (amont.partie === endroit.partie && amont.permanent) return amont.id
  }
  // Inatteignable : le filet unitaire exige un permanent au-dessus de chaque conditionnel.
  throw new Error(`aucun permanent au-dessus de ${id}`)
}
