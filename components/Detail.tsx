import Link from 'next/link'
import { ViewTransition } from 'react'
import type { Offre } from '@/content/offres'
import { Carrousel } from './Carrousel'

// La carte ouverte. Son nom de transition est celui de sa carte fermée : l'une devient l'autre.
export function Detail({ offre }: { offre: Offre }) {
  return (
    <ViewTransition name={`offre-${offre.slug}`} default="offre">
      <article className="carte panel ouverte">
        <h3>{offre.titre}</h3>
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
