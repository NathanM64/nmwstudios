'use client'

import { editorialDe, type DomaineId } from '@/lib/config/domaines'
import type { Langue } from '@/lib/config/maquette'
import type { Configuration } from '@/lib/config/devis'

/** Écart des trois cadrages et des trois dominantes sans `photos`. Zéro les aligne, un pousse au
 *  maximum dessiné. Réglage de goût : trop faible le delta ne se lit pas, trop fort le site par
 *  défaut paraît bâclé alors qu'il est fini. Tranché sur les captures par le propriétaire. */
const DIVERGENCE = 0.7

/** Les trois emplacements servis par la même photo, à leur écart maximal : décalage du cadrage en
 *  pour cent, facteur du voile de la direction, part de virage vers l'accent secondaire. */
const EMPLACEMENTS = [
  { x: 14, y: 24, voile: 0.5, vire: 0.55 },
  { x: 50, y: 50, voile: 1, vire: 0 },
  { x: 86, y: 76, voile: 1.8, vire: 0.35 },
]

const ALIGNE = { x: 50, y: 50, voile: 1, vire: 0 }

function dessin(e: (typeof EMPLACEMENTS)[number], aligne: boolean): React.CSSProperties {
  const k = aligne ? 0 : DIVERGENCE
  return {
    backgroundPosition: `${50 + (e.x - 50) * k}% ${50 + (e.y - 50) * k}%`,
    '--m-photo-facteur': String(1 + (e.voile - 1) * k),
    '--m-photo-vire': String(e.vire * k),
  } as React.CSSProperties
}

// `langue` reste requise : les étiquettes traduites ont disparu, mais la carte de texte du
// quatrième emplacement porte de l'éditorial du métier.
export function Photo({
  config,
  domaine,
  langue,
}: {
  config: Configuration
  domaine: DomaineId
  langue: Langue
}) {
  const alignees = (config.photos ?? 0) > 0
  const illustre = (config.visuels ?? 0) > 0
  const e = editorialDe(domaine, langue)

  return (
    <div
      className="m-air-serre grid shrink grow basis-0 grid-cols-2 gap-1 @min-[700px]/maquette:grid-cols-4"
      style={{ '--m-photo-fond': `url(/maquette/${domaine}.avif)` } as React.CSSProperties}
    >
      {EMPLACEMENTS.map((emplacement, i) => (
        <div
          key={emplacement.x}
          data-testid="site-cadre"
          {...(i === 0 ? { 'data-endroit': 'site-contenu' } : {})}
          className="m-photo min-w-0"
          style={dessin(emplacement, alignees)}
        />
      ))}
      {illustre ? (
        <div
          data-testid="site-visuel"
          data-endroit="site-visuels"
          className="animate-construit m-photo min-w-0"
          style={dessin(ALIGNE, true)}
        />
      ) : (
        <div
          data-testid="site-carte"
          data-endroit="site-visuels"
          className="m-carte flex min-w-0 flex-col justify-end gap-0.5 p-2"
        >
          <p className="m-surtitre truncate">{e.blocsRepris[0]}</p>
          <p className="m-sous-titre truncate">{e.blocsRepris[1]}</p>
        </div>
      )}
    </div>
  )
}
