'use client'

import { SCENES, type SceneId } from '@/lib/config/scenes'

/** Repères de position, pas sélecteurs de scène : `partie` est celle que la fenêtre montre,
 *  et presser un repère y amène la page. */
export function VignettesScene({
  partie,
  onPartie,
}: {
  partie: SceneId
  onPartie: (partie: SceneId) => void
}) {
  return (
    <div role="group" aria-label="Point de vue de l’aperçu" className="flex flex-wrap items-center gap-2">
      {SCENES.map((s) => {
        const actif = s.id === partie
        return (
          <button
            key={s.id}
            type="button"
            data-testid={`onglet-${s.id}`}
            aria-pressed={actif}
            onClick={() => onPartie(s.id)}
            className={`min-h-9 rounded-md border px-3 py-1.5 text-xs transition-colors duration-(--dur-micro) ${
              actif
                ? 'border-accent text-foreground'
                : 'border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {s.libelle}
            {/* Soulignement de l'actif, pas une jauge : il double le liseré du bouton et ne porte
                aucun avancement. Rien ici ne se remplit avec la progression. */}
            <span
              aria-hidden="true"
              className={`mt-1 block h-px w-full transition-colors duration-(--dur-micro) ${
                actif ? 'bg-accent' : 'bg-transparent'
              }`}
            />
          </button>
        )
      })}
    </div>
  )
}
