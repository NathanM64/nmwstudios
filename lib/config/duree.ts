import { OPTIONS, SOCLE_ID, optionParId } from '@/lib/config/catalogue'
import type { Configuration } from '@/lib/config/devis'

/** Nathan ne consacre pas ses cinq jours ouvrés à un seul projet. Valeur à confirmer. */
const JOURS_PAR_SEMAINE = 4

/** La livraison accélérée retire 30 % du délai de construction, en miroir des 30 % de prix. */
const FACTEUR_EXPRESS = 0.7

const HORS_CONSTRUCTION = new Set(['cadrage', 'formation'])

export type Deroule = {
  cadrage: number
  construction: number
  constructionSansExpress: number
  formation: number
  livraison: number
  livraisonSansExpress: number
  total: number
}

function semaines(jours: number): number {
  return jours / JOURS_PAR_SEMAINE
}

function quantite(id: string, config: Configuration): number {
  const option = optionParId(id)
  if (!option) return 0
  if (id === SOCLE_ID) return 1
  const brute = config[id] ?? 0
  if (brute <= 0) return 0
  return option.quantifiable ? Math.min(Math.floor(brute), option.quantifiable.max) : 1
}

export function calculerDeroule(config: Configuration): Deroule {
  let jours = 0
  for (const option of OPTIONS) {
    if (HORS_CONSTRUCTION.has(option.id)) continue
    jours += option.jours * quantite(option.id, config)
  }

  const constructionSansExpress = semaines(jours)
  const presse = (config.express ?? 0) > 0
  const construction = presse ? constructionSansExpress * FACTEUR_EXPRESS : constructionSansExpress

  const cadrage = semaines(optionParId('cadrage')!.jours * quantite('cadrage', config))
  const formation = semaines(optionParId('formation')!.jours * quantite('formation', config))

  const livraison = cadrage + construction
  const livraisonSansExpress = cadrage + constructionSansExpress

  return {
    cadrage,
    construction,
    constructionSansExpress,
    formation,
    livraison,
    livraisonSansExpress,
    total: Math.max(livraisonSansExpress, livraison + formation),
  }
}
