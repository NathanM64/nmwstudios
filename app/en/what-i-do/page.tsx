import type { Metadata } from 'next'
import { Detail } from '@/components/Detail'
import { EN } from '@/content/en'
import { metaPage } from '@/lib/meta'

export const metadata: Metadata = metaPage(EN, 'offres', EN.pages.offres)

export default function Page() {
  return <Detail t={EN} offre={EN.offres.liste[0]} />
}
