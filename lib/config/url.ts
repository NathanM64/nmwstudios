import { OPTIONS, optionParId } from '@/lib/config/catalogue'
import type { Configuration } from '@/lib/config/devis'

export function encoder(config: Configuration): string {
  return OPTIONS.filter((o) => (config[o.id] ?? 0) > 0)
    .map((o) => (config[o.id] === 1 ? o.id : `${o.id}=${config[o.id]}`))
    .join('&')
}

export function decoder(recherche: string): Configuration {
  const config: Configuration = {}

  for (const [cle, valeur] of new URLSearchParams(recherche)) {
    const option = optionParId(cle)
    if (!option) continue
    const n = valeur === '' ? 1 : Number(valeur)
    if (!Number.isInteger(n) || n <= 0) continue
    config[cle] = option.quantifiable ? Math.min(n, option.quantifiable.max) : n
  }

  return config
}
