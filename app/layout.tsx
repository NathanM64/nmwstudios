import type { Metadata, Viewport } from 'next'
import { Hanken_Grotesk, Schibsted_Grotesk } from 'next/font/google'
import { Refraction } from '@/components/ui/Refraction'
import { og } from '@/lib/meta'
import { SCHEMA, SITE } from '@/lib/schema'
import './globals.css'

// The variables go on <html>. Tailwind declares --font-* on :root: any lower, the var() would
// be unresolved at declaration time and the font never applied.
const schibsted = Schibsted_Grotesk({ variable: '--font-schibsted', subsets: ['latin'], display: 'swap' })
const hanken = Hanken_Grotesk({ variable: '--font-hanken', subsets: ['latin'], display: 'swap' })

const POLICES = [schibsted, hanken]

export const viewport: Viewport = {
  // The address bar takes the colour of the wall: the document does not stop at the viewport.
  themeColor: '#e4e7ec',
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  alternates: { canonical: '/' },
  title: {
    default: 'NMW Studios · Développeur en marque blanche pour agences',
    template: '%s · NMW Studios',
  },
  // Google cuts around 155 characters: past that, the tail is written for nobody.
  description:
    "Développeur web en marque blanche pour les agences sans équipe technique. Renfort, projet complet, reprise d'un existant. Bordeaux et à distance.",
  openGraph: og('/'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={POLICES.map((p) => p.variable).join(' ')}>
      <body>
        {/* Inline, so covered by the CSP's 'unsafe-inline' and by no request at all. */}
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
