import type { Metadata } from 'next'
import { ViewTransition } from 'react'
import Link from 'next/link'
import { IBM_Plex_Mono, Manrope } from 'next/font/google'
import { Beacon } from '@/components/Beacon'
import { Menu } from '@/components/Menu'
import { Clavier } from '@/components/Clavier'
import { Fond } from '@/components/Fond'
import { Suivant } from '@/components/Suivant'
import { Donnees } from '@/components/Donnees'
import { DONNEES } from '@/lib/donnees'
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
  // Des adresses fixes : Google ne rattrape pas un favicon qui change d'empreinte à chaque déploiement.
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  title: 'NMW Studios, développeur web indépendant à Bordeaux',
  description:
    'Je conçois, je développe, je reprends et j’accompagne vos sites et applications web, en direct et en marque blanche pour les agences. Le code est à vous.',
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
        <Donnees objet={DONNEES} />
        <Beacon />
      </body>
    </html>
  )
}
