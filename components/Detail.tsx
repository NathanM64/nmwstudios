import Link from 'next/link'
import { ViewTransition } from 'react'
import type { Offre } from '@/content/offres'
import { Carrousel } from './Carrousel'

// La carte ouverte. Son nom de transition est celui de sa carte fermée : l'une devient l'autre.
// Sur sa propre route, la carte ouverte porte le h1 de la page.
export function Detail({ offre, niveau = 'h2' }: { offre: Offre; niveau?: 'h1' | 'h2' }) {
  const Titre = niveau
  return (
    <ViewTransition name={`offre-${offre.slug}`} default="offre">
      <article className="carte panel ouverte">
        <Titre>{offre.titre}</Titre>
        {offre.blocs.map((bloc, i) =>
          typeof bloc === 'string' ? (
            <p key={i}>{bloc}</p>
          ) : (
            <ul key={i}>
              {bloc.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ),
        )}
        {offre.prix && <p className="prix">{offre.prix}</p>}
        {offre.vues && <Carrousel vues={offre.vues.liste} legende={offre.vues.legende} />}
        <p className="lien">
          <Link href="/contact">{offre.appel}</Link>
        </p>
      </article>
    </ViewTransition>
  )
}
