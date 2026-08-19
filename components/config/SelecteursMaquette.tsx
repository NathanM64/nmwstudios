'use client'

import { DOMAINES, type DomaineId } from '@/lib/config/domaines'
import { STYLES, type StyleId } from '@/lib/config/styles'

/** Ligne discrète sous les onglets de scène : sans cette hiérarchie, le bandeau devient une
 *  barre d'outils et l'aperçu perd son statut d'objet. */
export function SelecteursMaquette({
  domaine,
  style,
  onDomaine,
  onStyle,
}: {
  domaine: DomaineId
  style: StyleId
  onDomaine: (domaine: DomaineId) => void
  onStyle: (style: StyleId) => void
}) {
  const champ =
    'rounded-sm border border-border bg-transparent px-1 py-0.5 text-xs text-foreground'

  return (
    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <label htmlFor="selecteur-domaine">Métier</label>
        <select
          id="selecteur-domaine"
          data-testid="selecteur-domaine"
          value={domaine}
          onChange={(e) => onDomaine(e.target.value as DomaineId)}
          className={champ}
        >
          {DOMAINES.map((d) => (
            <option key={d.id} value={d.id}>
              {d.libelle}
            </option>
          ))}
        </select>
      </span>

      <span className="flex items-center gap-1.5">
        <label htmlFor="selecteur-style">Direction</label>
        <select
          id="selecteur-style"
          data-testid="selecteur-style"
          value={style}
          onChange={(e) => onStyle(e.target.value as StyleId)}
          className={champ}
        >
          {STYLES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.libelle}
            </option>
          ))}
        </select>
      </span>

      {/* Une direction, pas un modèle : la nuance protège le positionnement de studio. */}
      <p data-testid="mention-style" className="font-mono uppercase tracking-[0.08em]">
        la vôtre sera dessinée pour vous
      </p>
    </div>
  )
}
