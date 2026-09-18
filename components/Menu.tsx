'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { dico, indexEcran, langueDuChemin } from '@/content'

export function Menu() {
  const pathname = usePathname()
  const t = dico(langueDuChemin(pathname))
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
        {ouvert ? t.chrome.fermer : t.chrome.menu}
      </button>
      <nav id="menu" className="menu" data-ouvert={ouvert || undefined} aria-label={t.chrome.sections}>
        {t.ecrans.map((e, i) => (
          <Link key={e.cle} href={t.routes[e.cle]} aria-current={i === courant ? 'page' : undefined}>
            {e.titre}
          </Link>
        ))}
        {/* Toujours là, toujours au même endroit : le menu ne bouge pas d'un écran à l'autre. */}
        <Link className="appel" href={t.routes.contact}>
          {t.chrome.appel}
        </Link>
      </nav>
    </>
  )
}
