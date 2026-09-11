'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { OFFRES, hrefOffre } from '@/content/offres'

export function ListeOffres() {
  const chemin = usePathname().replace(/\/+$/, '')
  return (
    <nav className="liste" aria-label="Offres">
      {OFFRES.map((o) => (
        <Link
          key={o.slug}
          href={hrefOffre(o)}
          transitionTypes={['detail']}
          aria-current={chemin === hrefOffre(o) ? 'page' : undefined}
        >
          {o.titre}
        </Link>
      ))}
    </nav>
  )
}
