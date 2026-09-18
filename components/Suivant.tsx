'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { dico, indexEcran, langueDuChemin } from '@/content'

// Le pied du cadre : où l'on est, et l'écran d'après.
export function Suivant() {
  const pathname = usePathname()
  const t = dico(langueDuChemin(pathname))
  const i = indexEcran(pathname)
  if (i < 0) return null
  const suivant = t.ecrans[i + 1]
  return (
    <p className="suivant-lien">
      <span className="compteur">
        {String(i + 1).padStart(2, '0')} / {String(t.ecrans.length).padStart(2, '0')}
      </span>
      {suivant ? (
        <Link href={t.routes[suivant.cle]}>
          <span>{t.chrome.suivant}</span> {suivant.titre}
        </Link>
      ) : (
        <Link href={t.routes.accueil}>
          <span>{t.chrome.retour}</span> {t.ecrans[0].titre}
        </Link>
      )}
    </p>
  )
}
