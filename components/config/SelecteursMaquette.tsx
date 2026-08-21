'use client'

import { DOMAINES, type DomaineId } from '@/lib/config/domaines'
import { STYLES, type StyleId } from '@/lib/config/styles'
import { SelectListe } from '@/components/ui/SelectListe'

const OPTIONS_DOMAINE = DOMAINES.map((d) => ({ valeur: d.id, libelle: d.libelle }))
const OPTIONS_STYLE = STYLES.map((s) => ({ valeur: s.id, libelle: s.libelle }))

/** Bloc de tête de la colonne d'options. Les groupes qui le suivent portent tous un prix, pas
 *  lui : le liseré tireté l'en distingue, et la mention le dit, la seule forme ne suffisant pas. */
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
  return (
    <div data-testid="reglages-maquette" className="rounded-md border border-dashed border-border p-3">
      <p className="text-xs text-muted-foreground">
        Ces deux réglages changent l’aperçu. Ils ne changent pas le prix.
      </p>

      {/* Un par ligne, jamais côte à côte : côte à côte, la largeur du déclencheur du métier
          renvoie la direction à la ligne, et la hauteur du bloc décale les groupes que le relevé mesure. */}
      <div className="mt-3 flex flex-col items-start gap-2 text-xs text-muted-foreground">
        <SelectListe
          testId="selecteur-domaine"
          etiquette="Métier"
          valeur={domaine}
          options={OPTIONS_DOMAINE}
          onChange={(valeur) => onDomaine(valeur as DomaineId)}
        />

        <SelectListe
          testId="selecteur-style"
          etiquette="Direction"
          valeur={style}
          options={OPTIONS_STYLE}
          onChange={(valeur) => onStyle(valeur as StyleId)}
        />
      </div>
    </div>
  )
}
