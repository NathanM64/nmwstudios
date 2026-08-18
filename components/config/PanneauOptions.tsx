'use client'

import { CarteOption } from '@/components/config/CarteOption'
import { GROUPES, OPTIONS } from '@/lib/config/catalogue'
import type { Configuration } from '@/lib/config/devis'
import { sceneDeOption, type SceneId } from '@/lib/config/scenes'

export function PanneauOptions({
  config,
  onChange,
  onScene,
}: {
  config: Configuration
  onChange: (config: Configuration) => void
  onScene: (scene: SceneId) => void
}) {
  const poser = (id: string, n: number) => {
    onChange({ ...config, [id]: n })
    onScene(sceneDeOption(id))
  }

  const choisirExclusif = (groupe: string, id: string) => {
    const suivant = { ...config }
    for (const o of OPTIONS) if (o.groupe === groupe) delete suivant[o.id]
    suivant[id] = 1
    onChange(suivant)
    onScene(sceneDeOption(id))
  }

  return (
    <div className="flex flex-col gap-12">
      {GROUPES.map((groupe) => (
        <fieldset key={groupe.id} className="border-0 p-0" aria-labelledby={`legende-${groupe.id}`}>
          <div
            id={`legende-${groupe.id}`}
            data-testid={`legende-${groupe.id}`}
            className="sticky top-0 z-10 -mx-1 bg-canvas/85 px-1 py-2 font-mono text-xs uppercase tracking-[0.08em] text-accent backdrop-blur-sm"
          >
            {groupe.titre}
          </div>
          <p className="mt-2 max-w-prose text-sm text-muted-foreground">{groupe.intro}</p>

          <div className="mt-4 flex flex-col gap-2">
            {OPTIONS.filter((o) => o.groupe === groupe.id).map((option) => (
              <CarteOption
                key={option.id}
                option={option}
                quantite={config[option.id] ?? 0}
                exclusif={groupe.exclusif === true}
                onPoser={poser}
                onChoisirExclusif={choisirExclusif}
              />
            ))}
          </div>
        </fieldset>
      ))}
    </div>
  )
}
