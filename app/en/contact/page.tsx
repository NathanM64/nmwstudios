import type { Metadata } from 'next'
import { Contact } from '@/components/ecrans/Contact'
import { EN } from '@/content/en'
import { metaPage } from '@/lib/meta'

export const metadata: Metadata = metaPage(EN, 'contact', EN.pages.contact)

export default function Page() {
  return <Contact t={EN} />
}
