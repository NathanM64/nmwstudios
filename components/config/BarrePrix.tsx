'use client'

import { useEffect, useRef, useState } from 'react'
import { calculer, formaterEuros, type Configuration } from '@/lib/config/devis'

export function BarrePrix({ config, pret }: { config: Configuration; pret: boolean }) {
  const devis = calculer(config)
  const precedent = useRef({ total: devis.total, mensuel: devis.mensuel })
  const armee = useRef(false)
  const [delta, setDelta] = useState<{ montant: number; cle: number; unite: 'forfait' | 'mensuel' } | null>(null)

  // Le minuteur démonte le delta y compris sous `prefers-reduced-motion`,
  // où `animation: none` ne déclenche jamais `onAnimationEnd`.
  useEffect(() => {
    if (!pret) return
    if (!armee.current) {
      // Première passe une fois l'URL lue : pose la référence sans animer, sinon
      // la configuration d'un lien partagé s'afficherait comme un delta de l'utilisateur.
      armee.current = true
      precedent.current = { total: devis.total, mensuel: devis.mensuel }
      return
    }
    const ecartTotal = devis.total - precedent.current.total
    const ecartMensuel = devis.mensuel - precedent.current.mensuel
    precedent.current = { total: devis.total, mensuel: devis.mensuel }

    // Une option ne touche jamais les deux à la fois : le forfait prime s'il change.
    if (ecartTotal !== 0) setDelta({ montant: ecartTotal, cle: Date.now(), unite: 'forfait' })
    else if (ecartMensuel !== 0) setDelta({ montant: ecartMensuel, cle: Date.now(), unite: 'mensuel' })
    else return

    const minuteur = setTimeout(() => setDelta(null), 1800)
    return () => clearTimeout(minuteur)
  }, [devis.total, devis.mensuel, pret])

  return (
    <div className="panel fixed inset-x-0 bottom-0 z-40 border-t border-border px-5 py-3 sm:px-8">
      <div className="mx-auto flex w-full max-w-5xl items-baseline justify-between gap-4">
        <p className="flex min-w-0 flex-wrap items-baseline gap-x-3">
          <span data-testid="fourchette" aria-live="polite" className="font-mono text-lg tabular-nums">
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
              {delta.unite === 'mensuel' && '/mois'}
            </span>
          )}
        </p>
        <p data-testid="mensuel" aria-live="polite" className="font-mono text-sm text-muted-foreground tabular-nums">
          puis {formaterEuros(devis.mensuel)}/mois
        </p>
      </div>
    </div>
  )
}
