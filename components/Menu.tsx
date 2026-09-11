'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ECRANS, indexEcran } from '@/content/ecrans'

export function Menu() {
  const courant = indexEcran(usePathname())
  return (
    <nav className="menu" aria-label="Sections">
      {ECRANS.map((e, i) => (
        <Link key={e.href} href={e.href} aria-current={i === courant ? 'page' : undefined}>
          {e.titre}
        </Link>
      ))}
      {/* Le bouton suit le visiteur sur les écrans du milieu ; l'accueil a le sien, le contact est la cible. */}
      {courant > 0 && courant < ECRANS.length - 1 && (
        <Link className="appel" href="/contact">
          Parler de votre projet
        </Link>
      )}
    </nav>
  )
}
