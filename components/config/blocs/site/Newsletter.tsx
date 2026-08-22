'use client'

import { HABILLAGE, type Langue } from '@/lib/config/maquette'
import type { Configuration } from '@/lib/config/devis'

export function Newsletter({ config, langue }: { config: Configuration; langue: Langue }) {
  if ((config.newsletter ?? 0) === 0) return null
  const t = HABILLAGE[langue]

  return (
    <section data-testid="site-newsletter" data-endroit="site-newsletter" className="animate-construit m-carte flex min-w-0 grow basis-full items-center gap-1.5 px-2 py-1.5 @min-[500px]/maquette:basis-0">
      <span className="m-champ h-3 min-w-0 flex-1" />
      <span className="m-plein shrink-0 px-1.5">{t.inscrire}</span>
    </section>
  )
}
