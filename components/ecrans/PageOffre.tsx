import { notFound } from 'next/navigation'
import type { Dictionnaire } from '@/content/types'
import { offreParSlug } from '@/content'
import { Detail } from '@/components/Detail'
import { Donnees } from '@/components/Donnees'
import { filAriane } from '@/lib/donnees'

// Une offre sur sa propre route : la carte ouverte porte le h1, le fil d'Ariane suit.
export function PageOffre({ t, slug }: { t: Dictionnaire; slug: string }) {
  const offre = offreParSlug(t, slug)
  if (!offre || offre === t.offres.liste[0]) notFound()
  return (
    <>
      <Detail t={t} offre={offre} niveau="h1" />
      <Donnees objet={filAriane([[t.ecrans[0].titre, t.routes.accueil], [t.ecrans[1].titre, t.routes.offres], [offre.titre, null]])} />
    </>
  )
}
