import type { Metadata } from 'next'
import {
  Chivo,
  Familjen_Grotesk,
  Fraunces,
  IBM_Plex_Mono,
  Instrument_Serif,
  Inter_Tight,
  Manrope,
  Newsreader,
  Syne,
} from 'next/font/google'
import { themeInitScript } from '@/lib/theme/theme'
import './globals.css'

const manrope = Manrope({ variable: '--font-manrope', subsets: ['latin'], display: 'swap' })
const plexMono = IBM_Plex_Mono({
  variable: '--font-plex-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
})

// Polices de la maquette seule : `preload: false`, le navigateur ne télécharge un fichier que si
// un élément peint l'utilise, donc un visiteur en charge une ou deux et jamais sept.
// Options répétées et non partagées : chaque police a sa propre union de sous-ensembles.
const fraunces = Fraunces({ variable: '--font-fraunces', subsets: ['latin'], display: 'swap', preload: false })
const chivo = Chivo({ variable: '--font-chivo', subsets: ['latin'], display: 'swap', preload: false })
const newsreader = Newsreader({ variable: '--font-newsreader', subsets: ['latin'], display: 'swap', preload: false })
// Seule non variable du lot, d'où son `weight` explicite.
const instrument = Instrument_Serif({ variable: '--font-instrument', weight: ['400'], subsets: ['latin'], display: 'swap', preload: false })
const interTight = Inter_Tight({ variable: '--font-inter-tight', subsets: ['latin'], display: 'swap', preload: false })
const syne = Syne({ variable: '--font-syne', subsets: ['latin'], display: 'swap', preload: false })
const familjen = Familjen_Grotesk({ variable: '--font-familjen', subsets: ['latin'], display: 'swap', preload: false })

const POLICES = [manrope, plexMono, fraunces, chivo, newsreader, instrument, interTight, syne, familjen]

export const metadata: Metadata = {
  metadataBase: new URL('https://nmwstudios.com'),
  title: { default: 'NMW Studios', template: '%s | NMW Studios' },
  description: 'Studio web indépendant à Bordeaux.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={POLICES.map((p) => p.variable).join(' ')} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript() }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
