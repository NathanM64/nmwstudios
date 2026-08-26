'use client'

import { HABILLAGE, PAGES_SOCLE, type Langue } from '@/lib/config/maquette'
import { editorialDe, type DomaineId } from '@/lib/config/domaines'
import type { Configuration } from '@/lib/config/devis'

function Provenance({ repere, surtitre, pages }: { repere: string; surtitre: string; pages: string[] }) {
  return (
    <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <span className="m-surtitre shrink-0">{surtitre}</span>
      <span className="flex min-w-0 flex-1 basis-0 flex-wrap items-baseline gap-1">
        {pages.map((page) => (
          <span key={page} data-testid={repere} className="animate-glisse m-puce px-1.5">
            {page}
          </span>
        ))}
      </span>
    </div>
  )
}

export function Redaction({
  config,
  domaine,
  langue,
}: {
  config: Configuration
  domaine: DomaineId
  langue: Langue
}) {
  const t = HABILLAGE[langue]
  const e = editorialDe(domaine, langue)
  const total = PAGES_SOCLE + (config.pages ?? 0) * 3
  // Les pages achetées se prennent en tête du site. Au delà de son volume, une unité de plus
  // n'a plus de page à nommer : la maquette montre ce que le site porte, pas ce qui est facturé.
  const redigees = Math.min(config.redaction ?? 0, total)
  const pages = e.pages.slice(0, total)

  return (
    <div
      data-testid="site-texte"
      data-endroit="site-redaction"
      className="m-air-serre flex min-w-0 shrink-0 flex-col gap-y-0.5"
    >
      {redigees < total && (
        <Provenance repere="site-page-fournie" surtitre={t.fournies} pages={pages.slice(redigees)} />
      )}
      {redigees > 0 && (
        <Provenance repere="site-page-redigee" surtitre={t.redigees} pages={pages.slice(0, redigees)} />
      )}
    </div>
  )
}
