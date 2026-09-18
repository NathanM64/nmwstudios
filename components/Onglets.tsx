'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { dico, langueDuChemin, sansBarre } from '@/content'

// Deux états du même écran, chacun sa route.
export function Onglets() {
  const chemin = sansBarre(usePathname())
  const t = dico(langueDuChemin(chemin))
  const onglets = [
    [t.routes.methode, t.methode.onglets[0]],
    [t.routes.refus, t.methode.onglets[1]],
  ] as const
  return (
    <nav className="onglets" aria-label={t.methode.onglets[0]}>
      {onglets.map(([href, titre]) => (
        <Link key={href} href={href} aria-current={chemin === href ? 'page' : undefined}>
          {titre}
        </Link>
      ))}
    </nav>
  )
}
