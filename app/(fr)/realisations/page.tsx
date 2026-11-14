import type { Metadata } from 'next'
import { Realisations } from '@/components/ecrans/Realisations'
import { FR } from '@/content/fr'
import { metaPage } from '@/lib/meta'

export const metadata: Metadata = metaPage(FR, 'realisations', FR.pages.realisations)

export default function Page() {
  return <Realisations t={FR} />
}
