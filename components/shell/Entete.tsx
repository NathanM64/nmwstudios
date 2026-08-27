import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Logo } from '@/components/ui/Logo'
import { Verre } from '@/components/ui/Verre'
import { LEGAL } from '@/lib/legal'

// Une barre de verre flottante, détachée des bords par le conteneur. Sous 640px le lien
// secondaire disparaît : seule l'action reste, elle ne quitte jamais le pouce.
export function Entete() {
  return (
    <header className="sticky top-0 z-20 pt-4 sm:pt-5">
      <Container>
        <Verre dense flou={18} className="flex items-center justify-between gap-4 py-2.5 pl-4 pr-2.5 sm:pl-6 sm:pr-3">
          <Link href="/" className="flex items-center gap-3 rounded-[4px]">
            <Logo className="h-7 w-7 shrink-0 text-encre" />
            <span className="hidden font-display text-[0.95rem] font-bold tracking-[-0.02em] sm:inline">
              NMW Studios
            </span>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-5">
            <Link
              href="/reprise-et-maintenance/"
              className="hidden rounded-[4px] px-1 text-[0.95rem] text-encre-douce transition-colors duration-300 hover:text-encre sm:block"
            >
              Reprise et maintenance
            </Link>
            <a
              href={`mailto:${LEGAL.email}`}
              className="capsule whitespace-nowrap px-5 py-2.5 font-display text-[0.9rem] font-bold tracking-[-0.01em] sm:px-6 sm:text-[0.95rem]"
            >
              Écrire un message
            </a>
          </nav>
        </Verre>
      </Container>
    </header>
  )
}
