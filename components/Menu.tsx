'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { dico, equivalent, indexEcran, langueDuChemin } from '@/content'
import type { Langue } from '@/content/types'

export function Menu() {
  const pathname = usePathname()
  const t = dico(langueDuChemin(pathname))
  const courant = indexEcran(pathname)
  const autre: Langue = t.langue === 'fr' ? 'en' : 'fr'
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
        {/* Un <a> ordinaire : changer de racine recharge la page. Le cookie retient le choix pour la
            redirection de l'accueil. */}
        <a
          className="langue"
          href={equivalent(pathname, autre)}
          hrefLang={autre}
          lang={autre}
          aria-label={t.chrome.changerLangue}
          onClick={() => {
            document.cookie = `lang=${autre}; path=/; max-age=31536000; SameSite=Lax`
          }}
        >
          {t.chrome.autreLangue}
        </a>
      </nav>
    </>
  )
}
