'use client'

import { useState } from 'react'
import { preload } from 'react-dom'
import { usePathname } from 'next/navigation'
import { indexEcran } from '@/content/ecrans'

// Une matière par écran, dans l'ordre du menu. Rien derrière les documents.
const MATIERES = ['eau', 'soie', 'verre', 'ardoise', 'pluie'] as const

const srcSet = (m: string) => `/fonds/${m}-1200.webp 1200w, /fonds/${m}.webp 2048w`

export function Fond() {
  const i = indexEcran(usePathname())
  const [pret, setPret] = useState(false)
  // Les autres fonds sont demandés tout de suite : au changement d'écran, l'image est déjà là.
  for (const m of MATIERES) {
    if (m !== MATIERES[i]) preload(`/fonds/${m}.webp`, { as: 'image', imageSrcSet: srcSet(m), imageSizes: '100vw', fetchPriority: 'low' })
  }
  if (i < 0) return null
  const m = MATIERES[i]
  return (
    <div className="fond" data-matiere={m} data-pret={pret || undefined} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/fonds/${m}.webp`}
        srcSet={srcSet(m)}
        sizes="100vw"
        alt=""
        fetchPriority="high"
        onLoad={() => setPret(true)}
        ref={(el) => {
          if (el?.complete && el.naturalWidth > 0) setPret(true)
        }}
      />
    </div>
  )
}
