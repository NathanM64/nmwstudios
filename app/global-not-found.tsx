import type { Metadata } from 'next'
import { Coque } from '@/components/Coque'
import { Introuvable } from '@/components/ecrans/Introuvable'
import { FR } from '@/content/fr'
import { metaSite } from '@/lib/meta'

// Deux racines (fr, en) : la 404 ne peut pas se composer depuis un seul layout, elle rend sa page entière.
export const metadata: Metadata = { ...metaSite(FR), ...FR.pages.introuvable, robots: { index: false } }

export default function GlobalNotFound() {
  return (
    <Coque t={FR}>
      <Introuvable />
    </Coque>
  )
}
