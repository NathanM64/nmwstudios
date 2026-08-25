'use client'

import type { DomaineId } from '@/lib/config/domaines'
import type { Langue } from '@/lib/config/maquette'
import type { Configuration } from '@/lib/config/devis'
import { Redaction } from '@/components/config/blocs/site/Redaction'
import { Reprise } from '@/components/config/blocs/site/Reprise'

export function Textes({
  config,
  domaine,
  langue,
}: {
  config: Configuration
  domaine: DomaineId
  langue: Langue
}) {
  // Rédaction et reprise se cumulent, et l'enveloppe ne se rend que si l'une des deux se rend :
  // vide, elle prendrait une gouttière.
  if ((config.redaction ?? 0) === 0 && (config.reprise ?? 0) === 0) return null

  return (
    <div className="m-air-serre flex shrink-0 flex-col">
      <Redaction config={config} domaine={domaine} langue={langue} />
      <Reprise config={config} domaine={domaine} langue={langue} />
    </div>
  )
}
