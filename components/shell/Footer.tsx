import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Logo } from '@/components/ui/Logo'
import { LEGAL } from '@/lib/legal'
import { NAV } from '@/lib/nav'

// The logo signs at the bottom, like a stamp on a document. The rule fades out at both ends:
// it is the only horizontal line on the site, and it never touches the margin.
export function Footer() {
  return (
    <footer className="pb-14 pt-16">
      <Container>
        <div
          aria-hidden="true"
          className="h-px w-full bg-gradient-to-r from-transparent via-ink/18 to-transparent"
        />
        <div className="mt-12 flex flex-wrap items-end justify-between gap-x-12 gap-y-10">
          <div>
            <Logo className="h-12 w-12 text-ink" />
            <p className="mt-5 font-display text-sm font-bold tracking-[-0.01em]">
              {LEGAL.publisher}, développeur web
            </p>
            <p className="mt-2 text-sm text-ink-soft">
              33130 Bègles, dans la métropole de Bordeaux
              <br />
              À distance partout en France
            </p>
          </div>
          <nav className="flex flex-col items-start gap-2 text-sm">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-ink-soft transition-colors duration-300 hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col items-start gap-2 text-sm">
            <a
              href={`mailto:${LEGAL.email}`}
              className="link-underline font-display font-bold tracking-[-0.01em]"
            >
              {LEGAL.email}
            </a>
            <a
              href={`tel:${LEGAL.phoneHref}`}
              className="figures text-ink-soft transition-colors duration-300 hover:text-ink"
            >
              {LEGAL.phone}
            </a>
            <Link
              href="/mentions-legales/"
              className="mt-3 text-ink-soft transition-colors duration-300 hover:text-ink"
            >
              Mentions légales
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}
