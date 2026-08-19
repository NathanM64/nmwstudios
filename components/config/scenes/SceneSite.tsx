'use client'

import { useState } from 'react'
import type { Configuration } from '@/lib/config/devis'
import { LANGUES, TEXTES, type Langue } from '@/lib/config/maquette'

const PAGES_SOCLE = 3

export function SceneSite({ config }: { config: Configuration }) {
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
  const t = TEXTES[active]
  const libelles = t.pages.slice(0, PAGES_SOCLE + tranches * 3)

  return (
    <div className="animate-apparait flex flex-1 flex-col">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-3 py-1">
        <span className="h-3 w-14 rounded-sm bg-accent/70" />
        <div data-testid="site-nav">
          <ul className="flex flex-wrap gap-2">
            {libelles.map((page) => (
              <li key={page} className="animate-apparait text-[0.8125rem] text-muted-foreground">
                {page}
              </li>
            ))}
          </ul>
        </div>
        {langues > 0 && (
          <select
            data-testid="site-langue"
            value={active}
            onChange={(e) => setLangue(e.target.value as Langue)}
            aria-label="Langue de l’aperçu"
            className="animate-apparait rounded-sm border border-border bg-transparent text-[0.8125rem]"
          >
            {offertes.map((code) => (
              <option key={code} value={code}>
                {code.toUpperCase()}
              </option>
            ))}
          </select>
        )}
        {(config.membre ?? 0) > 0 && (
          <span data-testid="site-connexion" className="animate-apparait rounded-sm border border-border px-1.5 py-0.5 text-[0.8125rem]">
            {t.connexion}
          </span>
        )}
      </header>

      <div className="flex flex-1 flex-col gap-1 p-1.5">
        {/* Rédaction et reprise se cumulent : la cascade ne sert que le repli commun. */}
        {redaction === 0 && reprise === 0 && (
          <>
            <div className="h-3 w-2/3 rounded-sm bg-foreground/25" />
            <div className="h-2 w-1/2 rounded-sm bg-foreground/15" />
          </>
        )}

        {redaction > 0 && (
          <div data-testid="site-texte" className="animate-apparait">
            <p className="text-[1.3125rem] leading-tight text-foreground">{t.titre}</p>
            <p className="text-[1rem] leading-snug text-muted-foreground">{t.corps}</p>
            {/* Une page nommée par unité : sans elle, quinze pages rédigées rendent le même écran qu'une. */}
            <div data-testid="site-redaction" className="mt-0.5 flex flex-wrap items-center gap-x-1 gap-y-0.5">
              <span className="text-[0.75rem] uppercase tracking-wider text-accent">{t.redigees}</span>
              {t.pages.slice(0, redaction).map((page) => (
                <span
                  key={page}
                  data-testid="site-page-redigee"
                  className="rounded-sm border border-border px-1 text-[0.75rem] leading-tight text-muted-foreground"
                >
                  {page}
                </span>
              ))}
            </div>
          </div>
        )}

        {reprise > 0 && (
          <ul data-testid="site-reprise" className="animate-apparait flex flex-col gap-0.5">
            {t.blocsRepris.map((bloc) => (
              <li key={bloc} className="rounded-sm border border-border px-2 text-[0.875rem] leading-tight text-muted-foreground">
                {bloc}
              </li>
            ))}
          </ul>
        )}

        <div data-testid="site-cadre" className="relative h-9 overflow-hidden rounded-sm border border-border bg-[linear-gradient(135deg,rgba(122,162,255,0.22),rgba(168,120,255,0.16)_60%,rgba(96,214,214,0.12))]">
          {photos > 0 && (
            <>
              {/* Le travail sur la photo, jamais la photo : rien à produire graphiquement. */}
              <span data-testid="site-reperes" className="animate-apparait absolute inset-2 border border-accent" />
              {/* Aucun chiffre : un poids annoncé serait une mesure inventée. */}
              <span data-testid="site-poids" className="animate-apparait absolute bottom-0.5 left-1/2 -translate-x-1/2 rounded-sm bg-canvas/80 px-1 text-[0.8125rem] text-accent">
                {t.photo}
              </span>
            </>
          )}
          {visuels > 0 && (
            <span data-testid="site-visuels" className="animate-apparait absolute bottom-0.5 left-1 rounded-sm bg-canvas/80 px-1 text-[0.8125rem] text-muted-foreground">
              {t.visuel}
            </span>
          )}
        </div>

        {(blog > 0 || articles > 0) && (
          <section data-testid="site-blog" className="animate-apparait mt-auto">
            <p className="text-[0.8125rem] uppercase tracking-wider text-accent">{t.actualites}</p>
            {/* 5 colonnes : 10 articles au maximum tiennent sur 2 lignes plutôt que 4, sans quoi le cadre déborde. */}
            <div className="grid grid-cols-5 gap-0.5">
              {articles > 0
                ? t.articles.slice(0, articles).map((article) => (
                    <div key={article.requete} data-testid="site-article" className="rounded-sm border border-border px-0.5">
                      <p className="text-[0.8125rem] leading-tight text-foreground">{article.titre}</p>
                      <p className="font-mono text-[0.75rem] leading-tight text-accent">{article.requete}</p>
                    </div>
                  ))
                : [0, 1, 2].map((i) => <div key={i} className="h-5 rounded-sm border border-border" />)}
            </div>
          </section>
        )}

        {/* Grille à deux colonnes : chaque carte prend sa moitié, ou toute la ligne si sa voisine
            est absente. Conditions indépendantes, aucune ne dépend d'une autre pour s'afficher. */}
        <div className="grid grid-cols-2 gap-0.5">
          <section data-testid="site-formulaire" className={`rounded-sm border border-border p-0.5 ${newsletter > 0 ? '' : 'col-span-2'}`}>
            {formulaire > 0 && (
              <div data-testid="site-etapes" className="animate-apparait mb-0.5 flex gap-1">
                {[1, 2, 3].map((n) => (
                  <span key={n} className="rounded-sm bg-accent/20 px-1 font-mono text-[0.75rem] leading-tight text-accent">
                    {n}
                  </span>
                ))}
              </div>
            )}
            <div className="flex flex-col gap-0.5">
              {[0, 1, 2].map((i) => (
                <span key={i} data-testid="site-champ" className="h-1 rounded-sm bg-foreground/12" />
              ))}
            </div>
            {formulaire > 0 && (
              <p className="animate-apparait text-[0.75rem] leading-tight text-muted-foreground">{t.pieceJointe}</p>
            )}
          </section>

          {newsletter > 0 && (
            <section data-testid="site-newsletter" className="animate-apparait flex items-center gap-1 self-start rounded-sm bg-surface-raised p-1">
              <span className="h-1 flex-1 rounded-sm bg-foreground/12" />
              <span className="rounded-sm bg-accent/20 px-1 text-[0.75rem] leading-tight text-accent">{t.inscrire}</span>
            </section>
          )}

          {rdv > 0 && (
            <section data-testid="site-rdv" className={`animate-apparait ${paiement > 0 ? '' : 'col-span-2'}`}>
              <p className="text-[0.8125rem] uppercase tracking-wider text-accent">{t.reserver}</p>
              <div className="grid grid-cols-6 gap-0.5">
                {t.creneaux.map((h) => (
                  <span key={h} data-testid="site-creneau" className="rounded-sm border border-border text-center text-[0.75rem] leading-tight text-muted-foreground">
                    {h}
                  </span>
                ))}
              </div>
            </section>
          )}

          {paiement > 0 && (
            <section data-testid="site-paiement" className={`animate-apparait flex items-center justify-between self-start rounded-sm border border-border px-1 py-0.5 ${rdv > 0 ? '' : 'col-span-2'}`}>
              <span className="text-[0.8125rem] leading-tight text-muted-foreground">{t.regler}</span>
              <span className="flex gap-1">
                {/* Logos dessinés, aucune marque reproduite. */}
                <span className="h-1.5 w-3 rounded-[2px] bg-foreground/25" />
                <span className="h-1.5 w-3 rounded-[2px] bg-foreground/15" />
              </span>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
