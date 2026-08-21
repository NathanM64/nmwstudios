'use client'

import type { Configuration } from '@/lib/config/devis'
import type { Cible } from '@/lib/config/defilement'
import type { DomaineId } from '@/lib/config/domaines'
import { styleParId, type StyleId } from '@/lib/config/styles'
import { DocumentMaquette } from '@/components/config/DocumentMaquette'

export function Apercu({
  config,
  cible,
  domaine,
  style,
}: {
  config: Configuration
  cible: Cible
  domaine: DomaineId
  style: StyleId
}) {
  return (
    <div data-testid="apercu" className="panel flex min-h-[26rem] w-full flex-col overflow-hidden xl:min-h-0 xl:flex-1">
      {/* Enveloppe : elle donne à la fenêtre sa hauteur, explicite sous xl et prise sur la
          colonne au-dessus. Confinée par `container-type: size`, la fenêtre ne peut pas la
          tenir d'elle-même, et une marge automatique y réduirait sa largeur à zéro. */}
      <div className="m-3 flex min-h-0 max-xl:h-[min(68vh,44rem)] xl:flex-1">
        <div
          data-testid="objet-scene"
          className="cadre-maquette flex-1 rounded-md border border-border-strong shadow-(--shadow-elevated)"
        >
          {/* La page porte la palette du style et rien du site : les scènes ne lisent que
              des variables `--m-*` posées ici. */}
          <div
            data-testid="maquette"
            style={
              {
                ...styleParId(style)!.variables,
                backgroundColor: 'var(--m-fond)',
                color: 'var(--m-texte)',
                fontFamily: 'var(--m-corps-famille)',
                fontWeight: 'var(--m-corps-graisse)',
                // Les widgets natifs de la maquette suivent sa direction, pas le thème
                // du site : sans cela le volet du sélecteur de langue est peint sombre
                // sous un texte sombre.
                colorScheme: 'var(--m-schema)',
              } as React.CSSProperties
            }
            className="maquette-page"
          >
            <DocumentMaquette config={config} domaine={domaine} cible={cible} />
          </div>
        </div>
      </div>

      <p
        data-testid="mention-style"
        className="px-3 pb-2 font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground"
      >
        Aperçu, pas votre futur site : la vôtre sera dessinée pour vous
      </p>
    </div>
  )
}
