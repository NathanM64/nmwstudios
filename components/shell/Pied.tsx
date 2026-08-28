import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Logo } from '@/components/ui/Logo'
import { LEGAL } from '@/lib/legal'

// Le logo signe en bas, comme un cachet sur un document. L'arête s'éteint sur ses deux bords :
// c'est le seul trait horizontal du site, et il ne touche jamais la marge.
export function Pied() {
  return (
    <footer className="pb-14 pt-16">
      <Container>
        <div
          aria-hidden="true"
          className="h-px w-full bg-gradient-to-r from-transparent via-encre/18 to-transparent"
        />
        <div className="mt-12 flex flex-wrap items-end justify-between gap-x-12 gap-y-10">
          <div>
            <Logo className="h-12 w-12 text-encre" />
            <p className="mt-5 text-sm text-encre-douce">
              33130 Bègles, dans la métropole de Bordeaux
              <br />
              À distance partout en France
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 text-sm">
            <a
              href={`mailto:${LEGAL.email}`}
              className="lien-souligne font-display font-bold tracking-[-0.01em]"
            >
              {LEGAL.email}
            </a>
            <a
              href={`tel:${LEGAL.telephoneLien}`}
              className="chiffres text-encre-douce transition-colors duration-300 hover:text-encre"
            >
              {LEGAL.telephone}
            </a>
            <Link
              href="/mentions-legales/"
              className="mt-3 text-encre-douce transition-colors duration-300 hover:text-encre"
            >
              Mentions légales
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}
