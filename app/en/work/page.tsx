import type { Metadata } from 'next'
import { Realisations } from '@/components/ecrans/Realisations'
import { EN } from '@/content/en'
import { metaPage } from '@/lib/meta'

export const metadata: Metadata = metaPage(EN, 'realisations', EN.pages.realisations)

export default function Page() {
  return <Realisations t={EN} />
}
