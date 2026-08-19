'use client'

import type { Configuration } from '@/lib/config/devis'
import type { SceneId } from '@/lib/config/scenes'
import { SceneSite } from '@/components/config/scenes/SceneSite'
import { ScenePreuve } from '@/components/config/scenes/ScenePreuve'
import { SceneDeroule } from '@/components/config/scenes/SceneDeroule'
import { VignettesScene } from '@/components/config/VignettesScene'

export function Apercu({
  config,
  scene,
  onChange,
}: {
  config: Configuration
  scene: SceneId
  onChange: (scene: SceneId) => void
}) {
  return (
    <div data-testid="apercu" className="panel flex min-h-[26rem] w-full flex-col overflow-hidden lg:min-h-0 lg:flex-1">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-3 py-1.5">
        <VignettesScene scene={scene} onChange={onChange} />
        <p className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">aperçu, pas votre futur site</p>
      </div>
      {/* Hauteur définie par le rapport sous lg, par le flux au-dessus : `container-type: size`
          exige une hauteur qui ne dépende pas du contenu. */}
      <div className="cadre-maquette m-3 aspect-3/4 max-h-[26rem] min-h-0 lg:aspect-auto lg:max-h-none lg:flex-1">
        <div
          data-testid="objet-scene"
          className="maquette-echelle flex overflow-hidden rounded-md border border-border-strong bg-maquette shadow-(--shadow-elevated)"
        >
          {scene === 'site' && <SceneSite config={config} />}
          {scene === 'preuve' && <ScenePreuve config={config} />}
          {scene === 'deroule' && <SceneDeroule config={config} />}
        </div>
      </div>
    </div>
  )
}
