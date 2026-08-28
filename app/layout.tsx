import type { Metadata, Viewport } from 'next'
import { Hanken_Grotesk, Schibsted_Grotesk } from 'next/font/google'
import { Refraction } from '@/components/ui/Refraction'
import { og } from '@/lib/meta'
import { SCHEMA, SITE } from '@/lib/schema'
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
  metadataBase: new URL(SITE),
  alternates: { canonical: '/' },
  title: {
    default: 'NMW Studios · Développeur en marque blanche pour agences',
    template: '%s · NMW Studios',
  },
  // Google coupe vers 155 signes : au-delà, la fin est écrite pour personne.
  description:
    "Développeur web en marque blanche pour les agences sans équipe technique. Renfort, projet complet, reprise d'un existant. Bordeaux et à distance.",
  openGraph: og('/'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={POLICES.map((p) => p.variable).join(' ')}>
      <body>
        {/* Inline, donc couvert par le 'unsafe-inline' de la CSP et par aucune requête. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
        />
        {children}
        <Refraction />
      </body>
    </html>
  )
}
