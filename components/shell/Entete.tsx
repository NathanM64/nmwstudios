import Link from 'next/link'
import { Container } from '@/components/ui/Container'

// Le nom du studio reste petit et en haut. Sur ce site, la place centrale revient au
// nom de l'agence, pas au mien.
export function Entete() {
  return (
    <header className="regle border-t-0">
      <Container className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 py-5">
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-[0.22em] text-encre hover:text-carbone"
        >
          NMW Studios
        </Link>
        <nav className="flex flex-wrap items-baseline gap-x-6 gap-y-1 font-mono text-xs uppercase tracking-[0.14em] text-encre-sourde">
          <Link href="/reprise-et-maintenance/" className="hover:text-carbone">
            Reprise et maintenance
          </Link>
          <Link href="/#contact" className="hover:text-carbone">
            Contact
          </Link>
        </nav>
      </Container>
    </header>
  )
}
