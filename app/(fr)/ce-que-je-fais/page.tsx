import type { Metadata } from 'next'
import { Detail } from '@/components/Detail'
import { FR } from '@/content/fr'
import { metaPage } from '@/lib/meta'

export const metadata: Metadata = metaPage(FR, 'offres', FR.pages.offres)

export default function Page() {
  return <Detail t={FR} offre={FR.offres.liste[0]} />
}
