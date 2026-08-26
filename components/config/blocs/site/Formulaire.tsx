'use client'

import { HABILLAGE, type Langue } from '@/lib/config/maquette'
import { editorialDe, type DomaineId } from '@/lib/config/domaines'
import type { Configuration } from '@/lib/config/devis'

export function Formulaire({
  config,
  domaine,
  langue,
}: {
  config: Configuration
  domaine: DomaineId
  langue: Langue
}) {
  const avance = (config.formulaire ?? 0) > 0
  const t = HABILLAGE[langue]
  const e = editorialDe(domaine, langue)
  const dernier = t.etapes.length - 1

  return (
    <section
      data-testid="site-formulaire"
      data-endroit="site-contact"
      className="m-carte m-air-serre flex min-w-0 shrink-0 flex-col px-2 py-1"
    >
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <p className="m-surtitre">{e.blocsRepris[2]}</p>
        {avance && (
          <div className="flex flex-wrap items-baseline gap-1">
            {t.etapes.map((etape, i) => (
              <span
                key={etape}
                data-testid="site-etape"
                {...(i === dernier ? { 'data-etape-active': 'oui' } : {})}
                className={`animate-geste m-mono px-1.5 ${i === dernier ? 'm-plein' : 'm-jeton'}`}
                style={{ '--geste-rang': i } as React.CSSProperties}
              >
                {etape}
              </span>
            ))}
          </div>
        )}
      </div>

      {avance && (
        <p
          data-testid="site-conditionnel"
          className="animate-geste m-legende"
          style={{ '--geste-rang': 3 } as React.CSSProperties}
        >
          {t.question} <span className="m-accent">{t.reponse}</span>
        </p>
      )}

      <div className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span key={i} data-testid="site-champ" className="m-champ h-3 min-w-0 flex-1" />
        ))}
        <span className="m-plein shrink-0 px-2 py-0.5">{t.envoyer}</span>
      </div>

      {avance && (
        <p
          data-testid="site-piece"
          className="animate-geste m-puce self-start px-1.5"
          style={{ '--geste-rang': 4 } as React.CSSProperties}
        >
          {t.fichier}
        </p>
      )}
    </section>
  )
}
