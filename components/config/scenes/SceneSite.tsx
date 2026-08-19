'use client'

import { useState } from 'react'
import type { Configuration } from '@/lib/config/devis'

const PAGES_BASE = ['Accueil', 'Services', 'Contact']
export const PAGES_SUP = ['Tarifs', 'Réalisations', 'À propos', 'Équipe', 'FAQ', 'Blog', 'Presse', 'Partenaires', 'Recrutement', 'Mentions', 'Plan', 'Aide']
const NAV_EN = ['Home', 'Services', 'Contact']

const TEXTE_ECRIT = {
  titre: 'Charpentier à Bègles depuis 1998',
  corps: 'Ossature bois, extension, rénovation de toiture. Devis sous 48 h, chantiers en Gironde.',
}

const BLOCS_REPRIS = ['Nos services', 'Notre histoire', 'Nous contacter']

const ARTICLES = [
  { titre: 'Quel bois pour une extension ?', requete: 'extension bois bègles' },
  { titre: 'Prix d’une toiture en 2026', requete: 'prix toiture gironde' },
  { titre: 'Ossature ou maçonnerie', requete: 'ossature bois avis' },
  { titre: 'Isoler une charpente ancienne', requete: 'isolation charpente' },
  { titre: 'Faut-il un permis pour une véranda', requete: 'permis véranda gironde' },
  { titre: 'Entretenir un bardage bois', requete: 'entretien bardage' },
  { titre: 'Combien de temps dure un chantier', requete: 'délai chantier bois' },
  { titre: 'Bois local ou importé', requete: 'bois local gironde' },
  { titre: 'Rénover sans tout casser', requete: 'rénovation toiture bègles' },
  { titre: 'Choisir son couvreur', requete: 'couvreur bègles avis' },
]

