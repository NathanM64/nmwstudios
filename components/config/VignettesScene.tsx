'use client'

import { SCENES, type SceneId } from '@/lib/config/scenes'

export function VignettesScene({
  scene,
  onChange,
}: {
  scene: SceneId
  onChange: (scene: SceneId) => void
}) {
  return (
    <div role="group" aria-label="Point de vue de l’aperçu" className="flex flex-wrap items-center gap-2">
      {SCENES.map((s) => {
        const actif = s.id === scene
        return (
          <button
            key={s.id}
            type="button"
            data-testid={`onglet-${s.id}`}
            aria-pressed={actif}
            onClick={() => onChange(s.id)}
            className={`min-h-8 rounded-md border px-3 py-1 text-xs transition-colors duration-(--dur-micro) ${
              actif
                ? 'border-accent text-foreground'
                : 'border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {s.libelle}
          </button>
        )
      })}
    </div>
  )
}
