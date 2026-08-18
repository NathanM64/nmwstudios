'use client'

import { Infobulle } from '@/components/config/Infobulle'
import { GROUPES, OPTIONS, SOCLE_ID } from '@/lib/config/catalogue'
import { formaterEuros, suffixePrix, type Configuration } from '@/lib/config/devis'
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
        <fieldset key={groupe.id} className="border-0 p-0">
          <legend className="font-mono text-xs uppercase tracking-[0.08em] text-accent">
            {groupe.titre}
          </legend>
          <p className="mt-2 max-w-prose text-sm text-muted-foreground">{groupe.intro}</p>

          <div className="mt-4 flex flex-col gap-3">
            {OPTIONS.filter((o) => o.groupe === groupe.id).map((option) => {
              const n = config[option.id] ?? 0

              if (option.id === SOCLE_ID) {
                return (
                  // div, pas p : le popover de l'infobulle n'est pas du contenu phrasé.
                  <div key={option.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {option.libelle}
                      <Infobulle
                        id={option.id}
                        libelle={option.libelle}
                        texte={option.explication}
                        onOuvrir={() => onScene(sceneDeOption(option.id))}
                      />
                    </div>
                    <span className="font-mono text-muted-foreground">{formaterEuros(option.prix)}</span>
                  </div>
                )
              }

              if (option.quantifiable) {
                return (
                  <div key={option.id} className="flex items-center justify-between gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      {option.libelle}
                      <Infobulle
                        id={option.id}
                        libelle={option.libelle}
                        texte={option.explication}
                        onOuvrir={() => onScene(sceneDeOption(option.id))}
                      />
                    </div>
                    <span className="flex items-center gap-2">
                      <button
                        type="button"
                        aria-label={`Retirer : ${option.libelle}`}
                        onClick={() => poser(option.id, Math.max(0, n - 1))}
                        className="h-7 w-7 rounded-md border border-border"
                      >
                        −
                      </button>
                      <span className="flex items-baseline gap-1">
                        <span data-testid={`quantite-${option.id}`} aria-live="polite" className="w-4 text-right font-mono">
                          {n}
                        </span>
                        <span
                          data-testid={`unite-${option.id}`}
                          className="w-14 text-muted-foreground"
                        >
                          {option.quantifiable.suffixe}
                          {n > 1 ? 's' : ''}
                        </span>
                      </span>
                      <button
                        type="button"
                        aria-label={`Ajouter : ${option.libelle}`}
                        onClick={() => poser(option.id, Math.min(option.quantifiable!.max, n + 1))}
                        className="h-7 w-7 rounded-md border border-border"
                      >
                        +
                      </button>
                      <span className="w-20 text-right font-mono text-muted-foreground">
                        {suffixePrix(option)}
                      </span>
                    </span>
                  </div>
                )
              }

              const exclusif = groupe.exclusif === true

              return (
                // div en dehors : un bouton d'infobulle est lui aussi labelable, il ne peut pas
                // rejoindre l'input dans le même <label>.
                <div key={option.id} className="flex items-center justify-between gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2">
                      <input
                        type={exclusif ? 'radio' : 'checkbox'}
                        name={exclusif ? groupe.id : undefined}
                        checked={n > 0}
                        onChange={(e) =>
                          exclusif
                            ? choisirExclusif(groupe.id, option.id)
                            : poser(option.id, e.target.checked ? 1 : 0)
                        }
                        className="accent-accent"
                      />
                      {option.libelle}
                    </label>
                    <Infobulle
                      id={option.id}
                      libelle={option.libelle}
                      texte={option.explication}
                      onOuvrir={() => onScene(sceneDeOption(option.id))}
                    />
                  </div>
                  <span className="font-mono text-muted-foreground">{suffixePrix(option)}</span>
                </div>
              )
            })}
          </div>
        </fieldset>
      ))}
    </div>
  )
}
