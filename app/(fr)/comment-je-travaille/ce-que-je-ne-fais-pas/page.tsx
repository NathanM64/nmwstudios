import type { Metadata } from 'next'
import { Refus } from '@/components/ecrans/Refus'
import { FR } from '@/content/fr'
import { metaPage } from '@/lib/meta'

export const metadata: Metadata = metaPage(FR, 'refus', FR.pages.refus)

export default function Page() {
  return <Refus t={FR} />
}
