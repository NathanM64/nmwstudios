import type { Metadata } from 'next'
import { Refus } from '@/components/ecrans/Refus'
import { EN } from '@/content/en'
import { metaPage } from '@/lib/meta'

export const metadata: Metadata = metaPage(EN, 'refus', EN.pages.refus)

export default function Page() {
  return <Refus t={EN} />
}
