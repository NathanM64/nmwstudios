'use client'

import type { Configuration } from '@/lib/config/devis'
import type { SceneId } from '@/lib/config/scenes'
import { SceneSite } from '@/components/config/scenes/SceneSite'
import { ScenePreuve } from '@/components/config/scenes/ScenePreuve'
import { SceneDeroule } from '@/components/config/scenes/SceneDeroule'

export function Apercu({ config, scene }: { config: Configuration; scene: SceneId }) {
  return (
    <div data-testid="apercu" className="panel flex min-h-[26rem] w-full flex-col overflow-hidden lg:min-h-0 lg:flex-1">
      {scene === 'site' && <SceneSite config={config} />}
      {scene === 'preuve' && <ScenePreuve config={config} />}
      {scene === 'deroule' && <SceneDeroule config={config} />}
    </div>
  )
}
