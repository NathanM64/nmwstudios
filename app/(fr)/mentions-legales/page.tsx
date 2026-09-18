import type { Metadata } from 'next'
import { Legal } from '@/components/ecrans/Legal'
import { FR } from '@/content/fr'
import { metaPage } from '@/lib/meta'

export const metadata: Metadata = metaPage(FR, 'legal', FR.pages.legal, false)

export default function Page() {
  return <Legal t={FR} />
}
