import type { Metadata } from 'next'
import { Accueil } from '@/components/ecrans/Accueil'
import { FR } from '@/content/fr'
import { metaPage } from '@/lib/meta'

export const metadata: Metadata = metaPage(FR, 'accueil')

export default function Page() {
  return <Accueil t={FR} />
}
