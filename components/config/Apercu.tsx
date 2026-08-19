'use client'

import type { Configuration } from '@/lib/config/devis'
import type { SceneId } from '@/lib/config/scenes'
import type { DomaineId } from '@/lib/config/domaines'
import { styleParId, type StyleId } from '@/lib/config/styles'
import { SceneSite } from '@/components/config/scenes/SceneSite'
import { ScenePreuve } from '@/components/config/scenes/ScenePreuve'
import { SceneDeroule } from '@/components/config/scenes/SceneDeroule'
import { SelecteursMaquette } from '@/components/config/SelecteursMaquette'
import { VignettesScene } from '@/components/config/VignettesScene'

export function Apercu({
  config,
  scene,
  domaine,
  style,
  onChange,
  onDomaine,
  onStyle,
}: {
  config: Configuration
  scene: SceneId
  domaine: DomaineId
  style: StyleId
  onChange: (scene: SceneId) => void
  onDomaine: (domaine: DomaineId) => void
  onStyle: (style: StyleId) => void
}) {
  return (
    <div data-testid="apercu" className="panel flex min-h-[26rem] w-full flex-col overflow-hidden lg:min-h-0 lg:flex-1">
      <div className="border-b border-border px-3 py-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <VignettesScene scene={scene} onChange={onChange} />
          <p className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">aperçu, pas votre futur site</p>
        </div>
        <SelecteursMaquette domaine={domaine} style={style} onDomaine={onDomaine} onStyle={onStyle} />
      </div>
      {/* Hauteur définie par le rapport sous lg, par le flux au-dessus : `container-type: size`
          exige une hauteur qui ne dépende pas du contenu. */}
      <div className="cadre-maquette m-3 aspect-3/4 max-h-[26rem] min-h-0 lg:aspect-auto lg:max-h-none lg:flex-1">
        <div
          data-testid="objet-scene"
          className="maquette-echelle flex overflow-hidden rounded-md border border-border-strong shadow-(--shadow-elevated)"
        >
          {/* Racine de la maquette : elle porte la palette du style et rien du site.
              Les scènes ne lisent que des variables `--m-*` posées ici. */}
          <div
            data-testid="maquette"
            style={
              {
                ...styleParId(style)!.variables,
                backgroundColor: 'var(--m-fond)',
                color: 'var(--m-texte)',
                fontFamily: 'var(--m-corps-famille)',
                fontWeight: 'var(--m-corps-graisse)',
              } as React.CSSProperties
            }
            className="flex min-w-0 flex-1"
          >
            {scene === 'site' && <SceneSite config={config} domaine={domaine} />}
            {scene === 'preuve' && <ScenePreuve config={config} domaine={domaine} />}
            {scene === 'deroule' && <SceneDeroule config={config} />}
          </div>
        </div>
      </div>
    </div>
  )
}
