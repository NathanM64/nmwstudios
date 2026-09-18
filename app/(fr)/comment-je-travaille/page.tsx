import type { Metadata } from 'next'
import { Methode } from '@/components/ecrans/Methode'
import { FR } from '@/content/fr'
import { metaPage } from '@/lib/meta'

export const metadata: Metadata = metaPage(FR, 'methode', FR.pages.methode)

export default function Page() {
  return <Methode t={FR} />
}
