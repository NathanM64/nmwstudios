'use client'

import { HABILLAGE, type Langue } from '@/lib/config/maquette'
import type { Configuration } from '@/lib/config/devis'

export function Paiement({ config, langue }: { config: Configuration; langue: Langue }) {
  if ((config.paiement ?? 0) === 0) return null
  const t = HABILLAGE[langue]

  return (
    <section data-testid="site-paiement" data-endroit="site-paiement" className="animate-construit m-carte flex min-w-0 grow basis-full items-center justify-between gap-2 px-2 py-1.5 @min-[500px]/maquette:basis-0">
      <span className="m-corps truncate">{t.regler}</span>
      <span className="flex shrink-0 gap-1">
        {/* Logos dessinés, aucune marque reproduite. */}
        <span className="m-jeton h-2 w-4" />
        <span className="m-jeton h-2 w-4" />
      </span>
    </section>
  )
}
