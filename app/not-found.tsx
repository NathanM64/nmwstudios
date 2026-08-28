import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Entete } from '@/components/shell/Entete'
import { Pied } from '@/components/shell/Pied'

export const metadata: Metadata = {
  title: 'Page introuvable',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <>
      <Entete />
      <main id="contenu" className="py-24 sm:py-32">
        <Container>
          <h1 className="entre max-w-[14ch] font-display text-[clamp(2.2rem,5.4vw,4rem)] font-extrabold leading-[0.98] tracking-[-0.04em]">
            Cette page n’existe pas.
          </h1>
          <p
            className="entre mt-8 max-w-[40rem] text-lg leading-relaxed text-encre-douce"
            style={{ '--rang': 1 } as React.CSSProperties}
          >
            Le lien est peut-être ancien. Les deux pages du site sont l’accueil et la reprise de
            site existant.
          </p>
          <div
            className="entre mt-10 flex flex-wrap gap-x-10 gap-y-3"
            style={{ '--rang': 2 } as React.CSSProperties}
          >
            <Link href="/" className="lien-souligne font-display text-lg font-bold">
              Accueil
            </Link>
            <Link
              href="/reprise-et-maintenance/"
              className="lien-souligne font-display text-lg font-bold"
            >
              Reprise et maintenance
            </Link>
          </div>
        </Container>
      </main>
      <Pied />
    </>
  )
}
