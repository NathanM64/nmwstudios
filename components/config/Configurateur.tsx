'use client'

import { useEffect, useRef, useState } from 'react'
import { PanneauOptions } from '@/components/config/PanneauOptions'
import { BarrePrix } from '@/components/config/BarrePrix'
import { Apercu } from '@/components/config/Apercu'
import { VignettesScene } from '@/components/config/VignettesScene'
import { Recapitulatif } from '@/components/config/Recapitulatif'
import { RecapitulatifFinal } from '@/components/config/RecapitulatifFinal'
import { JamaisInclus } from '@/components/config/JamaisInclus'
import type { Configuration } from '@/lib/config/devis'
import { decoder, encoder } from '@/lib/config/url'
import type { SceneId } from '@/lib/config/scenes'

/** Le suivi mensuel est proposé d’emblée, et se refuse par « Je m’en occupe moi-même ». */
export const CONFIG_DEPART: Configuration = { essentiel: 1 }

export function Configurateur() {
  const [config, setConfig] = useState<Configuration>(CONFIG_DEPART)
  const [scene, setScene] = useState<SceneId>('site')
  // Faux tant que l'URL n'a pas été lue : la barre de prix s'en sert pour ne pas
  // animer un delta sur la configuration initiale d'un lien partagé.
  const [pret, setPret] = useState(false)
  const [copie, setCopie] = useState<'succes' | 'echec' | null>(null)
  const [recapVisible, setRecapVisible] = useState(false)

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
      if (!window.matchMedia('(min-width: 1024px)').matches) return
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
    <main className="pb-24 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col lg:pb-0">
      <div
        ref={grilleRef}
        data-testid="grille-configurateur"
        className="grid gap-8 px-5 sm:px-8 lg:min-h-0 lg:flex-1 lg:grid-cols-[minmax(0,1fr)_26rem] lg:overflow-hidden lg:pb-4"
      >
        <div
          data-testid="colonne-apercu"
          className="sticky top-20 self-start lg:static lg:flex lg:min-h-0 lg:flex-col lg:self-auto"
        >
          <Apercu config={config} scene={scene} />
          <VignettesScene scene={scene} onChange={setScene} />
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
            aperçu, pas votre futur site
          </p>
        </div>

        <div
          ref={panneauRef}
          data-testid="colonne-options"
          className="lg:min-h-0 lg:scroll-pt-(--carte-scroll-pt) lg:overflow-y-auto lg:pr-2"
        >
          <h1 className="text-2xl font-semibold tracking-tight">Configurez votre site</h1>
          <div className="mt-6">
            <PanneauOptions config={config} onChange={setConfig} onScene={setScene} />
          </div>

          <Recapitulatif config={config} />

          <JamaisInclus />

          <RecapitulatifFinal ref={recapRef} config={config} copie={copie} onCopier={copierLien} />
        </div>
      </div>

      <BarrePrix config={config} pret={pret} masquee={recapVisible} />
    </main>
  )
}
