'use client'

import { HABILLAGE, type Langue } from '@/lib/config/maquette'
import { editorialDe, type DomaineId } from '@/lib/config/domaines'
import type { Configuration } from '@/lib/config/devis'

export function Actualites({
  config,
  domaine,
  langue,
}: {
  config: Configuration
  domaine: DomaineId
  langue: Langue
}) {
  const blog = config.blog ?? 0
  const articles = config.article ?? 0
  if (blog === 0 && articles === 0) return null
  const t = HABILLAGE[langue]
  const e = editorialDe(domaine, langue)

  return (
    <section data-testid="site-blog" data-endroit="site-actualites" className="animate-construit m-air-serre flex shrink-0 flex-col">
      {/* Pleine largeur et 5 colonnes : 10 articles tiennent sur 2 lignes avec des titres
          encore lisibles, ce qu'une demi-colonne ne permettait pas. */}
      <div className="flex items-baseline gap-2">
        <p className="m-surtitre">{t.actualites}</p>
        <span className="m-filet h-px flex-1" />
      </div>
      <div className="grid grid-cols-2 gap-1 @min-[500px]/maquette:grid-cols-3 @min-[700px]/maquette:grid-cols-5">
        {articles > 0
          ? e.articles.slice(0, articles).map((article) => (
              <div key={article.requete} data-testid="site-article" className="m-carte min-w-0 px-1.5">
                <p className="m-corps truncate">{article.titre}</p>
                <p className="m-mono truncate">{article.requete}</p>
              </div>
            ))
          : [0, 1, 2].map((i) => <div key={i} className="m-carte h-6" />)}
      </div>
    </section>
  )
}
