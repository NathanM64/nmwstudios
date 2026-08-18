'use client'

import { Infobulle } from '@/components/config/Infobulle'
import { GROUPES, OPTIONS, SOCLE_ID, type Option } from '@/lib/config/catalogue'
import { formaterEuros, type Configuration } from '@/lib/config/devis'

function suffixePrix(option: Option): string {
  return option.unite === 'mensuel'
    ? `${formaterEuros(option.prix)}/mois`
    : option.unite === 'pourcentage'
      ? `+${option.prix} %`
      : `+${formaterEuros(option.prix)}`
}

export function PanneauOptions({
  config,
  onChange,
}: {
  config: Configuration
  onChange: (config: Configuration) => void
}) {
  const poser = (id: string, n: number) => onChange({ ...config, [id]: n })

  const choisirExclusif = (groupe: string, id: string) => {
    const suivant = { ...config }
    for (const o of OPTIONS) if (o.groupe === groupe) delete suivant[o.id]
    suivant[id] = 1
    onChange(suivant)
  }

  return (
    <div className="flex flex-col gap-8">
      {GROUPES.map((groupe) => (
        <fieldset key={groupe.id} className="border-0 p-0">
          <legend className="font-mono text-xs uppercase tracking-[0.08em] text-accent">
            {groupe.titre}
          </legend>

          <div className="mt-3 flex flex-col gap-2">
            {OPTIONS.filter((o) => o.groupe === groupe.id).map((option) => {
              const n = config[option.id] ?? 0

              if (option.id === SOCLE_ID) {
                return (
                  // div, pas p : le popover de l'infobulle n'est pas du contenu phrasé.
                  <div key={option.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {option.libelle}
                      <Infobulle id={option.id} libelle={option.libelle} texte={option.explication} />
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
                      <Infobulle id={option.id} libelle={option.libelle} texte={option.explication} />
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
                      <span data-testid={`quantite-${option.id}`} className="w-4 text-center font-mono">
                        {n}
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
                    <Infobulle id={option.id} libelle={option.libelle} texte={option.explication} />
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
