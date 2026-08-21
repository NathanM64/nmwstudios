'use client'

import { memo, useState } from 'react'
import type { Configuration } from '@/lib/config/devis'
import { HABILLAGE, LANGUES, type Langue } from '@/lib/config/maquette'
import { DOMAINE_REPLI, editorialDe, type DomaineId } from '@/lib/config/domaines'
import type { Geste } from '@/lib/config/styles'

const PAGES_SOCLE = 3

export const SceneSite = memo(function SceneSite({
  config,
  domaine = DOMAINE_REPLI,
  geste,
}: {
  config: Configuration
  domaine?: DomaineId
  geste: Geste
}) {
  const tranches = config.pages ?? 0
  const langues = config.langue ?? 0
  const redaction = config.redaction ?? 0
  const reprise = config.reprise ?? 0
  const photos = config.photos ?? 0
  const visuels = config.visuels ?? 0
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
  const libelles = e.pages.slice(0, PAGES_SOCLE + tranches * 3)

  return (
    <div className="animate-apparait m-contenu flex min-w-0 flex-1">
      {geste === 'rail' && (
        <div data-testid="geste-rail" className="m-rail shrink-0">
          <span className="m-rail-nom">{e.enseigne}</span>
        </div>
      )}
      <div className="m-air m-marge flex min-w-0 flex-1 flex-col">
      {geste === 'bandeau' && <div data-testid="geste-bandeau" className="m-bandeau" />}
      {geste === 'aplat' && <div data-testid="geste-aplat" className="m-aplat-tete" />}
      <header data-ancre="site-navigation" className="flex min-w-0 items-baseline gap-3">
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
          {langues > 0 && (
            <select
              data-testid="site-langue"
              value={active}
              onChange={(evenement) => setLangue(evenement.target.value as Langue)}
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

      <div className="m-air flex min-h-0 flex-1 flex-col">
        {/* Bande haute : l'aplat prend la hauteur libre, les services prennent la leur.
            Aucun centrage, donc aucune bande vide, et rien ne se comprime sous son contenu. */}
        {/* Photo réelle du métier, en licence libre, à la place du dégradé. Conditionner sa
            présence à l'achat de `photos` ou `visuels` a été essayé et défait : les deux options
            rendaient alors la même image. Les distinguer demande l'état inachevé complet, textes
            compris, et c'est le lot 3 qui le porte. */}
        <div
          data-testid="site-cadre"
          data-ancre="site-contenu"
          className="m-photo relative shrink grow basis-0 overflow-hidden"
          style={{ '--m-photo-fond': `url(/maquette/${domaine}.avif)` } as React.CSSProperties}
        >
          {photos > 0 && (
            <>
              <span data-testid="site-reperes" className="animate-glisse m-reperes absolute inset-3" />
              {/* Aucun chiffre : un poids annoncé serait une mesure inventée. */}
              <span data-testid="site-poids" className="animate-glisse m-etiquette absolute right-1.5 bottom-1.5 px-1.5">
                {t.photo}
              </span>
            </>
          )}
          {visuels > 0 && (
            <span data-testid="site-visuels" className="animate-glisse m-etiquette absolute bottom-1.5 left-1.5 px-1.5">
              {t.visuel}
            </span>
          )}
        </div>

        <div className="m-air flex shrink-0 flex-col">
        <div data-testid="site-services" className="m-air grid shrink-0 grid-cols-1 @min-[500px]/maquette:grid-cols-3">
          {e.services.map((service, i) => (
            <div key={service.nom} data-testid="site-service" className="m-filet-haut flex min-w-0 gap-2 pt-1">
              <span className="m-mono shrink-0">{String(i + 1).padStart(2, '0')}</span>
              <div className="min-w-0">
                <p className="m-sous-titre truncate">{service.nom}</p>
                <p className="m-legende">{service.texte}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bande de services achetés : chaque carte prend sa part de la largeur, ou toute la
            ligne si ses voisines sont absentes. Conditions indépendantes, aucune cascade. */}
        <div data-testid="site-bande" className="m-air flex shrink-0 flex-wrap items-stretch">
          <section data-testid="site-formulaire" data-ancre="site-contact" className="m-carte m-air-serre flex min-w-0 grow-[1.6] basis-full flex-col px-2 py-1 @min-[500px]/maquette:basis-0">
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
            <section data-testid="site-newsletter" className="animate-construit m-carte flex min-w-0 grow basis-full items-center gap-1.5 px-2 py-1.5 @min-[500px]/maquette:basis-0">
              <span className="m-champ h-3 min-w-0 flex-1" />
              <span className="m-plein shrink-0 px-1.5">{t.inscrire}</span>
            </section>
          )}

          {rdv > 0 && (
            <section data-testid="site-rdv" className="animate-construit m-air-serre flex min-w-0 grow basis-full flex-col @min-[500px]/maquette:basis-0">
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
            <section data-testid="site-paiement" className="animate-construit m-carte flex min-w-0 grow basis-full items-center justify-between gap-2 px-2 py-1.5 @min-[500px]/maquette:basis-0">
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
                <span data-testid="site-redaction" className="flex min-w-0 flex-1 basis-0 flex-wrap items-baseline gap-1">
                  {e.pages.slice(0, redaction).map((page) => (
                    <span key={page} data-testid="site-page-redigee" className="animate-glisse m-puce px-1.5">
                      {page}
                    </span>
                  ))}
                </span>
              </div>
            )}

            {reprise > 0 && (
              <ul data-testid="site-reprise" className="animate-construit flex flex-wrap gap-1">
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
          <section data-testid="site-blog" data-ancre="site-actualites" className="animate-construit m-air-serre flex shrink-0 flex-col">
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
