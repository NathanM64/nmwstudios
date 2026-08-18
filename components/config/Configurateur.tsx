'use client'

import { useEffect, useState } from 'react'
import { PanneauOptions } from '@/components/config/PanneauOptions'
import { BarrePrix } from '@/components/config/BarrePrix'
import { Apercu } from '@/components/config/Apercu'
import { VignettesScene } from '@/components/config/VignettesScene'
import { Recapitulatif } from '@/components/config/Recapitulatif'
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

  useEffect(() => {
    if (!copie) return
    const minuteur = setTimeout(() => setCopie(null), 1800)
    return () => clearTimeout(minuteur)
  }, [copie])

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

        <div data-testid="colonne-options" className="lg:min-h-0 lg:overflow-y-auto lg:pr-2">
          <h1 className="text-2xl font-semibold tracking-tight">Configurez votre site</h1>
          <div className="mt-6">
            <PanneauOptions config={config} onChange={setConfig} onScene={setScene} />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" popoverTarget="recapitulatif"
                    className="rounded-md border border-border px-3 py-1.5 text-sm">
              Recevoir le récapitulatif
            </button>
            <button
              type="button"
              onClick={copierLien}
              aria-live="polite"
              className="rounded-md border border-border px-3 py-1.5 text-sm"
            >
              {copie === 'succes' ? 'Lien copié' : copie === 'echec' ? 'Échec de la copie' : 'Copier le lien'}
            </button>
          </div>
          <Recapitulatif config={config} />

          <JamaisInclus />
        </div>
      </div>

      <BarrePrix config={config} pret={pret} />
    </main>
  )
}
