'use client'

import { editorialDe, type DomaineId } from '@/lib/config/domaines'
import type { Langue } from '@/lib/config/maquette'

export function Services({ domaine, langue }: { domaine: DomaineId; langue: Langue }) {
  const e = editorialDe(domaine, langue)

  return (
    <div data-testid="site-services" className="m-air grid shrink-0 grid-cols-1 @min-[500px]/maquette:grid-cols-3">
      {e.services.map((service, i) => (
        <div key={service.nom} data-testid="site-service" className="m-filet-haut flex min-w-0 gap-2 pt-1">
          <span className="m-mono shrink-0">{String(i + 1).padStart(2, '0')}</span>
          <div className="min-w-0">
            <p className="m-sous-titre truncate">{service.nom}</p>
            <p className="m-legende">{service.texte}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
