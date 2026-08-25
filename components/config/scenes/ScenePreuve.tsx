'use client'

import { memo, useEffect, useRef, useState, type ComponentType } from 'react'
import type { Configuration } from '@/lib/config/devis'
import { DOMAINE_REPLI, type DomaineId } from '@/lib/config/domaines'
import { Serp } from '@/components/config/blocs/preuve/Serp'
import { FicheLocale } from '@/components/config/blocs/preuve/FicheLocale'
import { Cascade } from '@/components/config/blocs/preuve/Cascade'
import { Contraste } from '@/components/config/blocs/preuve/Contraste'
import { Banniere } from '@/components/config/blocs/preuve/Banniere'
import { MentionsLegales } from '@/components/config/blocs/preuve/MentionsLegales'
import { Redirections } from '@/components/config/blocs/preuve/Redirections'
import { Domaine } from '@/components/config/blocs/preuve/Domaine'

/** Compteur qui s'incrémente au lieu de sauter. La durée suit l'écart : sans cela, passer de
 *  zéro à huit se lirait aussi vite qu'un plus un. */
function useCompteur(cible: number): { valeur: number; anime: boolean } {
  const [valeur, setValeur] = useState(0)
  const depart = useRef(0)

  useEffect(() => {
    const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const debut = depart.current
    if (reduit || debut === cible) {
      setValeur(cible)
      depart.current = cible
      return
    }

    const duree = Math.min(700, 180 + 70 * Math.abs(cible - debut))
    const t0 = performance.now()
    let image = 0
    const pas = () => {
      const avance = Math.min(1, (performance.now() - t0) / duree)
      const courant = Math.round(debut + (cible - debut) * avance)
      setValeur(courant)
      depart.current = courant
      if (avance < 1) image = requestAnimationFrame(pas)
    }
    image = requestAnimationFrame(pas)
    return () => cancelAnimationFrame(image)
  }, [cible])

  return { valeur, anime: valeur !== cible }
}

const CONTROLES = [
  { id: 'seo', nom: 'Vous apparaissez dans les résultats' },
  { id: 'seo-local', nom: 'Fiche locale et horaires' },
  { id: 'perf', nom: 'Vitesse de chargement' },
  { id: 'a11y', nom: 'Contraste du texte' },
  { id: 'rgpd', nom: 'Consentement aux cookies' },
  { id: 'legal', nom: 'Mentions légales et CGV' },
  { id: 'migration', nom: 'Anciennes adresses redirigées' },
  { id: 'domaine', nom: 'Adresse et certificat' },
] as const

/** Détail dessiné par chaque contrôle retenu. Le lot 4 remplace ces huit blocs un par un, sans
 *  toucher à la boucle qui les monte. */
const DETAILS: Record<string, ComponentType<{ config: Configuration; domaine: DomaineId }>> = {
  seo: Serp,
  'seo-local': FicheLocale,
  perf: Cascade,
  a11y: Contraste,
  rgpd: Banniere,
  legal: MentionsLegales,
  migration: Redirections,
  domaine: Domaine,
}

export const ScenePreuve = memo(function ScenePreuve({
  config,
  domaine = DOMAINE_REPLI,
}: {
  config: Configuration
  domaine?: DomaineId
}) {
  const retenus = CONTROLES.filter((controle) => (config[controle.id] ?? 0) > 0).length
  const compteur = useCompteur(retenus)

  return (
    <div className="animate-apparait m-air-serre m-marge m-contenu flex flex-1 flex-col">
      {/* Le compteur domine, les huit lignes se rangent dessous. Sur une ligne avec son
          libellé plutôt qu'au-dessus : le cadre en bandeau ne paie pas deux fois. */}
      <div className="flex shrink-0 items-baseline gap-3">
        <p
          data-testid="preuve-score"
          data-anime={compteur.anime ? 'oui' : 'non'}
          className="m-chiffre shrink-0"
        >
          {compteur.valeur} / {CONTROLES.length}
        </p>
        <div className="min-w-0 flex-1">
          <p className="m-surtitre">contrôles retenus</p>
          <span className="m-filet mt-1 block h-px w-full" />
        </div>
      </div>

      {/* Les lignes s'étirent pour occuper la place libre, aucune ne se comprime sous son
          contenu : c'est le centrage qui creusait les bandes vides de la version précédente. */}
      <div className="m-air-serre flex flex-1 flex-col">
        {CONTROLES.map((controle) => {
          const retenu = (config[controle.id] ?? 0) > 0
          const Detail = DETAILS[controle.id]
          return (
            <div
              key={controle.id}
              data-testid="preuve-ligne"
              data-endroit={`preuve-ligne-${controle.id}`}
              data-retenu={retenu ? 'oui' : 'non'}
              // opacity-70 : la ligne reste en retrait sans passer sous 4,5:1, modélisé sur les
              // trois directions par tests/unit/configurateur-contraste.test.ts.
              className={`m-cadre m-ligne flex shrink-0 grow flex-col justify-center gap-0.5 ${retenu ? 'm-retenu' : 'opacity-70'}`}
            >
              <div className="flex min-w-0 items-baseline gap-1.5">
                {retenu && <span className="m-barre h-1.5 w-1.5 shrink-0" />}
                <p className="m-corps truncate">{controle.nom}</p>
              </div>

              {retenu && <Detail config={config} domaine={domaine} />}
            </div>
          )
        })}
      </div>
    </div>
  )
})
