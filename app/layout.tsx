import type { Metadata } from 'next'
import { ViewTransition } from 'react'
import Link from 'next/link'
import { IBM_Plex_Mono, Manrope } from 'next/font/google'
import { Menu } from '@/components/Menu'
import { Clavier } from '@/components/Clavier'
import { Fond } from '@/components/Fond'
import { Suivant } from '@/components/Suivant'
import './globals.css'

// Les classes next/font vont sur <html> : sur <body>, les variables restent vides en silence.
const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-manrope',
  display: 'swap',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-plex-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://nmwstudios.com'),
  title: 'NMW Studios, sites et applications web',
  description:
    "Je conçois, je développe, je reprends et j'accompagne vos sites et applications web. Le code est à vous, l'hébergement est transférable.",
}

// Ce que Google lit : la même chose que le lecteur, ni plus ni moins.
const DONNEES = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'NMW Studios',
  url: 'https://nmwstudios.com/',
  email: 'contact@nmwstudios.com',
  founder: { '@type': 'Person', name: 'Nathan Marimbordes', jobTitle: 'Développeur web indépendant' },
  address: { '@type': 'PostalAddress', addressLocality: 'Bègles', postalCode: '33130', addressCountry: 'FR' },
  areaServed: 'FR',
  description:
    'Sites, applications et outils métier. Je construis, je reprends l’existant, et j’assure la suite si vous le souhaitez.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${manrope.variable} ${plexMono.variable}`}>
      <body>
        {/* Toute la page est photographiée d'un bloc : le verre garde ce qu'il floute, l'en-tête ne bouge pas.
            Quand seul un détail change (type « detail »), la page ne fond pas. */}
        <ViewTransition name="page" update={{ default: 'page', detail: 'none' }}>
          <div className="page">
            <div className="ambiance" aria-hidden="true" />
            <Fond />
            <header className="haut">
              <Link className="marque" href="/">
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
              <Link className="legal" href="/mentions-legales">
                Mentions légales
              </Link>
            </div>
          </div>
        </ViewTransition>
        <Clavier />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(DONNEES) }} />
      </body>
    </html>
  )
}
