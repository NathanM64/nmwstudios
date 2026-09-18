'use client'

import Link from 'next/link'
import { ViewTransition } from 'react'
import { usePathname } from 'next/navigation'
import { dico, hrefOffre, langueDuChemin, sansBarre } from '@/content'

// Les cartes fermées : toutes les offres sauf celle qui est ouverte.
export function ListeOffres() {
  const chemin = sansBarre(usePathname())
  const t = dico(langueDuChemin(chemin))
  return (
    <>
      {t.offres.liste.filter((o) => hrefOffre(t, o) !== chemin).map((o) => (
        <ViewTransition key={o.cle} name={`offre-${o.cle}`} default="offre">
          <Link className="carte panel" href={hrefOffre(t, o)} transitionTypes={['detail']}>
            <h2>{o.titre}</h2>
            <p>{o.resume}</p>
            {o.prix && <p className="prix">{o.prix}</p>}
            <span className="lien">{t.offres.voirDetail}</span>
          </Link>
        </ViewTransition>
      ))}
    </>
  )
}
