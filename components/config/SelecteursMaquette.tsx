'use client'

import { DOMAINES, type DomaineId } from '@/lib/config/domaines'
import { STYLES, type StyleId } from '@/lib/config/styles'
import { SelectListe } from '@/components/ui/SelectListe'

const OPTIONS_DOMAINE = DOMAINES.map((d) => ({ valeur: d.id, libelle: d.libelle }))
const OPTIONS_STYLE = STYLES.map((s) => ({ valeur: s.id, libelle: s.libelle }))

/** Bout de ligne discret du bandeau : la mention qui accompagnait ces sélecteurs est descendue
 *  sous le cadre, en légende de l'objet. */
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
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
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
  )
}
