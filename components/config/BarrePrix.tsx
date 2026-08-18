'use client'

import { useEffect, useRef, useState } from 'react'
import { calculer, formaterEuros, type Configuration } from '@/lib/config/devis'

export function BarrePrix({ config }: { config: Configuration }) {
  const devis = calculer(config)
  const precedent = useRef(devis.total)
  const [delta, setDelta] = useState<{ montant: number; cle: number } | null>(null)

  // Le minuteur démonte le delta y compris sous `prefers-reduced-motion`,
  // où `animation: none` ne déclenche jamais `onAnimationEnd`.
  useEffect(() => {
    const ecart = devis.total - precedent.current
    precedent.current = devis.total
    if (ecart === 0) return
    setDelta({ montant: ecart, cle: Date.now() })
    const minuteur = setTimeout(() => setDelta(null), 1800)
    return () => clearTimeout(minuteur)
  }, [devis.total])

  return (
    <div className="panel fixed inset-x-0 bottom-0 z-40 border-t border-border px-5 py-3 sm:px-8">
      <div className="mx-auto flex w-full max-w-5xl items-baseline justify-between gap-4">
        <p className="flex min-w-0 flex-wrap items-baseline gap-x-3">
          <span data-testid="fourchette" className="font-mono text-lg tabular-nums">
            {formaterEuros(devis.bas)} – {formaterEuros(devis.haut)}
          </span>
          {delta && (
            <span
              key={delta.cle}
              data-testid="delta"
              className="animate-delta font-mono text-xs text-accent"
            >
              {delta.montant > 0 ? '+' : '−'}
              {formaterEuros(Math.abs(delta.montant))}
            </span>
          )}
        </p>
        <p data-testid="mensuel" className="font-mono text-sm text-muted-foreground tabular-nums">
          puis {formaterEuros(devis.mensuel)}/mois
        </p>
      </div>
    </div>
  )
}
