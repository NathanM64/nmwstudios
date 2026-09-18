import type { Metadata } from 'next'
import { Qui } from '@/components/ecrans/Qui'
import { EN } from '@/content/en'
import { metaPage } from '@/lib/meta'

export const metadata: Metadata = metaPage(EN, 'qui', EN.pages.qui)

export default function Page() {
  return <Qui t={EN} />
}
