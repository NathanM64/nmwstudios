import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Detail } from '@/components/Detail'
import { Donnees } from '@/components/Donnees'
import { filAriane } from '@/lib/donnees'
import { OFFRES, hrefOffre, offreParSlug } from '@/content/offres'

// La première offre vit à /ce-que-je-fais : ici, seulement les quatre autres.
export const dynamicParams = false
export function generateStaticParams() {
  return OFFRES.slice(1).map((o) => ({ offre: o.slug }))
}

type Props = { params: Promise<{ offre: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const offre = offreParSlug((await params).offre)
  if (!offre) return {}
  const chemin = `${hrefOffre(offre)}/`
  return { title: `${offre.titre}, NMW Studios`, description: offre.meta, alternates: { canonical: chemin }, openGraph: { url: chemin } }
}

export default async function Page({ params }: Props) {
  const offre = offreParSlug((await params).offre)
  if (!offre || offre === OFFRES[0]) notFound()
  return (
    <>
      <Detail offre={offre} niveau="h1" />
      <Donnees objet={filAriane([['Accueil', '/'], ['Ce que je fais', '/ce-que-je-fais/'], [offre.titre, null]])} />
    </>
  )
}
