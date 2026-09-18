'use client'

import { useEffect, useRef, useState } from 'react'
import type { Vue } from '@/content/types'

type Textes = { agrandir: string; agrandirTitre: string; vues: string }

// Trois vues qui se relaient lentement. Le survol, le clavier et prefers-reduced-motion les arrêtent.
// Un clic ouvre la vue en grand.
export function Carrousel({ vues, legende, textes }: { vues: readonly Vue[]; legende: string; textes: Textes }) {
  const [i, setI] = useState(0)
  const [pause, setPause] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (pause || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setI((n) => (n + 1) % vues.length), 4500)
    return () => clearInterval(t)
  }, [pause, vues.length])

  const ouvrir = () => {
    setPause(true)
    dialog.current?.showModal()
  }
  const fermer = () => {
    dialog.current?.close()
    setPause(false)
  }

  return (
    <figure
      className="carrousel"
      aria-roledescription="carrousel"
      onMouseEnter={() => setPause(true)}
      onMouseLeave={() => setPause(false)}
      onFocus={() => setPause(true)}
      onBlur={() => setPause(false)}
    >
      <figcaption>{legende}</figcaption>
      <button type="button" className="vues" onClick={ouvrir} aria-label={`${textes.agrandirTitre} ${vues[i].titre}`}>
        {vues.map((v, n) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={v.src} src={v.src} alt={v.alt} width={1650} height={1000} loading="lazy" data-active={n === i || undefined} />
        ))}
        <span className="agrandir">{textes.agrandir}</span>
      </button>
      <div className="points" role="tablist" aria-label={textes.vues}>
        {vues.map((v, n) => (
          <button key={v.src} type="button" role="tab" aria-selected={n === i} onClick={() => setI(n)}>
            {v.titre}
          </button>
        ))}
      </div>
      <dialog ref={dialog} className="grand" onClick={fermer} onClose={() => setPause(false)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={vues[i].src} alt={vues[i].alt} width={1650} height={1000} />
        <p>
          {vues[i].titre}. {legende}
        </p>
      </dialog>
    </figure>
  )
}
