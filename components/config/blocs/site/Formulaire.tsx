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
  const formulaire = config.formulaire ?? 0
  const t = HABILLAGE[langue]
  const e = editorialDe(domaine, langue)

  return (
    <section data-testid="site-formulaire" data-endroit="site-contact" className="m-carte m-air-serre flex min-w-0 grow-[1.6] basis-full flex-col px-2 py-1 @min-[500px]/maquette:basis-0">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <p className="m-surtitre">{e.blocsRepris[2]}</p>
        {formulaire > 0 && (
          <div data-testid="site-etapes" className="animate-construit flex gap-1">
            {[1, 2, 3].map((n) => (
              <span key={n} className="m-jeton m-mono px-1.5">
                {n}
              </span>
            ))}
          </div>
        )}
        {formulaire > 0 && <p className="animate-construit m-legende">{t.pieceJointe}</p>}
      </div>
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span key={i} data-testid="site-champ" className="m-champ h-3 min-w-0 flex-1" />
        ))}
        <span className="m-plein shrink-0 px-2 py-0.5">{t.envoyer}</span>
      </div>
    </section>
  )
}
