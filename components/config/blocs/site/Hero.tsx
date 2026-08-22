'use client'

import { editorialDe, type DomaineId } from '@/lib/config/domaines'
import type { Langue } from '@/lib/config/maquette'
import type { Geste } from '@/lib/config/styles'

export function Hero({
  domaine,
  langue,
  geste,
}: {
  domaine: DomaineId
  langue: Langue
  geste: Geste
}) {
  const e = editorialDe(domaine, langue)

  return (
    <>
      {/* Héros : hauteur au contenu, jamais centrée. C'est la place libre en dessous qui
          s'étire, donc cocher une option ne déplace pas le titre. */}
      <div
        {...(geste === 'centre' ? { 'data-testid': 'geste-centre' } : {})}
        className={`flex shrink-0 flex-col gap-1${geste === 'centre' ? ' m-centre' : ''}`}
      >
        <p className="m-surtitre">{e.surtitre}</p>
        <p data-testid="site-titre" className="m-titre">
          {e.titre}
        </p>
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <p data-testid="site-corps" className="m-chapeau max-w-[62ch] flex-1">
            {e.corps}
          </p>
          <span className="m-plein ml-auto shrink-0 px-3 py-0.5">{e.pages[2]}</span>
        </div>
      </div>
    </>
  )
}
