'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ECRANS, indexEcran } from '@/content/ecrans'

// Le pied du cadre : où l'on est, et l'écran d'après.
export function Suivant() {
  const i = indexEcran(usePathname())
  if (i < 0) return null
  const suivant = ECRANS[i + 1]
  return (
    <p className="suivant-lien">
      <span className="compteur">
        {String(i + 1).padStart(2, '0')} / {String(ECRANS.length).padStart(2, '0')}
      </span>
      {suivant ? (
        <Link href={suivant.href}>
          <span>Suivant :</span> {suivant.titre}
        </Link>
      ) : (
        <Link href="/">
          <span>Retour :</span> Accueil
        </Link>
      )}
    </p>
  )
}
