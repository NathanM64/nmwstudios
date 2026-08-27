import type { Metadata } from 'next'
import { Archivo, IBM_Plex_Mono, Source_Serif_4 } from 'next/font/google'
import './globals.css'

// Les variables se posent sur <html>. Tailwind déclare --font-* sur :root : plus bas,
// la var() serait irrésolue au moment de la déclaration et la police jamais appliquée.
const archivo = Archivo({ variable: '--font-archivo', subsets: ['latin'], display: 'swap' })
const sourceSerif = Source_Serif_4({ variable: '--font-source-serif', subsets: ['latin'], display: 'swap' })
const plexMono = IBM_Plex_Mono({
  variable: '--font-plex-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
})

const POLICES = [archivo, sourceSerif, plexMono]

export const metadata: Metadata = {
  metadataBase: new URL('https://nmwstudios.com'),
  title: {
    default: "NMW Studios · Développeur en marque blanche pour agences",
    template: '%s · NMW Studios',
  },
  description:
    "Développeur web en sous-traitance pour les agences sans équipe technique. Renfort, projet complet, reprise et maintenance d'un existant. Marque blanche systématique. Bordeaux, à distance partout en France.",
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'NMW Studios',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={POLICES.map((p) => p.variable).join(' ')}>
      <body>{children}</body>
    </html>
  )
}
