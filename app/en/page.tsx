import type { Metadata } from 'next'
import { Accueil } from '@/components/ecrans/Accueil'
import { EN } from '@/content/en'
import { metaPage } from '@/lib/meta'

export const metadata: Metadata = metaPage(EN, 'accueil')

export default function Page() {
  return <Accueil t={EN} />
}
