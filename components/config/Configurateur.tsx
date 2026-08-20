'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { PanneauOptions } from '@/components/config/PanneauOptions'
import { BarrePrix } from '@/components/config/BarrePrix'
import { Apercu } from '@/components/config/Apercu'
import { Recapitulatif } from '@/components/config/Recapitulatif'
import { RecapitulatifFinal } from '@/components/config/RecapitulatifFinal'
import { JamaisInclus } from '@/components/config/JamaisInclus'
import type { Configuration } from '@/lib/config/devis'
import { decoder, encoder } from '@/lib/config/url'
import { GROUPES, type GroupeId } from '@/lib/config/catalogue'
import { ANCRE_PAR_GROUPE, premiereAncreDe, type SceneId } from '@/lib/config/scenes'
import type { Cible } from '@/lib/config/defilement'
import { DOMAINE_DEFAUT, type DomaineId } from '@/lib/config/domaines'
import { STYLE_DEFAUT, type StyleId } from '@/lib/config/styles'

/** Le suivi mensuel est proposé d’emblée, et se refuse par « Je m’en occupe moi-même ». */
export const CONFIG_DEPART: Configuration = { essentiel: 1 }

export function Configurateur() {
  const [config, setConfig] = useState<Configuration>(CONFIG_DEPART)
  const [cible, setCible] = useState<Cible>({ ancre: 'site-haut', progression: 0 })
  // Métier et direction de style ne vivent pas dans l'URL : ils ne changent ni le prix ni le devis.
  const [domaine, setDomaine] = useState<DomaineId>(DOMAINE_DEFAUT)
  const [style, setStyle] = useState<StyleId>(STYLE_DEFAUT)
  // Faux tant que l'URL n'a pas été lue : la barre de prix s'en sert pour ne pas
  // animer un delta sur la configuration initiale d'un lien partagé.
  const [pret, setPret] = useState(false)
  const [copie, setCopie] = useState<'succes' | 'echec' | null>(null)
  const [recapVisible, setRecapVisible] = useState(false)

  const surPartie = useCallback((partie: SceneId) => {
    setCible({ ancre: premiereAncreDe(partie), progression: 0 })
  }, [])

  // Lire un groupe, c'est parcourir la distance qui sépare son ancre de celle du groupe d'après.
  // Le dernier groupe n'a pas de suite : sa cible se pose, elle n'interpole rien.
  const surLecture = useCallback(({ groupe, progression }: { groupe: GroupeId; progression: number }) => {
    const rang = GROUPES.findIndex((g) => g.id === groupe)
    const suivant = GROUPES[rang + 1]
    setCible({
      ancre: ANCRE_PAR_GROUPE[groupe],
      vers: suivant ? ANCRE_PAR_GROUPE[suivant.id] : undefined,
      progression,
    })
  }, [])

  const grilleRef = useRef<HTMLDivElement>(null)
  const panneauRef = useRef<HTMLDivElement>(null)
  const recapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!copie) return
    const minuteur = setTimeout(() => setCopie(null), 1800)
    return () => clearTimeout(minuteur)
  }, [copie])

  // Écouteur natif, pas `onWheel` : React attache les gestionnaires de molette en
  // passif, où `preventDefault` échoue silencieusement (avertissement de console).
  useEffect(() => {
    const grille = grilleRef.current
    const panneau = panneauRef.current
    if (!grille || !panneau) return

    const rediriger = (event: WheelEvent) => {
      if (!window.matchMedia('(min-width: 1280px)').matches) return
      if (panneau.contains(event.target as Node)) return
      const max = panneau.scrollHeight - panneau.clientHeight
      const suivant = Math.min(Math.max(panneau.scrollTop + event.deltaY, 0), max)
      if (suivant === panneau.scrollTop) return
      panneau.scrollTop = suivant
      event.preventDefault()
    }

    grille.addEventListener('wheel', rediriger, { passive: false })
    return () => grille.removeEventListener('wheel', rediriger)
  }, [])

  // Le récapitulatif final et la barre fixe ne coexistent jamais.
  useEffect(() => {
    const cible = recapRef.current
    if (!cible) return
    const observateur = new IntersectionObserver(([entree]) => setRecapVisible(entree.isIntersecting))
    observateur.observe(cible)
    return () => observateur.disconnect()
  }, [])

  const copierLien = () => {
    navigator.clipboard
      .writeText(location.href)
      .then(() => setCopie('succes'))
      .catch(() => setCopie('echec'))
  }

  // Lu au montage, pas via `searchParams` : ce dernier rend la page dynamique et
  // Next n'y émet plus les préchargements de police dans le `<head>`.
  useEffect(() => {
    const lue = decoder(location.search)
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lecture ponctuelle de l'URL au montage, pas de resynchronisation en boucle.
    if (Object.keys(lue).length > 0) setConfig(lue)
    setPret(true)
  }, [])

  useEffect(() => {
    const query = encoder(config)
    history.replaceState(null, '', query ? `?${query}` : location.pathname)
  }, [config])

  return (
    <main className="pb-24 xl:flex xl:min-h-0 xl:flex-1 xl:flex-col xl:pb-0">
      <div
        ref={grilleRef}
        data-testid="grille-configurateur"
        className="grid gap-8 px-5 sm:px-8 xl:min-h-0 xl:flex-1 xl:grid-cols-[minmax(0,1fr)_26rem] xl:overflow-hidden xl:pb-4"
      >
        <div
          data-testid="colonne-apercu"
          className="sticky top-20 min-w-0 self-start xl:static xl:flex xl:min-h-0 xl:flex-col xl:self-auto"
        >
          <Apercu
            config={config}
            cible={cible}
            domaine={domaine}
            style={style}
            onPartie={surPartie}
            onDomaine={setDomaine}
            onStyle={setStyle}
          />
        </div>

        {/* La colonne n'est conteneur de défilement qu'au-dessus de 1280 : la réserve sous la barre
            de prix n'y vaut qu'à partir de `xl`, la racine s'en charge en dessous. */}
        <div
          ref={panneauRef}
          data-testid="colonne-options"
          className="min-w-0 xl:min-h-0 xl:scroll-pb-(--barre-scroll-pb) xl:overflow-y-auto xl:pr-2"
        >
          <h1 className="text-2xl font-semibold tracking-tight">Configurez votre site</h1>
          <div className="mt-6">
            <PanneauOptions config={config} onChange={setConfig} onCible={setCible} onLecture={surLecture} />
          </div>

          <Recapitulatif config={config} />

          <JamaisInclus />

          <RecapitulatifFinal ref={recapRef} config={config} copie={copie} onCopier={copierLien} />

          <BarrePrix config={config} pret={pret} masquee={recapVisible} />
        </div>
      </div>
    </main>
  )
}
