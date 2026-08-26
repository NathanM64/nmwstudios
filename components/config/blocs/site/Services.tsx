'use client'

import { editorialDe, type DomaineId } from '@/lib/config/domaines'
import type { Langue } from '@/lib/config/maquette'
import type { Configuration } from '@/lib/config/devis'

export function Services({
  config,
  domaine,
  langue,
}: {
  config: Configuration
  domaine: DomaineId
  langue: Langue
}) {
  const e = editorialDe(domaine, langue)

  // Sans reprise, les trois textes coulent tels qu'un client les envoie : un pavé sans intertitre
  // ni séparation. Les mots sont les mêmes des deux côtés, seule leur structure change.
  if ((config.reprise ?? 0) === 0) {
    return (
      <div data-testid="site-services" data-endroit="site-reprise" className="m-air shrink-0">
        <p data-testid="site-services-pave" className="m-legende">
          {e.services.map((service) => service.texte).join(' ')}
        </p>
      </div>
    )
  }

  return (
    <div
      data-testid="site-services"
      data-endroit="site-reprise"
      className="m-air grid shrink-0 grid-cols-1 @min-[500px]/maquette:grid-cols-3"
    >
      {e.services.map((service, i) => (
        <div
          key={service.nom}
          data-testid="site-service"
          className="animate-construit m-filet-haut flex min-w-0 gap-2 pt-1"
        >
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
