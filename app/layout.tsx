import type { Metadata } from 'next'
import { IBM_Plex_Mono, Manrope } from 'next/font/google'
import { themeInitScript } from '@/lib/theme/theme'
import './globals.css'

const manrope = Manrope({ variable: '--font-manrope', subsets: ['latin'], display: 'swap' })
const plexMono = IBM_Plex_Mono({
  variable: '--font-plex-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://nmwstudios.com'),
  title: { default: 'NMW Studios', template: '%s | NMW Studios' },
  description: 'Studio web indépendant à Bordeaux.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${manrope.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript() }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
