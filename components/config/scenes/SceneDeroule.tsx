'use client'

import { memo } from 'react'
import type { Configuration } from '@/lib/config/devis'
import { LigneDeTemps } from '@/components/config/blocs/deroule/LigneDeTemps'
import { Mensuel } from '@/components/config/blocs/deroule/Mensuel'

export const SceneDeroule = memo(function SceneDeroule({ config }: { config: Configuration }) {
  return (
    <div className="animate-apparait m-air m-marge m-contenu flex flex-1 flex-col">
      <LigneDeTemps config={config} />

      <Mensuel config={config} />
    </div>
  )
})
