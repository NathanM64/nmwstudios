import type { Metadata } from 'next'
import { Legal } from '@/components/ecrans/Legal'
import { EN } from '@/content/en'
import { metaPage } from '@/lib/meta'

export const metadata: Metadata = metaPage(EN, 'legal', EN.pages.legal, false)

export default function Page() {
  return <Legal t={EN} />
}
