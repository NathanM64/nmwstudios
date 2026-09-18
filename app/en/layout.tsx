import type { Metadata } from 'next'
import { Coque } from '@/components/Coque'
import { EN } from '@/content/en'
import { metaSite } from '@/lib/meta'

export const metadata: Metadata = metaSite(EN)

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Coque t={EN}>{children}</Coque>
}
