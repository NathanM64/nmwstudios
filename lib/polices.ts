import { IBM_Plex_Mono, Manrope } from 'next/font/google'

// Les classes next/font vont sur <html> : sur <body>, les variables restent vides en silence.
export const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-manrope',
  display: 'swap',
})

export const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-plex-mono',
  display: 'swap',
})
