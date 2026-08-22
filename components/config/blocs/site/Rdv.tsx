'use client'

import { HABILLAGE, type Langue } from '@/lib/config/maquette'
import type { Configuration } from '@/lib/config/devis'

export function Rdv({ config, langue }: { config: Configuration; langue: Langue }) {
  if ((config.rdv ?? 0) === 0) return null
  const t = HABILLAGE[langue]

  return (
    <section data-testid="site-rdv" data-endroit="site-rdv" className="animate-construit m-air-serre flex min-w-0 grow basis-full flex-col @min-[500px]/maquette:basis-0">
      <p className="m-surtitre">{t.reserver}</p>
      <div className="flex flex-wrap gap-0.5">
        {t.creneaux.map((h) => (
          <span key={h} data-testid="site-creneau" className="m-puce px-1">
            {h}
          </span>
        ))}
      </div>
    </section>
  )
}
