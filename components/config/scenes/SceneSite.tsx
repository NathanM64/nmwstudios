'use client'

import { useState } from 'react'
import type { Configuration } from '@/lib/config/devis'

const PAGES_BASE = ['Accueil', 'Services', 'Contact']
export const PAGES_SUP = ['Tarifs', 'Réalisations', 'À propos', 'Équipe', 'FAQ', 'Blog', 'Presse', 'Partenaires', 'Recrutement', 'Mentions', 'Plan', 'Aide']
const NAV_EN = ['Home', 'Services', 'Contact']

export function SceneSite({ config }: { config: Configuration }) {
  const tranches = config.pages ?? 0
  const pages = [...PAGES_BASE, ...PAGES_SUP.slice(0, tranches * 3)]
  const langues = config.langue ?? 0
  const [langue, setLangue] = useState('fr')
  const libelles = langue === 'en' ? [...NAV_EN, ...PAGES_SUP.slice(0, tranches * 3)] : pages

  return (
    <div className="animate-apparait flex flex-1 flex-col">
      <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <span className="h-3 w-14 rounded-sm bg-accent/70" />
        <div data-testid="apercu-nav">
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
            data-testid="apercu-langue"
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
          <span data-testid="apercu-connexion" className="animate-apparait rounded-sm border border-border px-1.5 py-0.5 text-[0.5rem]">
            Connexion
          </span>
        )}
      </header>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="h-3 w-2/3 rounded-sm bg-foreground/25" />
        <div className="h-2 w-1/2 rounded-sm bg-foreground/15" />

        {(config.rdv ?? 0) > 0 && (
          <span data-testid="apercu-rdv" className="animate-apparait mt-1 w-fit rounded-sm bg-accent/20 px-2 py-1 text-[0.5rem]">
            Réserver un créneau
          </span>
        )}

        {(config.blog ?? 0) > 0 && (
          <section data-testid="apercu-blog" className="animate-apparait mt-auto">
            <p className="text-[0.5rem] uppercase tracking-wider text-accent">Actualités</p>
            <div className="mt-1 grid grid-cols-3 gap-1">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-6 rounded-sm border border-border" />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
