'use client'

import { memo, useState } from 'react'
import type { Configuration } from '@/lib/config/devis'
import { HABILLAGE, LANGUES, type Langue } from '@/lib/config/maquette'
import { DOMAINE_REPLI, editorialDe, type DomaineId } from '@/lib/config/domaines'
import type { Geste } from '@/lib/config/styles'
import { Navigation } from '@/components/config/blocs/site/Navigation'
import { Hero } from '@/components/config/blocs/site/Hero'
import { Photo } from '@/components/config/blocs/site/Photo'
import { Services } from '@/components/config/blocs/site/Services'

export const SceneSite = memo(function SceneSite({
  config,
  domaine = DOMAINE_REPLI,
  geste,
}: {
  config: Configuration
  domaine?: DomaineId
  geste: Geste
}) {
  const langues = config.langue ?? 0
  const redaction = config.redaction ?? 0
  const reprise = config.reprise ?? 0
  const blog = config.blog ?? 0
  const articles = config.article ?? 0
  const formulaire = config.formulaire ?? 0
  const rdv = config.rdv ?? 0
  const newsletter = config.newsletter ?? 0
  const paiement = config.paiement ?? 0
  const [langue, setLangue] = useState<Langue>('fr')

  // Une langue de plus par unité achetée. La langue affichée est retenue seulement si elle
  // est encore payée : retirer l'option ne laisse pas la maquette bloquée en anglais.
  const offertes = LANGUES.slice(0, Math.min(langues, LANGUES.length - 1) + 1)
  const active = offertes.includes(langue) ? langue : 'fr'
  const t = HABILLAGE[active]
  const e = editorialDe(domaine, active)

  return (
    <div className="animate-apparait m-contenu flex min-w-0 flex-1">
      {geste === 'rail' && (
        <div data-testid="geste-rail" className="m-rail shrink-0">
          <span className="m-rail-nom">{e.enseigne}</span>
        </div>
      )}
      <div className="m-air m-marge flex min-w-0 flex-1 flex-col">
      <Navigation
        config={config}
        domaine={domaine}
        langue={active}
        offertes={offertes}
        onLangue={setLangue}
        geste={geste}
      />

      <Hero domaine={domaine} langue={active} geste={geste} />

      <div className="m-air flex min-h-0 flex-1 flex-col">
        {/* Bande haute : l'aplat prend la hauteur libre, les services prennent la leur.
            Aucun centrage, donc aucune bande vide, et rien ne se comprime sous son contenu. */}
        <Photo config={config} domaine={domaine} langue={active} />

        <div className="m-air flex shrink-0 flex-col">
        <Services domaine={domaine} langue={active} />

        {/* Bande de services achetés : chaque carte prend sa part de la largeur, ou toute la
            ligne si ses voisines sont absentes. Conditions indépendantes, aucune cascade. */}
        <div data-testid="site-bande" className="m-air flex shrink-0 flex-wrap items-stretch">
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

          {newsletter > 0 && (
            <section data-testid="site-newsletter" data-endroit="site-newsletter" className="animate-construit m-carte flex min-w-0 grow basis-full items-center gap-1.5 px-2 py-1.5 @min-[500px]/maquette:basis-0">
              <span className="m-champ h-3 min-w-0 flex-1" />
              <span className="m-plein shrink-0 px-1.5">{t.inscrire}</span>
            </section>
          )}

          {rdv > 0 && (
            <section data-testid="site-rdv" data-endroit="site-rdv" className="animate-construit m-air-serre flex min-w-0 grow basis-full flex-col @min-[500px]/maquette:basis-0">
              <p className="m-surtitre">{t.reserver}</p>
              <div className="flex flex-wrap gap-0.5">
                {t.creneaux.map((h) => (
                  <span key={h} data-testid="site-creneau" className="m-puce px-1">
                    {h}
                  </span>
                ))}
              </div>
            </section>
          )}

          {paiement > 0 && (
            <section data-testid="site-paiement" data-endroit="site-paiement" className="animate-construit m-carte flex min-w-0 grow basis-full items-center justify-between gap-2 px-2 py-1.5 @min-[500px]/maquette:basis-0">
              <span className="m-corps truncate">{t.regler}</span>
              <span className="flex shrink-0 gap-1">
                {/* Logos dessinés, aucune marque reproduite. */}
                <span className="m-jeton h-2 w-4" />
                <span className="m-jeton h-2 w-4" />
              </span>
            </section>
          )}
        </div>

        {/* Rédaction et reprise se cumulent : aucune ne dépend de l'autre pour s'afficher. */}
        {(redaction > 0 || reprise > 0) && (
          <div className="m-air-serre flex shrink-0 flex-col">
            {redaction > 0 && (
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
            )}

            {reprise > 0 && (
              <ul data-testid="site-reprise" data-endroit="site-reprise" className="animate-construit flex flex-wrap gap-1">
                {e.blocsRepris.map((bloc) => (
                  <li key={bloc} className="m-puce px-1.5">
                    {bloc}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {(blog > 0 || articles > 0) && (
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
        )}
        </div>

        {geste === 'bande' && <div data-testid="geste-bande" className="m-bande shrink-0" />}
      </div>
      </div>
    </div>
  )
})
