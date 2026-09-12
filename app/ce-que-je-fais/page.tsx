import type { Metadata } from 'next'
import { Detail } from '@/components/Detail'
import { OFFRES } from '@/content/offres'

export const metadata: Metadata = {
  alternates: { canonical: '/ce-que-je-fais/' },
  openGraph: { url: '/ce-que-je-fais/' },
  title: 'Ce que je fais : sites, reprise, automatisation. NMW Studios',
  description:
    'Reprise de l’existant, sites vitrines, applications, automatisation et hébergement. Cinq façons de travailler ensemble, chacune sur sa page. Le code est à vous.',
}

export default function Page() {
  return <Detail offre={OFFRES[0]} />
}
