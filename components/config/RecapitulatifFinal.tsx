'use client'

import { calculer, formaterEuros, type Configuration } from '@/lib/config/devis'
import { BoutonsAction } from '@/components/config/BoutonsAction'
import type { Ref } from 'react'

/** Reprend le contenu de la barre fixe, en fin de panneau : les deux ne coexistent jamais. */
export function RecapitulatifFinal({
  config,
  copie,
  onCopier,
  ref,
}: {
  config: Configuration
  copie: 'succes' | 'echec' | null
  onCopier: () => void
  ref?: Ref<HTMLDivElement>
}) {
  const devis = calculer(config)

  return (
    <div ref={ref} data-testid="recapitulatif-final" className="panel mt-12 flex flex-col gap-4 p-6">
      <p aria-live="polite" className="font-mono text-lg tabular-nums">
        {formaterEuros(devis.bas)} – {formaterEuros(devis.haut)}
      </p>
      {devis.mensuel > 0 && (
        <p aria-live="polite" className="font-mono text-sm text-muted-foreground tabular-nums">
          puis {formaterEuros(devis.mensuel)}/mois
        </p>
      )}
      <BoutonsAction copie={copie} onCopier={onCopier} />
    </div>
  )
}
