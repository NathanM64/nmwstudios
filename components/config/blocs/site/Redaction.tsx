'use client'

import { HABILLAGE, type Langue } from '@/lib/config/maquette'
import { editorialDe, type DomaineId } from '@/lib/config/domaines'
import type { Configuration } from '@/lib/config/devis'

export function Redaction({
  config,
  domaine,
  langue,
}: {
  config: Configuration
  domaine: DomaineId
  langue: Langue
}) {
  const redaction = config.redaction ?? 0
  if (redaction === 0) return null
  const t = HABILLAGE[langue]
  const e = editorialDe(domaine, langue)

  return (
    <div data-testid="site-texte" className="animate-construit flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <span className="m-surtitre">{t.redigees}</span>
      {/* Une page nommée par unité : sans elle, quinze pages rédigées rendent le même écran qu'une. */}
      <span data-testid="site-redaction" data-endroit="site-redaction" className="flex min-w-0 flex-1 basis-0 flex-wrap items-baseline gap-1">
        {e.pages.slice(0, redaction).map((page) => (
          <span key={page} data-testid="site-page-redigee" className="animate-glisse m-puce px-1.5">
            {page}
          </span>
        ))}
      </span>
    </div>
  )
}
