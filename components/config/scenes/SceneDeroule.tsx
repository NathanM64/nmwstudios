import { OPTIONS } from '@/lib/config/catalogue'
import type { Configuration } from '@/lib/config/devis'

/** Dérivé du catalogue : une formule y ajoutée porte sa carte, sinon elle n'apparaît pas ici. */
const OPTIONS_RECURRENTES = OPTIONS.filter((o) => o.groupe === 'recurrent')

export function SceneDeroule({ config }: { config: Configuration }) {
  const formule = OPTIONS_RECURRENTES.find((o) => (config[o.id] ?? 0) > 0)

  return (
    <div className="animate-apparait flex flex-1 flex-col">
      <div className="flex flex-1 items-center p-4">
        <p data-testid="apercu-planning" className="animate-apparait text-[0.5rem] text-muted-foreground">
          Cadrage, formation, livraison accélérée : rien de tout ça ne se voit sur une page.
        </p>
      </div>

      <div className="flex flex-1 items-center p-4">
        {formule ? (
          <p data-testid="carte-etat" className="animate-apparait rounded-sm border border-border px-2 py-1 text-[0.5rem] text-muted-foreground">
            {formule.carte}
          </p>
        ) : (
          <p data-testid="apercu-exploitation-vide" className="animate-apparait text-[0.5rem] text-muted-foreground">
            Aucune formule d’accompagnement retenue pour l’instant.
          </p>
        )}
      </div>
    </div>
  )
}
