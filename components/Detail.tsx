import Link from 'next/link'
import { ViewTransition } from 'react'
import type { Offre } from '@/content/offres'

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
        {offre.image && (
          <figure className="apercu">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={offre.image.src} width={offre.image.largeur} height={offre.image.hauteur} alt={offre.image.alt} loading="lazy" />
            <figcaption>{offre.image.legende}</figcaption>
          </figure>
        )}
        <p className="lien">
          <Link href="/contact">{offre.appel}</Link>
        </p>
      </article>
    </ViewTransition>
  )
}
