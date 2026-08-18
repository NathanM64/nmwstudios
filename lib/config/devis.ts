// lib/config/devis.ts
import { OPTIONS, SOCLE_ID, optionParId } from '@/lib/config/catalogue'

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
function quantite(id: string, brute: number): number {
  const option = optionParId(id)
  if (!option || brute <= 0) return 0
  if (!option.quantifiable) return 1
  return Math.min(Math.floor(brute), option.quantifiable.max)
}

export function calculer(config: Configuration): Devis {
  let base = 0
  let mensuel = 0
  let pourcentage = 0

  for (const option of OPTIONS) {
    const n = option.id === SOCLE_ID ? 1 : quantite(option.id, config[option.id] ?? 0)
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
