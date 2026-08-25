'use client'

import { editorialDe, type DomaineId } from '@/lib/config/domaines'

export function Serp({ domaine }: { domaine: DomaineId }) {
  // Cette scène n'a pas de sélecteur de langue : elle reste en français, comme le reste de ses libellés.
  const recherche = editorialDe(domaine, 'fr').recherche

  return (
    <div data-testid="preuve-serp" className="animate-construit flex flex-col">
      <p className="m-mono m-sourd">votre-nom.fr</p>
      <p className="m-sous-titre m-accent truncate">{recherche.titre}</p>
      <p className="m-legende">{recherche.description}</p>
    </div>
  )
}
