'use client'

import { useState } from 'react'
import { Container } from '@/components/ui/Container'
import { ThemeToggle } from '@/components/shell/ThemeToggle'
import { PanneauOptions } from '@/components/config/PanneauOptions'
import { BarrePrix } from '@/components/config/BarrePrix'
import { Apercu } from '@/components/config/Apercu'
import { CONFIG_VIDE, type Configuration } from '@/lib/config/devis'

export function Configurateur() {
  const [config, setConfig] = useState<Configuration>(CONFIG_VIDE)

  return (
    <main className="pb-40 sm:pt-24">
      <Container className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Configurez votre site</h1>
        <ThemeToggle />
      </Container>

      <Container className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem]">
        <div>
          <Apercu config={config} />
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
            aperçu, pas votre futur site
          </p>
        </div>
        <PanneauOptions config={config} onChange={setConfig} />
      </Container>

      <BarrePrix config={config} />
    </main>
  )
}
