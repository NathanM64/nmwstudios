import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { LEGAL } from '@/lib/legal'

export function Pied() {
  return (
    <footer className="regle mt-24 py-10">
      <Container className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 font-mono text-xs text-encre-sourde">
        <p>
          NMW Studios · {LEGAL.adresse.split(',').slice(1).join(',').trim()}
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
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
