import type { ReactNode } from 'react'
import { ViewTransition } from 'react'
import Link from 'next/link'
import type { Dictionnaire } from '@/content/types'
import { manrope, plexMono } from '@/lib/polices'
import { donnees } from '@/lib/donnees'
import { Beacon } from './Beacon'
import { Menu } from './Menu'
import { Clavier } from './Clavier'
import { Fond } from './Fond'
import { Suivant } from './Suivant'
import { Donnees } from './Donnees'
import '@/app/globals.css'

// Le cadre fixe, identique dans chaque langue : seul le dictionnaire change.
export function Coque({ t, children }: { t: Dictionnaire; children: ReactNode }) {
  return (
    <html lang={t.langue} className={`${manrope.variable} ${plexMono.variable}`}>
      <body>
        {/* Toute la page est photographiée d'un bloc : le verre garde ce qu'il floute, l'en-tête ne bouge pas.
            Quand seul un détail change (type « detail »), la page ne fond pas. */}
        <ViewTransition name="page" update={{ default: 'page', detail: 'none' }}>
          <div className="page">
            <div className="ambiance" aria-hidden="true" />
            <Fond />
            <header className="haut">
              <Link className="marque" href={t.routes.accueil}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/marque.svg" alt="" width={24} height={24} />
                NMW Studios
              </Link>
              <Menu />
            </header>
            <main className="cadre">
              <div className="ecran-boite">{children}</div>
            </main>
            <div className="pied-cadre">
              <Suivant />
              <Link className="legal" href={t.routes.legal}>
                {t.chrome.legal}
              </Link>
            </div>
          </div>
        </ViewTransition>
        <Clavier />
        <Donnees objet={donnees(t)} />
        <Beacon />
      </body>
    </html>
  )
}
