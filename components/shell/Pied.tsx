import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Logo } from '@/components/ui/Logo'
import { LEGAL } from '@/lib/legal'

// Le logo signe en bas, comme un cachet sur un document. En haut de page, la place revient
// au nom de l'agence.
export function Pied() {
  return (
    <footer className="regle mt-24 py-12">
      <Container className="flex flex-wrap items-end justify-between gap-x-10 gap-y-8">
        <div>
          <Logo className="h-14 w-14 text-encre" />
          <p className="mt-5 font-mono text-xs text-encre-sourde">
            {LEGAL.adresse.split(',').slice(1).join(',').trim()} · à distance partout en France
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-encre-sourde">
          <a href={`mailto:${LEGAL.email}`} className="hover:text-carbone">
            {LEGAL.email}
          </a>
          <Link href="/mentions-legales/" className="hover:text-carbone">
            Mentions légales
          </Link>
        </div>
      </Container>
    </footer>
  )
}
