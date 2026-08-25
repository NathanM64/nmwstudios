'use client'

import { memo, useState } from 'react'
import type { Configuration } from '@/lib/config/devis'
import { LANGUES, type Langue } from '@/lib/config/maquette'
import { DOMAINE_REPLI, editorialDe, type DomaineId } from '@/lib/config/domaines'
import type { Geste } from '@/lib/config/styles'
import { Navigation } from '@/components/config/blocs/site/Navigation'
import { Hero } from '@/components/config/blocs/site/Hero'
import { Photo } from '@/components/config/blocs/site/Photo'
import { Services } from '@/components/config/blocs/site/Services'
import { Formulaire } from '@/components/config/blocs/site/Formulaire'
import { Newsletter } from '@/components/config/blocs/site/Newsletter'
import { Rdv } from '@/components/config/blocs/site/Rdv'
import { Paiement } from '@/components/config/blocs/site/Paiement'
import { Textes } from '@/components/config/blocs/site/Textes'
import { Actualites } from '@/components/config/blocs/site/Actualites'

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
  const [langue, setLangue] = useState<Langue>('fr')

  // Une langue de plus par unité achetée. La langue affichée est retenue seulement si elle
  // est encore payée : retirer l'option ne laisse pas la maquette bloquée en anglais.
  const offertes = LANGUES.slice(0, Math.min(langues, LANGUES.length - 1) + 1)
  const active = offertes.includes(langue) ? langue : 'fr'
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
              <Formulaire config={config} domaine={domaine} langue={active} />
              <Newsletter config={config} langue={active} />
              <Rdv config={config} langue={active} />
              <Paiement config={config} langue={active} />
            </div>

            <Textes config={config} domaine={domaine} langue={active} />

            <Actualites config={config} domaine={domaine} langue={active} />
          </div>

          {geste === 'bande' && <div data-testid="geste-bande" className="m-bande shrink-0" />}
        </div>
      </div>
    </div>
  )
})
