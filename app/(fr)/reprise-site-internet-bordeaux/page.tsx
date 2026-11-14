import type { Metadata } from 'next'
import { Locale } from '@/components/ecrans/Locale'
import { FR } from '@/content/fr'
import { REPRISE } from '@/lib/meta'

// Hors du système de routes : pas d'équivalent anglais, donc pas de hreflang.
export const metadata: Metadata = {
  title: FR.reprise!.title,
  description: FR.reprise!.description,
  alternates: { canonical: REPRISE },
  openGraph: { url: REPRISE, images: [{ url: '/opengraph-image.jpg', width: 1200, height: 630, type: 'image/jpeg', alt: FR.ogAlt }] },
}

export default function Page() {
  return <Locale t={FR} b={FR.reprise!} />
}
