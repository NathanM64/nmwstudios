'use client'

import { useEffect, useState } from 'react'
import { preload } from 'react-dom'
import { usePathname } from 'next/navigation'
import { indexEcran } from '@/content/ecrans'

// Une matière par écran, dans l'ordre du menu. Rien derrière les documents.
const MATIERES = ['eau', 'soie', 'verre', 'ardoise', 'pluie'] as const
type Matiere = (typeof MATIERES)[number]

const srcSet = (m: string) => `/fonds/${m}-1200.webp 1200w, /fonds/${m}.webp 2048w`

// Les matières déjà chargées dans ce navigateur : elles s'affichent nettes, sans fondu.
const chargees = new Set<Matiere>()
let prechargees = false
function precharger() {
  if (prechargees) return
  prechargees = true
  for (const m of MATIERES) {
    const im = new Image()
    im.onload = () => chargees.add(m)
    im.sizes = '100vw'
    im.srcset = srcSet(m)
  }
}

export function Fond() {
  const i = indexEcran(usePathname())
  const m = i >= 0 ? MATIERES[i] : null
  // « net » : l'image était déjà là ; « fondu » : elle vient d'arriver, elle apparaît en douceur.
  const [etat, setEtat] = useState<'net' | 'fondu' | null>(() => (m && chargees.has(m) ? 'net' : null))
  for (const autre of MATIERES) {
    if (autre !== m) preload(`/fonds/${autre}.webp`, { as: 'image', imageSrcSet: srcSet(autre), imageSizes: '100vw', fetchPriority: 'low' })
  }
  useEffect(precharger, [])
  if (!m) return null
  return (
    <div className="fond" data-matiere={m} data-pret={etat ?? undefined} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/fonds/${m}.webp`}
        srcSet={srcSet(m)}
        sizes="100vw"
        alt=""
        fetchPriority="high"
        onLoad={() => {
          chargees.add(m)
          setEtat((e) => e ?? 'fondu')
        }}
      />
    </div>
  )
}
