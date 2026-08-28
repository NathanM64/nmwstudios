import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Header } from '@/components/shell/Header'
import { Footer } from '@/components/shell/Footer'

export const metadata: Metadata = {
  title: 'Page introuvable',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="contenu" className="py-24 sm:py-32">
        <Container>
          <h1 className="enter max-w-[14ch] font-display text-[clamp(2.2rem,5.4vw,4rem)] font-extrabold leading-[0.98] tracking-[-0.04em]">
            Cette page n’existe pas.
          </h1>
          <p
            className="enter mt-8 max-w-[40rem] text-lg leading-relaxed text-ink-soft"
            style={{ '--rank': 1 } as React.CSSProperties}
          >
            Le lien est peut-être ancien. Les deux pages du site sont l’accueil et la reprise de
            site existant.
          </p>
          <div
            className="enter mt-10 flex flex-wrap gap-x-10 gap-y-3"
            style={{ '--rank': 2 } as React.CSSProperties}
          >
            <Link href="/" className="link-underline font-display text-lg font-bold">
              Accueil
            </Link>
            <Link
              href="/reprise-et-maintenance/"
              className="link-underline font-display text-lg font-bold"
            >
              Reprise et maintenance
            </Link>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  )
}
