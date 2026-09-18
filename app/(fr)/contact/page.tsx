import type { Metadata } from 'next'
import { Contact } from '@/components/ecrans/Contact'
import { FR } from '@/content/fr'
import { metaPage } from '@/lib/meta'

export const metadata: Metadata = metaPage(FR, 'contact', FR.pages.contact)

export default function Page() {
  return <Contact t={FR} />
}
