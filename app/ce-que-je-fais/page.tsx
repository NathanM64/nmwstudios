import type { Metadata } from 'next'
import { Detail } from '@/components/Detail'
import { OFFRES } from '@/content/offres'

export const metadata: Metadata = {
  title: 'Ce que je fais, nmwstudios',
  description: 'Sites vitrines, applications, reprise de l’existant, automatisation et hébergement. Le code est à vous.',
}

export default function Page() {
  return <Detail offre={OFFRES[0]} />
}
