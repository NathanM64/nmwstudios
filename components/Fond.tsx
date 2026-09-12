'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
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

// La mer bouge sur bureau seulement, et pas pour qui préfère moins de mouvement.
const REQUETE = '(min-width: 721px) and (prefers-reduced-motion: no-preference)'
const abonner = (cb: () => void) => {
  const mq = matchMedia(REQUETE)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}
const usePeutBouger = () => useSyncExternalStore(abonner, () => matchMedia(REQUETE).matches, () => false)

export function Fond() {
  const i = indexEcran(usePathname())
  const m = i >= 0 ? MATIERES[i] : null
  // « net » : l'image était déjà là ; « fondu » : elle vient d'arriver, elle apparaît en douceur.
  const [etat, setEtat] = useState<'net' | 'fondu' | null>(() => (m && chargees.has(m) ? 'net' : null))
  const bouge = usePeutBouger()
  const [joue, setJoue] = useState(false)
  for (const autre of MATIERES) {
    if (autre !== m) preload(`/fonds/${autre}.webp`, { as: 'image', imageSrcSet: srcSet(autre), imageSizes: '100vw', fetchPriority: 'low' })
  }
  useEffect(precharger, [])
  // Chargée avant l'hydratation, l'image n'enverra jamais son événement : on regarde son état au montage.
  const img = useRef<HTMLImageElement>(null)
  useEffect(() => {
    const el = img.current
    if (m && el?.complete && el.naturalWidth > 0) {
      chargees.add(m)
      setEtat((e) => e ?? 'net')
    }
  }, [m])
  if (!m) return null
  return (
    <div className="fond" data-matiere={m} data-pret={etat ?? undefined} data-video={joue || undefined} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/fonds/${m}.webp`}
        srcSet={srcSet(m)}
        sizes="100vw"
        alt=""
        fetchPriority="high"
        ref={img}
        onLoad={() => {
          chargees.add(m)
          setEtat((e) => e ?? 'fondu')
        }}
      />
      {m === 'eau' && bouge && (
        <video src="/fonds/eau.mp4" autoPlay muted loop playsInline preload="auto" onPlaying={() => setJoue(true)} />
      )}
    </div>
  )
}
