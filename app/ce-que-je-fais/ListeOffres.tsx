'use client'

import Link from 'next/link'
import { ViewTransition } from 'react'
import { usePathname } from 'next/navigation'
import { OFFRES, hrefOffre } from '@/content/offres'

// Les cartes fermées : toutes les offres sauf celle qui est ouverte.
export function ListeOffres() {
  const chemin = usePathname().replace(/\/+$/, '')
  return (
    <>
      {OFFRES.filter((o) => hrefOffre(o) !== chemin).map((o) => (
        <ViewTransition key={o.slug} name={`offre-${o.slug}`} default="offre">
          <Link className="carte panel" href={hrefOffre(o)} transitionTypes={['detail']}>
            <h3>{o.titre}</h3>
            <p>{o.resume}</p>
            {o.prix && <p className="prix">{o.prix}</p>}
            <span className="lien">{o.appel}</span>
          </Link>
        </ViewTransition>
      ))}
    </>
  )
}
