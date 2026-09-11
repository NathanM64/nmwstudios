import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Detail } from '@/components/Detail'
import { OFFRES, offreParSlug } from '@/content/offres'

// La première offre vit à /ce-que-je-fais : ici, seulement les quatre autres.
export const dynamicParams = false
export function generateStaticParams() {
  return OFFRES.slice(1).map((o) => ({ offre: o.slug }))
}

type Props = { params: Promise<{ offre: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const offre = offreParSlug((await params).offre)
  return offre ? { title: `${offre.titre}, NMW Studios`, description: offre.paragraphes[0] } : {}
}

export default async function Page({ params }: Props) {
  const offre = offreParSlug((await params).offre)
  if (!offre || offre === OFFRES[0]) notFound()
  return <Detail offre={offre} />
}
