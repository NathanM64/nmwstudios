import type { Metadata } from 'next'
import { Coque } from '@/components/Coque'
import { FR } from '@/content/fr'
import { metaSite } from '@/lib/meta'

export const metadata: Metadata = metaSite(FR)

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Coque t={FR}>{children}</Coque>
}
