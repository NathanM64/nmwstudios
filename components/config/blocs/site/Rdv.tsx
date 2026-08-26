'use client'

import { HABILLAGE, type Langue } from '@/lib/config/maquette'
import { editorialDe, type DomaineId } from '@/lib/config/domaines'
import type { Configuration } from '@/lib/config/devis'

/** Jours ouverts, rangs dans la semaine. Le samedi et le dimanche restent vides : une semaine
 *  entièrement ouverte ne montrerait pas que les jours se distinguent. */
const OUVERTS = [0, 1, 2, 3, 4]

/** Rangs des créneaux déjà pris. Deux, pour que « pris » se lise au pluriel. */
const PRIS = [1, 3]

export function Rdv({
  config,
  domaine,
  langue,
}: {
  config: Configuration
  domaine: DomaineId
  langue: Langue
}) {
  if ((config.rdv ?? 0) === 0) return null
  const t = HABILLAGE[langue]
  const e = editorialDe(domaine, langue)

  return (
    <section
      data-testid="site-rdv"
      data-endroit="site-rdv"
      className="animate-construit m-carte m-air-serre flex min-w-0 shrink-0 flex-col px-2 py-1"
    >
      <p className="m-surtitre">{t.reserver}</p>

      <div className="flex flex-wrap gap-0.5">
        {t.jours.map((jour, i) => (
          <span
            key={jour}
            data-testid="site-jour"
            className={`animate-geste m-mono px-1.5 ${OUVERTS.includes(i) ? 'm-teinte' : 'm-jeton'}`}
            style={{ '--geste-rang': i } as React.CSSProperties}
          >
            {jour}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-0.5">
        {t.creneaux.map((h, i) => (
          <span
            key={h}
            data-testid={PRIS.includes(i) ? 'site-creneau-pris' : 'site-creneau'}
            className={`animate-geste m-puce px-1 ${PRIS.includes(i) ? 'm-barre-texte' : ''}`}
            style={{ '--geste-rang': 7 + i } as React.CSSProperties}
          >
            {h}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <span
          data-testid="site-retenu"
          className="animate-geste m-plein truncate px-2 py-0.5"
          style={{ '--geste-rang': 14 } as React.CSSProperties}
        >
          {t.creneaux[0]} · {e.services[0].nom}
        </span>
        <span className="m-legende">{t.confirmation}</span>
      </div>
    </section>
  )
}
