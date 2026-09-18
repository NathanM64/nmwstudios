import type { Metadata } from 'next'
import { Methode } from '@/components/ecrans/Methode'
import { EN } from '@/content/en'
import { metaPage } from '@/lib/meta'

export const metadata: Metadata = metaPage(EN, 'methode', EN.pages.methode)

export default function Page() {
  return <Methode t={EN} />
}
