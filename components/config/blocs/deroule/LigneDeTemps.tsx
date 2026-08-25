'use client'

import { OPTIONS } from '@/lib/config/catalogue'
import type { Configuration } from '@/lib/config/devis'
import { calculerDeroule } from '@/lib/config/duree'
import type { EndroitId } from '@/lib/config/endroits'

/** Endroit des rangées qui se vendent ; la construction est du socle et n'en porte aucun.
 *  Écrits et non concaténés : un identifiant fabriqué au gabarit échappe au contrôle de type. */
const ENDROIT_DE_RANGEE: Record<string, EndroitId | undefined> = {
  cadrage: 'deroule-cadrage',
  formation: 'deroule-formation',
}

/** Pire cas réel du catalogue, express décoché : échelle fixe de l'axe, sans quoi une option
 *  lourde ne changerait que sa part du total, jamais sa largeur en pixels. */
const CONFIG_MAX: Configuration = Object.fromEntries(
  OPTIONS.map((o) => [o.id, o.id === 'express' ? 0 : (o.quantifiable?.max ?? 1)])
)
const ECHELLE_SEMAINES = calculerDeroule(CONFIG_MAX).total

/** Graduations tous les `PAS` semaines : cinq repères environ sur toute l'échelle. */
const PAS_SEMAINES = Math.max(1, Math.round(ECHELLE_SEMAINES / 5))

function formaterSemaines(semaines: number): string {
  const valeur = Math.round(semaines * 10) / 10
  // En français le pluriel commence à deux : « 1,3 semaine », jamais « 1,3 semaines ».
  return `${valeur.toString().replace('.', ',')} semaine${valeur >= 2 ? 's' : ''}`
}

export function LigneDeTemps({ config }: { config: Configuration }) {
  const deroule = calculerDeroule(config)

  // Toutes les positions sont des parts de l'échelle du pire cas, jamais du total courant :
  // une option lourde élargit donc la barre en pixels, pas seulement sa part du projet.
  const part = (semaines: number) => `${(semaines / ECHELLE_SEMAINES) * 100}%`

  // Un repère ponctuel a sa propre largeur : à `left: P%`, le reculer de `P%` de sa largeur
  // le confine exactement à la piste, à toute position et sans jamais trop reculer.
  const decalage = (semaines: number) => `-${(semaines / ECHELLE_SEMAINES) * 100}% 0`

  const graduations = Array.from(
    { length: Math.floor(ECHELLE_SEMAINES / PAS_SEMAINES) + 1 },
    (_, i) => i * PAS_SEMAINES
  )

  const rangees = [
    deroule.cadrage > 0 && { id: 'cadrage', nom: 'Cadrage', depart: 0, duree: deroule.cadrage, seconde: true },
    { id: 'construction', nom: 'Construction', depart: deroule.cadrage, duree: deroule.construction, seconde: false },
    { id: 'livraison', nom: 'Livraison', depart: deroule.livraison, duree: 0, seconde: false },
    deroule.formation > 0 && { id: 'formation', nom: 'Formation', depart: deroule.livraison, duree: deroule.formation, seconde: true },
  ].filter(Boolean) as { id: string; nom: string; depart: number; duree: number; seconde: boolean }[]

  const lignes = { gridTemplateRows: `repeat(${rangees.length}, minmax(0, 1fr))` }

  return (
    <>
      <div className="flex shrink-0 items-baseline gap-3">
        <p className="m-surtitre">Déroulé du projet</p>
        <span className="m-filet h-px flex-1" />
        <p className="m-legende shrink-0">semaines</p>
      </div>

      {/* L'axe rend le fantôme de la livraison accélérée lisible : sans graduation, il ne se
          situait nulle part. */}
      <div className="flex shrink-0 gap-3">
        <span className="m-legende invisible shrink-0">Construction</span>
        <div data-testid="deroule-axe" className="relative min-w-0 flex-1">
          <span className="m-filet absolute inset-x-0 bottom-0 h-px" />
          {graduations.map((semaine) => (
            <span
              key={semaine}
              data-testid="deroule-graduation"
              className="m-legende absolute bottom-0 pb-0.5"
              style={{ left: part(semaine), translate: semaine === 0 ? '0 0' : '-50% 0' }}
            >
              {semaine}
            </span>
          ))}
        </div>
      </div>

      <div className="m-air flex min-h-0 flex-1 gap-3">
        <div className="grid shrink-0 gap-1" style={lignes}>
          {rangees.map((rangee) => (
            <div key={rangee.id} className="self-center">
              <p data-testid="deroule-nom" className="m-corps">
                {rangee.nom}
              </p>
              <p className="m-legende">
                {rangee.id === 'livraison'
                  ? `à ${formaterSemaines(rangee.depart)}`
                  : formaterSemaines(rangee.duree)}
              </p>
            </div>
          ))}
        </div>

        <div data-testid="deroule-piste" className="relative grid min-w-0 flex-1 gap-1" style={lignes}>
          {/* Les graduations traversent les couloirs : sans elles, le temps non employé se lit
              comme un vide de mise en page plutôt que comme du temps. */}
          {graduations.map((semaine) => (
            <span
              key={semaine}
              className="m-repere absolute inset-y-0 w-px"
              style={{ left: part(semaine), gridArea: '1 / 1 / -1 / -1' }}
            />
          ))}

          {rangees.map((rangee) => (
            <div key={rangee.id} className="m-couloir relative">
              {rangee.id === 'livraison' ? (
                <span className="m-filet absolute inset-x-0 inset-y-0 my-auto h-px" />
              ) : (
                <div
                  data-testid={`deroule-${rangee.id}`}
                  data-endroit={ENDROIT_DE_RANGEE[rangee.id]}
                  className={`absolute top-[32%] bottom-[32%] ${rangee.seconde ? 'animate-allonge m-barre-2' : 'm-barre'}`}
                  style={{ left: part(rangee.depart), width: part(rangee.duree) }}
                />
              )}
            </div>
          ))}

          {/* Confinement par la propriété `translate`, jamais par `transform` : le keyframe
              d'apparition finit sur `transform: none` et écraserait un décalage posé là. */}
          {deroule.livraison < deroule.livraisonSansExpress && (
            <span
              data-testid="deroule-fantome"
              data-endroit="deroule-express"
              style={{
                left: part(deroule.livraisonSansExpress),
                translate: decalage(deroule.livraisonSansExpress),
              }}
              className="animate-apparait m-jalon m-trait-sourd absolute inset-y-0 w-px"
            />
          )}

          <span
            data-testid="deroule-livraison"
            className="animate-apparait m-jalon m-barre absolute inset-y-0 w-0.5"
            style={{ left: part(deroule.livraison), translate: decalage(deroule.livraison) }}
          />
        </div>
      </div>

      <p className="m-legende shrink-0">
        Livraison à {formaterSemaines(deroule.livraison)}
        {deroule.livraison < deroule.livraisonSansExpress &&
          ` au lieu de ${formaterSemaines(deroule.livraisonSansExpress)} sans la livraison accélérée`}
      </p>
    </>
  )
}
