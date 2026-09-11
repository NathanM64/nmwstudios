'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ECRANS, indexEcran } from '@/content/ecrans'

export function Menu() {
  const pathname = usePathname()
  const courant = indexEcran(pathname)
  // Le menu replié (mobile) se souvient de l'écran où on l'a ouvert : changer d'écran le referme.
  const [ouvertSur, setOuvertSur] = useState<string | null>(null)
  const ouvert = ouvertSur === pathname
  return (
    <>
      <button
        className="menu-bouton"
        type="button"
        aria-expanded={ouvert}
        aria-controls="menu"
        onClick={() => setOuvertSur(ouvert ? null : pathname)}
      >
        {ouvert ? 'Fermer' : 'Menu'}
      </button>
      <nav id="menu" className="menu" data-ouvert={ouvert || undefined} aria-label="Sections">
        {ECRANS.map((e, i) => (
          <Link key={e.href} href={e.href} aria-current={i === courant ? 'page' : undefined}>
            {e.titre}
          </Link>
        ))}
        {/* Toujours là, toujours au même endroit : le menu ne bouge pas d'un écran à l'autre. */}
        <Link className="appel" href="/contact">
          Parler de votre projet
        </Link>
      </nav>
    </>
  )
}
