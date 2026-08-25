'use client'

import { useEffect, useState } from 'react'
import { lireChargement } from '@/lib/config/mesure'

export function Cascade() {
  const [vitesse, setVitesse] = useState<number | null>(null)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mesure ponctuelle au montage, la seule vraie source de la scène.
    setVitesse(lireChargement(performance.getEntriesByType('navigation')))
  }, [])

  return (
    <>
      {/* Artefact visuel, aucune requête simulée : la mesure vient du texte en dessous. */}
      <div data-testid="preuve-cascade" className="animate-construit m-cascade flex flex-col gap-0.5">
        {[100, 65, 40, 20].map((largeur, i) => (
          <span key={i} className="m-barre h-0.5" style={{ width: `${largeur}%` }} />
        ))}
      </div>
      <p data-testid="preuve-vitesse" className="m-corps m-accent truncate">
        {vitesse === null
          ? 'mesure indisponible'
          : `mesuré sur ce configurateur, pas sur votre futur site : ${vitesse.toFixed(2).replace('.', ',')} s`}
      </p>
    </>
  )
}
