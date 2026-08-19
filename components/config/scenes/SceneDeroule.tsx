'use client'

import { OPTIONS } from '@/lib/config/catalogue'
import type { Configuration } from '@/lib/config/devis'
import { calculerDeroule } from '@/lib/config/duree'

const OPTIONS_RECURRENTES = OPTIONS.filter((o) => o.groupe === 'recurrent')

/** Rendez-vous mensuels par formule. `sans-suivi` n'y figure pas : son refus a sa propre manifestation. */
const EVENEMENTS: Record<string, string[]> = {
  heberg: ['Hébergement et domaine', 'Certificat renouvelé'],
  essentiel: ['Sauvegarde quotidienne', 'Mises à jour et correctifs', 'Surveillance'],
  serenite: ['Sauvegarde quotidienne', 'Mises à jour et correctifs', 'Surveillance', 'Intervention sous 4 h', '1 h de modifications'],
  partenaire: ['Sauvegarde quotidienne', 'Mises à jour et correctifs', 'Surveillance', 'Intervention sous 4 h', 'Évolutions', 'Rapport mensuel'],
}

/** Ce que le client reprend en refusant le suivi : les mêmes rendez-vous, à sa charge. */
const A_VOTRE_CHARGE = ['Sauvegarde', 'Mises à jour', 'Surveillance']

/** Pire cas réel du catalogue, express décoché : échelle fixe de la piste, sans quoi une option
 *  lourde ne changerait que sa part du total, jamais sa largeur en pixels. */
const CONFIG_MAX: Configuration = Object.fromEntries(
  OPTIONS.map((o) => [o.id, o.id === 'express' ? 0 : (o.quantifiable?.max ?? 1)])
)
const ECHELLE_SEMAINES = calculerDeroule(CONFIG_MAX).total

function formaterSemaines(semaines: number): string {
  const valeur = Math.round(semaines * 10) / 10
  // En français le pluriel commence à deux : « 1,3 semaine », jamais « 1,3 semaines ».
  return `${valeur.toString().replace('.', ',')} semaine${valeur >= 2 ? 's' : ''}`
}

export function SceneDeroule({ config }: { config: Configuration }) {
  const deroule = calculerDeroule(config)
  const formule = OPTIONS_RECURRENTES.find((o) => (config[o.id] ?? 0) > 0)
  const evenements = formule ? (EVENEMENTS[formule.id] ?? []) : []
  const refus = formule?.id === 'sans-suivi'

  // Pourcentages du total courant, dans une piste elle-même mise à l'échelle du pire cas :
  // une option lourde élargit la barre en pixels, pas seulement sa part du total.
  const pct = (semaines: number) => `${(semaines / deroule.total) * 100}%`

  // Un repère ponctuel a sa propre largeur : à `left: P%`, le reculer de `P%` de sa largeur
  // le confine exactement à la piste, à toute position et sans jamais trop reculer.
  const decalage = (semaines: number) => `-${(semaines / deroule.total) * 100}% 0`

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

          {/* Confinement par la propriété `translate`, jamais par `transform` : le keyframe
              d'apparition finit sur `transform: none` et écraserait un décalage posé là. */}
          {deroule.livraison < deroule.livraisonSansExpress && (
            <span
              data-testid="deroule-fantome"
              style={{
                left: `${(deroule.livraisonSansExpress / deroule.total) * 100}%`,
                translate: decalage(deroule.livraisonSansExpress),
              }}
              className="animate-apparait absolute -top-1 -bottom-1 w-px bg-muted-foreground"
            />
          )}

          <span
            data-testid="deroule-livraison"
            className="animate-apparait absolute -top-1 -bottom-1 w-0.5 rounded-full bg-accent"
            style={{ left: pct(deroule.livraison), translate: decalage(deroule.livraison) }}
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
        <div data-testid="deroule-mois" className="flex flex-col gap-1">
          {evenements.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {evenements.map((e) => (
                <span
                  key={e}
                  data-testid="deroule-evenement"
                  className="rounded-sm border border-border px-1.5 py-0.5 text-[0.5rem] leading-tight text-muted-foreground"
                >
                  {e}
                </span>
              ))}
            </div>
          )}

          {refus && (
            <div data-testid="deroule-sans-suivi" className="animate-apparait flex flex-col gap-1">
              <div className="flex flex-wrap gap-1">
                {A_VOTRE_CHARGE.map((e) => (
                  <span
                    key={e}
                    data-testid="deroule-charge"
                    className="rounded-sm border border-dashed border-border-strong px-1.5 py-0.5 text-[0.5rem] leading-tight text-muted-foreground"
                  >
                    {e}
                  </span>
                ))}
              </div>
              <p className="text-[0.5rem] leading-tight text-muted-foreground">
                Personne ne passe : le site est à vous, et vous vous en occupez.
              </p>
            </div>
          )}

          {!formule && (
            <p className="text-[0.5rem] leading-tight text-muted-foreground">
              Après la livraison, à vous de dire qui s’en occupe.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
