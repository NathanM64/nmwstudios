import { Configurateur } from '@/components/config/Configurateur'
import { Dock } from '@/components/shell/Dock'
import { Footer } from '@/components/shell/Footer'

export const metadata = {
  title: 'Configurez votre site',
  description: 'Composez votre site et voyez le prix se construire.',
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const recherche = new URLSearchParams(
    Object.entries(params).flatMap(([cle, valeur]) =>
      valeur === undefined ? [] : [[cle, Array.isArray(valeur) ? valeur[0] : valeur] as [string, string]]
    )
  ).toString()

  return (
    <>
      <Dock />
      <Configurateur recherche={recherche} />
      <Footer />
    </>
  )
}
