'use client'

import { usePathname } from 'next/navigation'
import { indexEcran } from '@/content/ecrans'

// Une matière par écran, dans l'ordre du menu. Rien derrière les documents.
const MATIERES = ['eau', 'soie', 'verre', 'ardoise', 'pluie'] as const

export function Fond() {
  const i = indexEcran(usePathname())
  if (i < 0) return null
  const m = MATIERES[i]
  return (
    <div className="fond" data-matiere={m} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/fonds/${m}.webp`}
        srcSet={`/fonds/${m}-1200.webp 1200w, /fonds/${m}.webp 2048w`}
        sizes="100vw"
        alt=""
        fetchPriority="high"
      />
    </div>
  )
}
