'use client'

import { useEffect, useState } from 'react'
import { Container } from '@/components/ui/Container'
import { ThemeToggle } from '@/components/shell/ThemeToggle'
import { PanneauOptions } from '@/components/config/PanneauOptions'
import { BarrePrix } from '@/components/config/BarrePrix'
import { Apercu } from '@/components/config/Apercu'
import { VignettesScene } from '@/components/config/VignettesScene'
import { CONFIG_VIDE, type Configuration } from '@/lib/config/devis'
import { decoder, encoder } from '@/lib/config/url'
import type { SceneId } from '@/lib/config/scenes'

export function Configurateur() {
  const [config, setConfig] = useState<Configuration>(CONFIG_VIDE)
  const [scene, setScene] = useState<SceneId>('site')

  // Lu au montage, pas via `searchParams` : ce dernier rend la page dynamique et
  // Next n'y émet plus les préchargements de police dans le `<head>`.
  useEffect(() => {
    const lue = decoder(location.search)
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lecture ponctuelle de l'URL au montage, pas de resynchronisation en boucle.
    if (Object.keys(lue).length > 0) setConfig(lue)
  }, [])

  useEffect(() => {
    const query = encoder(config)
    history.replaceState(null, '', query ? `?${query}` : location.pathname)
  }, [config])

  return (
    <main className="pb-40 sm:pt-24">
      <Container className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Configurez votre site</h1>
        <ThemeToggle />
      </Container>

      <Container className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem]">
        <div className="sticky top-4 self-start lg:top-24">
          <Apercu config={config} scene={scene} />
          <VignettesScene scene={scene} onChange={setScene} />
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
            aperçu, pas votre futur site
          </p>
        </div>
        <PanneauOptions config={config} onChange={setConfig} onScene={setScene} />
      </Container>

      <BarrePrix config={config} />
    </main>
  )
}
