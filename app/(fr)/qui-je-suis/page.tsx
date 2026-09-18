import type { Metadata } from 'next'
import { Qui } from '@/components/ecrans/Qui'
import { FR } from '@/content/fr'
import { metaPage } from '@/lib/meta'

export const metadata: Metadata = metaPage(FR, 'qui', FR.pages.qui)

export default function Page() {
  return <Qui t={FR} />
}
