'use client'

import { useEffect, useState } from 'react'

export type Vue = { src: string; alt: string; titre: string }

// Trois vues qui défilent lentement. Le survol, le clavier et prefers-reduced-motion l'arrêtent.
export function Carrousel({ vues, legende }: { vues: readonly Vue[]; legende: string }) {
  const [i, setI] = useState(0)
  const [pause, setPause] = useState(false)

  useEffect(() => {
    if (pause || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setI((n) => (n + 1) % vues.length), 4500)
    return () => clearInterval(t)
  }, [pause, vues.length])

  return (
    <figure
      className="carrousel"
      aria-roledescription="carrousel"
      onMouseEnter={() => setPause(true)}
      onMouseLeave={() => setPause(false)}
      onFocus={() => setPause(true)}
      onBlur={() => setPause(false)}
    >
      <div className="vues">
        {vues.map((v, n) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={v.src} src={v.src} alt={v.alt} width={1650} height={1000} loading="lazy" data-active={n === i || undefined} />
        ))}
      </div>
      <div className="points" role="tablist" aria-label="Vues">
        {vues.map((v, n) => (
          <button key={v.src} type="button" role="tab" aria-selected={n === i} aria-label={v.titre} onClick={() => setI(n)}>
            <span>{v.titre}</span>
          </button>
        ))}
      </div>
      <figcaption>{legende}</figcaption>
    </figure>
  )
}
