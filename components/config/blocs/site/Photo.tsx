'use client'

import { HABILLAGE, type Langue } from '@/lib/config/maquette'
import type { Configuration } from '@/lib/config/devis'
import type { DomaineId } from '@/lib/config/domaines'

// `t.photo`/`t.visuel` sont des libellés traduits : le bloc a donc besoin de `langue`,
// à la différence de sa signature d'origine dans le plan.
export function Photo({
  config,
  domaine,
  langue,
}: {
  config: Configuration
  domaine: DomaineId
  langue: Langue
}) {
  const photos = config.photos ?? 0
  const visuels = config.visuels ?? 0
  const t = HABILLAGE[langue]

  return (
    <>
      {/* Photo réelle du métier, en licence libre, à la place du dégradé. Conditionner sa
          présence à l'achat de `photos` ou `visuels` a été essayé et défait : les deux options
          rendaient alors la même image. Les distinguer demande l'état inachevé complet, textes
          compris, et c'est le lot 3 qui le porte. */}
      <div
        data-testid="site-cadre"
        data-endroit="site-contenu"
        className="m-photo relative shrink grow basis-0 overflow-hidden"
        style={{ '--m-photo-fond': `url(/maquette/${domaine}.avif)` } as React.CSSProperties}
      >
        {photos > 0 && (
          <>
            <span data-testid="site-reperes" className="animate-glisse m-reperes absolute inset-3" />
            {/* Aucun chiffre : un poids annoncé serait une mesure inventée. */}
            <span data-testid="site-poids" className="animate-glisse m-etiquette absolute right-1.5 bottom-1.5 px-1.5">
              {t.photo}
            </span>
          </>
        )}
        {visuels > 0 && (
          <span data-testid="site-visuels" className="animate-glisse m-etiquette absolute bottom-1.5 left-1.5 px-1.5">
            {t.visuel}
          </span>
        )}
      </div>
    </>
  )
}
