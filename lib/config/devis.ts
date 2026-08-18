// lib/config/devis.ts
import { type Option, OPTIONS, SOCLE_ID } from '@/lib/config/catalogue'

export type Configuration = Record<string, number>

export type Devis = {
  base: number
  total: number
  bas: number
  haut: number
  mensuel: number
}

export const CONFIG_VIDE: Configuration = {}

/** Quantité effective : plafonnée pour les quantifiables, ramenée à 1 sinon. */
function quantite(option: Option, brute: number): number {
  if (brute <= 0) return 0
  if (!option.quantifiable) return 1
  return Math.min(Math.floor(brute), option.quantifiable.max)
}

export function calculer(config: Configuration): Devis {
  let base = 0
  let mensuel = 0
  let pourcentage = 0

  for (const option of OPTIONS) {
    const n = option.id === SOCLE_ID ? 1 : quantite(option, config[option.id] ?? 0)
    if (n === 0) continue

    if (option.unite === 'mensuel') mensuel += option.prix * n
    else if (option.unite === 'pourcentage') pourcentage += option.prix
    else base += option.prix * n
  }

  const total = Math.round(base * (1 + pourcentage / 100))

  return {
    base,
    total,
    mensuel,
    bas: Math.floor(total / 100) * 100,
    haut: Math.ceil((total * 1.15) / 100) * 100,
  }
}

export function formaterEuros(montant: number): string {
  const chiffres = String(montant).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return `${chiffres} €`
}

/** Prix affiché pour une option selon son unité, quantité prise en compte pour les quantifiables. */
export function suffixePrix(option: Option, quantite = 1): string {
  return option.unite === 'mensuel'
    ? `${formaterEuros(option.prix)}/mois`
    : option.unite === 'pourcentage'
      ? `+${option.prix} %`
      : `+${formaterEuros(option.prix * quantite)}`
}
