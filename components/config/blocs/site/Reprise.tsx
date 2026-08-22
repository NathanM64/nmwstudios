'use client'

import { editorialDe, type DomaineId } from '@/lib/config/domaines'
import type { Langue } from '@/lib/config/maquette'
import type { Configuration } from '@/lib/config/devis'

export function Reprise({
  config,
  domaine,
  langue,
}: {
  config: Configuration
  domaine: DomaineId
  langue: Langue
}) {
  if ((config.reprise ?? 0) === 0) return null
  const e = editorialDe(domaine, langue)

  return (
    <ul data-testid="site-reprise" data-endroit="site-reprise" className="animate-construit flex flex-wrap gap-1">
      {e.blocsRepris.map((bloc) => (
        <li key={bloc} className="m-puce px-1.5">
          {bloc}
        </li>
      ))}
    </ul>
  )
}