export function SceneSite({ config }: { config: Configuration }) {
  const tranches = config.pages ?? 0
  const pages = [...PAGES_BASE, ...PAGES_SUP.slice(0, tranches * 3)]
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
  const [langue, setLangue] = useState('fr')
  const libelles = langue === 'en' ? [...NAV_EN, ...PAGES_SUP.slice(0, tranches * 3)] : pages

  return (
    <div className="animate-apparait flex flex-1 flex-col">
      <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-2">
        <span className="h-3 w-14 rounded-sm bg-accent/70" />
        <div data-testid="site-nav">
          <ul className="flex flex-wrap gap-2">
            {libelles.map((page) => (
              <li key={page} className="animate-apparait text-[0.5rem] text-muted-foreground">
                {page}
              </li>
            ))}
          </ul>
        </div>
        {langues > 0 && (
          <select
            data-testid="site-langue"
            value={langue}
            onChange={(e) => setLangue(e.target.value)}
            aria-label="Langue de l’aperçu"
            className="animate-apparait rounded-sm border border-border bg-transparent text-[0.5rem]"
          >
            <option value="fr">FR</option>
            <option value="en">EN</option>
          </select>
        )}
        {(config.membre ?? 0) > 0 && (
          <span data-testid="site-connexion" className="animate-apparait rounded-sm border border-border px-1.5 py-0.5 text-[0.5rem]">
            Connexion
          </span>
        )}
      </header>

      <div className="flex flex-1 flex-col gap-1 p-2">
        {/* Rédaction et reprise se cumulent : la cascade ne sert que le repli commun. */}
        {redaction === 0 && reprise === 0 && (
          <>
            <div className="h-3 w-2/3 rounded-sm bg-foreground/25" />
            <div className="h-2 w-1/2 rounded-sm bg-foreground/15" />
          </>
        )}

        {redaction > 0 && (
          <div data-testid="site-texte" className="animate-apparait">
            <p className="text-sm text-foreground">{TEXTE_ECRIT.titre}</p>
            <p className="mt-1 text-[0.62rem] leading-snug text-muted-foreground">{TEXTE_ECRIT.corps}</p>
          </div>
        )}

        {reprise > 0 && (
          <ul data-testid="site-reprise" className="animate-apparait flex flex-col gap-1">
            {BLOCS_REPRIS.map((bloc) => (
              <li key={bloc} className="rounded-sm border border-border px-2 py-0.5 text-[0.6rem] leading-tight text-muted-foreground">
                {bloc}
              </li>
            ))}
          </ul>
        )}

        <div data-testid="site-cadre" className="relative h-16 overflow-hidden rounded-sm border border-border bg-[linear-gradient(135deg,rgba(122,162,255,0.22),rgba(168,120,255,0.16)_60%,rgba(96,214,214,0.12))]">
          {photos > 0 && (
            <>
              {/* Le travail sur la photo, jamais la photo : rien à produire graphiquement. */}
              <span data-testid="site-reperes" className="animate-apparait absolute inset-2 border border-accent" />
              {/* Aucun chiffre : un poids annoncé serait une mesure inventée. Le recadrage
                  et la mention qualitative suffisent à montrer le traitement. */}
              <span data-testid="site-poids" className="animate-apparait absolute bottom-1 left-1/2 -translate-x-1/2 rounded-sm bg-canvas/80 px-1 text-[0.55rem] text-accent">
                recadrée et allégée
              </span>
            </>
          )}
          {visuels > 0 && (
            <span data-testid="site-visuels" className="animate-apparait absolute bottom-1 left-1 rounded-sm bg-canvas/80 px-1 text-[0.55rem] text-muted-foreground">
              visuel sous licence
            </span>
          )}
        </div>

        {(blog > 0 || articles > 0) && (
          <section data-testid="site-blog" className="animate-apparait mt-auto">
            <p className="text-[0.5rem] uppercase tracking-wider text-accent">Actualités</p>
            {/* 5 colonnes : 10 articles au maximum tiennent sur 2 lignes plutôt que 4, sans quoi le cadre déborde. */}
            <div className="mt-1 grid grid-cols-5 gap-1">
              {articles > 0
                ? ARTICLES.slice(0, articles).map((article) => (
                    <div key={article.requete} data-testid="site-article" className="rounded-sm border border-border p-1">
                      <p className="text-[0.5rem] leading-tight text-foreground">{article.titre}</p>
                      <p className="mt-0.5 font-mono text-[0.45rem] text-accent">{article.requete}</p>
                    </div>
                  ))
                : [0, 1, 2].map((i) => <div key={i} className="h-6 rounded-sm border border-border" />)}
            </div>
          </section>
        )}

        {/* Grille à deux colonnes : chaque carte prend sa moitié, ou toute la ligne si sa voisine
            est absente. Conditions indépendantes, aucune ne dépend d'une autre pour s'afficher. */}
        <div className="grid grid-cols-2 gap-1">
          <section data-testid="site-formulaire" className={`rounded-sm border border-border p-1 ${newsletter > 0 ? '' : 'col-span-2'}`}>
            {formulaire > 0 && (
              <div data-testid="site-etapes" className="animate-apparait mb-0.5 flex gap-1">
                {[1, 2, 3].map((n) => (
                  <span key={n} className="rounded-sm bg-accent/20 px-1 font-mono text-[0.45rem] text-accent">
                    {n}
                  </span>
                ))}
              </div>
            )}
            <div className="flex flex-col gap-0.5">
              {[0, 1, 2].map((i) => (
                <span key={i} data-testid="site-champ" className="h-1.5 rounded-sm bg-foreground/12" />
              ))}
            </div>
            {formulaire > 0 && (
              <p className="animate-apparait mt-0.5 text-[0.5rem] text-muted-foreground">Pièce jointe</p>
            )}
          </section>

          {newsletter > 0 && (
            <section data-testid="site-newsletter" className="animate-apparait flex items-center gap-1 self-start rounded-sm bg-surface-raised p-1">
              <span className="h-1.5 flex-1 rounded-sm bg-foreground/12" />
              <span className="rounded-sm bg-accent/20 px-1 text-[0.45rem] text-accent">S’inscrire</span>
            </section>
          )}

          {rdv > 0 && (
            <section data-testid="site-rdv" className={`animate-apparait ${paiement > 0 ? '' : 'col-span-2'}`}>
              <p className="text-[0.5rem] uppercase tracking-wider text-accent">Réserver un créneau</p>
              <div className="mt-0.5 grid grid-cols-3 gap-0.5">
                {['9h', '10h', '11h', '14h', '15h', '16h'].map((h) => (
                  <span key={h} data-testid="site-creneau" className="rounded-sm border border-border py-0.5 text-center text-[0.45rem] text-muted-foreground">
                    {h}
                  </span>
                ))}
              </div>
            </section>
          )}

          {paiement > 0 && (
            <section data-testid="site-paiement" className={`animate-apparait flex items-center justify-between self-start rounded-sm border border-border p-1 ${rdv > 0 ? '' : 'col-span-2'}`}>
              <span className="text-[0.5rem] text-muted-foreground">Régler en ligne</span>
              <span className="flex gap-1">
                {/* Logos dessinés, aucune marque reproduite. */}
                <span className="h-2 w-4 rounded-[2px] bg-foreground/25" />
                <span className="h-2 w-4 rounded-[2px] bg-foreground/15" />
              </span>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
