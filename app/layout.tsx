import type { Metadata, Viewport } from 'next'
import { Hanken_Grotesk, Schibsted_Grotesk } from 'next/font/google'
import { Refraction } from '@/components/ui/Refraction'
import './globals.css'

// Les variables se posent sur <html>. Tailwind déclare --font-* sur :root : plus bas,
// la var() serait irrésolue au moment de la déclaration et la police jamais appliquée.
const schibsted = Schibsted_Grotesk({ variable: '--font-schibsted', subsets: ['latin'], display: 'swap' })
const hanken = Hanken_Grotesk({ variable: '--font-hanken', subsets: ['latin'], display: 'swap' })

const POLICES = [schibsted, hanken]

export const viewport: Viewport = {
  // La barre d'adresse reprend la couleur du mur : le document ne s'arrête pas au viewport.
  themeColor: '#e4e7ec',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://nmwstudios.com'),
  title: {
    default: 'NMW Studios · Développeur en marque blanche pour agences',
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
      <body>
        {children}
        <Refraction />
      </body>
    </html>
  )
}
