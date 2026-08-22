'use client'

import { HABILLAGE, type Langue } from '@/lib/config/maquette'
import { editorialDe, type DomaineId } from '@/lib/config/domaines'
import type { Configuration } from '@/lib/config/devis'
import type { Geste } from '@/lib/config/styles'

const PAGES_SOCLE = 3

export function Navigation({
  config,
  domaine,
  langue,
  offertes,
  onLangue,
  geste,
}: {
  config: Configuration
  domaine: DomaineId
  langue: Langue
  offertes: readonly Langue[]
  onLangue: (langue: Langue) => void
  geste: Geste
}) {
  const t = HABILLAGE[langue]
  const e = editorialDe(domaine, langue)
  const libelles = e.pages.slice(0, PAGES_SOCLE + (config.pages ?? 0) * 3)

  return (
    <>
      {geste === 'bandeau' && <div data-testid="geste-bandeau" className="m-bandeau" />}
      {geste === 'aplat' && <div data-testid="geste-aplat" className="m-aplat-tete" />}
      <header data-endroit="site-navigation" className="flex min-w-0 items-baseline gap-3">
        <span data-testid="site-enseigne" className="m-enseigne shrink-0">
          {e.enseigne}
        </span>
        <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-x-3 gap-y-0.5">
          <nav data-testid="site-nav">
            <ul className="flex flex-wrap justify-end gap-x-2 gap-y-0.5">
              {libelles.map((page) => (
                <li key={page} className="animate-glisse m-menu">
                  {page}
                </li>
              ))}
            </ul>
          </nav>
          {offertes.length > 1 && (
            <select
              data-testid="site-langue"
              value={langue}
              onChange={(evenement) => onLangue(evenement.target.value as Langue)}
              aria-label="Langue de l’aperçu"
              className="animate-glisse m-select px-1"
            >
              {offertes.map((code) => (
                <option key={code} value={code}>
                  {code.toUpperCase()}
                </option>
              ))}
            </select>
          )}
          {(config.membre ?? 0) > 0 && (
            <span data-testid="site-connexion" className="animate-glisse m-puce px-1.5">
              {t.connexion}
            </span>
          )}
        </div>
      </header>

      <span data-testid="site-filet" className="m-filet h-px w-full shrink-0" />
    </>
  )
}
