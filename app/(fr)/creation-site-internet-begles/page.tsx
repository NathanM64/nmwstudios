import type { Metadata } from 'next'
import { Begles } from '@/components/ecrans/Begles'
import { FR } from '@/content/fr'
import { BEGLES } from '@/lib/meta'

// Hors du système de routes : pas d'équivalent anglais, donc pas de hreflang.
export const metadata: Metadata = {
  title: FR.begles!.title,
  description: FR.begles!.description,
  alternates: { canonical: BEGLES },
  openGraph: { url: BEGLES, images: [{ url: '/opengraph-image.jpg', width: 1200, height: 630, type: 'image/jpeg', alt: FR.ogAlt }] },
}

export default function Page() {
  return <Begles t={FR} />
}
