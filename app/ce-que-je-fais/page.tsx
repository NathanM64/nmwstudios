import type { Metadata } from 'next'
import { Detail } from '@/components/Detail'
import { OFFRES } from '@/content/offres'

export const metadata: Metadata = {
  title: 'Ce que je fais, NMW Studios',
  description: 'Reprise de l’existant, sites vitrines, applications, automatisation et hébergement. Le code est à vous.',
}

export default function Page() {
  return <Detail offre={OFFRES[0]} />
}
