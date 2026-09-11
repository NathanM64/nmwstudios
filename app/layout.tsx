import type { Metadata } from 'next'
import { ViewTransition } from 'react'
import Link from 'next/link'
import { Inter, Space_Grotesk } from 'next/font/google'
import { Menu } from '@/components/Menu'
import { Clavier } from '@/components/Clavier'
import './globals.css'

// Les classes next/font vont sur <html> : sur <body>, les variables restent vides en silence.
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://nmwstudios.fr'),
  title: 'nmwstudios, sites et applications web',
  description:
    "Je conçois, je développe, je reprends et j'accompagne vos sites et applications web. Le code est à vous, l'hébergement est transférable.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>
        <header className="haut">
          <Link className="marque" href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/marque.svg" alt="" width={22} height={22} />
            nmwstudios
          </Link>
          <Menu />
        </header>
        <main className="cadre">
          {/* Le nom reste le même d'une route à l'autre : React fond l'ancien écran dans le nouveau. */}
          <ViewTransition name="ecran" update="ecran">
            <div className="ecran-boite">{children}</div>
          </ViewTransition>
        </main>
        <Link className="legal" href="/mentions-legales">
          Mentions légales
        </Link>
        <Clavier />
      </body>
    </html>
  )
}
