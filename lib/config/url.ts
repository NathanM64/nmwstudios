import { GROUPES, OPTIONS, optionParId } from '@/lib/config/catalogue'
import type { Configuration } from '@/lib/config/devis'

const GROUPES_EXCLUSIFS = new Set(GROUPES.filter((g) => g.exclusif).map((g) => g.id))

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
    // Un groupe exclusif ne garde que la dernière option lue : deux formules cumulées feraient
    // diverger le prix, la bande mensuelle et le bouton coché, chacun sur sa propre réponse.
    if (GROUPES_EXCLUSIFS.has(option.groupe)) {
      for (const autre of OPTIONS) if (autre.groupe === option.groupe) delete config[autre.id]
    }
    // Une option non quantifiable vaut toujours un : sinon un lien trafiqué affiche un delta que le moteur ne facture pas.
    config[cle] = option.quantifiable ? Math.min(n, option.quantifiable.max) : 1
  }

  return config
}
