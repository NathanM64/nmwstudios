import { OPTIONS } from '@/lib/config/catalogue'
import type { Configuration } from '@/lib/config/devis'
import { calculerDeroule } from '@/lib/config/duree'

const OPTIONS_RECURRENTES = OPTIONS.filter((o) => o.groupe === 'recurrent')

/** Texte des rendez-vous mensuels par formule. Vide pour l'auto-gestion : géré plus bas par un message, jamais un cadre muet. */
const EVENEMENTS: Record<string, string[]> = {
  'sans-suivi': [],
  heberg: ['Hébergement et domaine', 'Certificat renouvelé'],
  essentiel: ['Sauvegarde quotidienne', 'Mises à jour et correctifs', 'Surveillance'],
  serenite: ['Sauvegarde quotidienne', 'Mises à jour et correctifs', 'Surveillance', 'Intervention sous 4 h', '1 h de modifications'],
  partenaire: ['Sauvegarde quotidienne', 'Mises à jour et correctifs', 'Surveillance', 'Intervention sous 4 h', 'Évolutions', 'Rapport mensuel'],
}

/** Pire cas réel du catalogue, cadrage et formation compris, express décoché : la livraison
 *  accélérée raccourcit la construction, elle ne peut jamais allonger le plafond. Sert d'échelle
 *  fixe à la piste ; sans elle, une option lourde ne changerait que la part du total, jamais la
 *  largeur en pixels. */
const CONFIG_MAX: Configuration = Object.fromEntries(
  OPTIONS.map((o) => [o.id, o.id === 'express' ? 0 : (o.quantifiable?.max ?? 1)])
)
const ECHELLE_SEMAINES = calculerDeroule(CONFIG_MAX).total

function formaterSemaines(semaines: number): string {
  const valeur = Math.round(semaines * 10) / 10
  return `${valeur.toString().replace('.', ',')} semaine${valeur > 1 ? 's' : ''}`
}

export function SceneDeroule({ config }: { config: Configuration }) {
  const deroule = calculerDeroule(config)
  const formule = OPTIONS_RECURRENTES.find((o) => (config[o.id] ?? 0) > 0)
  const evenements = EVENEMENTS[formule?.id ?? 'sans-suivi'] ?? []

  // Pourcentages du total courant, dans une piste elle-même mise à l'échelle du pire cas :
  // une option lourde élargit la barre en pixels, pas seulement sa part du total.
  const pct = (semaines: number) => `${(semaines / deroule.total) * 100}%`

  // Un repère ponctuel a une largeur propre : à `left: 100%`, il dépasse la piste de sa propre
  // largeur. translateX(-P%) où P est le même pourcentage recule le bord qui sort d'autant,
  // sans jamais reculer plus qu'il ne faut à gauche : confinement exact à toute position.
  const decalage = (semaines: number) => `translateX(-${(semaines / deroule.total) * 100}%)`

  return (
    <div className="animate-apparait flex flex-1 flex-col gap-6 p-3">
      <div className="flex flex-col gap-2">
        <p className="text-[0.5rem] uppercase tracking-wider text-accent">Déroulé du projet</p>

        <div
          data-testid="deroule-piste"
          className="relative h-5"
          style={{ width: `${Math.min(100, (deroule.total / ECHELLE_SEMAINES) * 100)}%` }}
        >
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border" />

          {deroule.cadrage > 0 && (
            <div
              data-testid="deroule-cadrage"
              className="animate-apparait absolute top-0.5 bottom-0.5 min-w-[3px] rounded-sm bg-accent-2/60"
              style={{ left: 0, width: pct(deroule.cadrage) }}
            />
          )}

          <div
            data-testid="deroule-construction"
            className="absolute top-0.5 bottom-0.5 min-w-[3px] rounded-sm bg-accent/60"
            style={{ left: pct(deroule.cadrage), width: pct(deroule.construction) }}
          />

          {deroule.formation > 0 && (
            <div
              data-testid="deroule-formation"
              className="animate-apparait absolute top-0.5 bottom-0.5 min-w-[3px] rounded-sm bg-accent-2/60"
              style={{ left: pct(deroule.livraison), width: pct(deroule.formation) }}
            />
          )}

          {deroule.livraison < deroule.livraisonSansExpress && (
            <span
              data-testid="deroule-fantome"
              style={{
                left: `${(deroule.livraisonSansExpress / deroule.total) * 100}%`,
                transform: decalage(deroule.livraisonSansExpress),
              }}
              className="absolute -top-1 -bottom-1 w-px bg-muted-foreground"
            />
          )}

          {/* Pas d'`animate-apparait` : son keyframe force `transform: none` à la fin, ce qui
              écraserait le décalage de confinement ci-dessous. */}
          <span
            data-testid="deroule-livraison"
            className="absolute -top-1 -bottom-1 w-0.5 rounded-full bg-accent"
            style={{ left: pct(deroule.livraison), transform: decalage(deroule.livraison) }}
          />
        </div>

        <p className="text-[0.5rem] leading-tight text-muted-foreground">
          Livraison à {formaterSemaines(deroule.livraison)}
          {deroule.livraison < deroule.livraisonSansExpress &&
            ` au lieu de ${formaterSemaines(deroule.livraisonSansExpress)} sans la livraison accélérée`}
        </p>
      </div>

      <div className="mt-auto flex flex-col gap-2">
        <p className="text-[0.5rem] uppercase tracking-wider text-accent">Chaque mois, après la livraison</p>
        <div data-testid="deroule-mois" className="flex flex-wrap gap-1">
          {evenements.length > 0
            ? evenements.map((e) => (
                <span
                  key={e}
                  data-testid="deroule-evenement"
                  className="rounded-sm border border-border px-1.5 py-0.5 text-[0.5rem] leading-tight text-muted-foreground"
                >
                  {e}
                </span>
              ))
            : <p className="text-[0.5rem] leading-tight text-muted-foreground">Après la livraison, le site est à vous et vous en gardez la main.</p>}
        </div>
      </div>
    </div>
  )
}
