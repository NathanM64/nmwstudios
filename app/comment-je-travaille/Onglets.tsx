'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const ONGLETS = [
  ['/comment-je-travaille', 'Comment je travaille'],
  ['/comment-je-travaille/ce-que-je-ne-fais-pas', 'Ce que je ne fais pas'],
] as const

// Deux états du même écran, chacun sa route.
export function Onglets() {
  const chemin = usePathname().replace(/\/+$/, '')
  return (
    <nav className="onglets" aria-label="Comment je travaille">
      {ONGLETS.map(([href, titre]) => (
        <Link key={href} href={href} aria-current={chemin === href ? 'page' : undefined}>
          {titre}
        </Link>
      ))}
    </nav>
  )
}
