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
      <div
        data-testid="objet-scene"
        className="m-3 flex-1 overflow-hidden rounded-md border border-border-strong bg-surface-raised shadow-(--shadow-elevated)"
      >
        {scene === 'site' && <SceneSite config={config} />}
        {scene === 'preuve' && <ScenePreuve config={config} />}
        {scene === 'deroule' && <SceneDeroule config={config} />}
      </div>
    </div>
  )
}
