import type { Metadata } from 'next'
import { PageOffre } from '@/components/ecrans/PageOffre'
import { EN } from '@/content/en'
import { metaOffre } from '@/lib/meta'

// La première offre vit à l'index des offres : ici, seulement les quatre autres.
export const dynamicParams = false
export function generateStaticParams() {
  return EN.offres.liste.slice(1).map((o) => ({ offre: o.slug }))
}

type Props = { params: Promise<{ offre: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return metaOffre(EN, (await params).offre)
}

export default async function Page({ params }: Props) {
  return <PageOffre t={EN} slug={(await params).offre} />
}
