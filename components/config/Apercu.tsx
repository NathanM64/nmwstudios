'use client'

import type { Configuration } from '@/lib/config/devis'

const PAGES_BASE = ['Accueil', 'Services', 'Contact']
const PAGES_SUP = ['Tarifs', 'Réalisations', 'À propos', 'Équipe', 'FAQ', 'Blog', 'Presse', 'Partenaires', 'Recrutement', 'Mentions', 'Plan', 'Aide']

export function Apercu({ config }: { config: Configuration }) {
  const tranches = config.pages ?? 0
  const pages = [...PAGES_BASE, ...PAGES_SUP.slice(0, tranches * 3)]

  return (
    <div className="panel flex aspect-[4/3] w-full flex-col overflow-hidden">
      <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <span className="h-3 w-14 rounded-sm bg-accent/70" />
        <nav data-testid="apercu-nav">
          <ul className="flex flex-wrap gap-2">
            {pages.map((page) => (
              <li key={page} className="animate-apparait text-[0.5rem] text-muted-foreground">
                {page}
              </li>
            ))}
          </ul>
        </nav>
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
