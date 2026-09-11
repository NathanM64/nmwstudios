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
    </nav>
  )
}
