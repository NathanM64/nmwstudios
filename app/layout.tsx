import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { LoadingAnimation } from '@/components/LoadingAnimation'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://nmwstudios.com'),
  title: {
    default: 'NMW Studios | Agence Web Bordeaux - Création Sites & Applications',
    template: '%s | NMW Studios',
  },
  description:
    "Agence web à Bordeaux spécialisée dans la création de sites vitrines, landing pages et applications web sur mesure. Next.js, React, TypeScript. Devis gratuit.",
  keywords: ['agence web', 'Bordeaux', 'création site internet', 'Next.js', 'React', 'TypeScript', 'site vitrine', 'landing page', 'application web', 'développement web'],
  authors: [{ name: 'NMW Studios', url: 'https://nmwstudios.com' }],
  creator: 'NMW Studios',
  alternates: {
    canonical: 'https://nmwstudios.com',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://nmwstudios.com',
    siteName: 'NMW Studios',
    title: 'NMW Studios | Agence Web Bordeaux',
    description: 'Agence web spécialisée dans la création de sites vitrines, landing pages et applications web sur mesure. Devis gratuit.',
    images: [
      {
        url: '/logo_nmw.png',
        width: 1200,
        height: 630,
        alt: 'NMW Studios - Agence Web Bordeaux',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NMW Studios | Agence Web Bordeaux',
    description: 'Agence web spécialisée dans la création de sites vitrines, landing pages et applications web sur mesure.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

// JSON-LD Schema pour SEO
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://nmwstudios.com/#website',
      url: 'https://nmwstudios.com',
      name: 'NMW Studios',
      description: 'Agence web à Bordeaux - Création de sites et applications web sur mesure',
      publisher: {
        '@id': 'https://nmwstudios.com/#organization',
      },
      inLanguage: 'fr-FR',
    },
    {
      '@type': ['LocalBusiness', 'ProfessionalService'],
      '@id': 'https://nmwstudios.com/#organization',
      name: 'NMW Studios',
      url: 'https://nmwstudios.com',
      logo: 'https://nmwstudios.com/logo_nmw.png',
      image: 'https://nmwstudios.com/logo_nmw.png',
      description: 'Agence web spécialisée dans la création de sites vitrines, landing pages et applications web sur mesure avec Next.js, React et TypeScript.',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Bordeaux',
        addressRegion: 'Nouvelle-Aquitaine',
        addressCountry: 'FR',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 44.837789,
        longitude: -0.57918,
      },
      email: 'contact@nmwstudios.com',
      priceRange: '€€',
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
      sameAs: [
        'https://github.com/NathanM64',
      ],
      areaServed: {
        '@type': 'Country',
        name: 'France',
      },
      serviceType: [
        'Agence web',
        'Création de site internet',
        'Développement d\'applications web',
        'Site vitrine',
        'Landing page',
        'Dashboard SaaS',
      ],
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} relative overflow-x-hidden bg-white dark:bg-black antialiased`}
      >
        <LoadingAnimation />

        {/* Animated gradient blobs - fixed background */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute -left-40 top-0 h-96 w-96 animate-blob rounded-full bg-gradient-to-r from-accent-blue/30 to-purple-500/30 opacity-70 blur-3xl dark:opacity-40" />
          <div className="animation-delay-2000 absolute right-0 top-20 h-96 w-96 animate-blob rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 opacity-70 blur-3xl dark:opacity-40" />
          <div className="animation-delay-4000 absolute bottom-20 left-20 h-96 w-96 animate-blob rounded-full bg-gradient-to-r from-accent-blue/30 to-cyan-500/30 opacity-70 blur-3xl dark:opacity-40" />
        </div>

        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
