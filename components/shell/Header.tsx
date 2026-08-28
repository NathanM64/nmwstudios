import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Logo } from '@/components/ui/Logo'
import { Glass } from '@/components/ui/Glass'
import { LEGAL } from '@/lib/legal'
import { NAV } from '@/lib/nav'

// A floating glass bar, held off the edges by the container. Below 768px the links disappear:
// only the action remains, it never leaves the thumb, and the footer carries the navigation.
// The current page is passed as a prop rather than read with usePathname: reading the URL
// would require a client component, and would drag the whole header, logo included, into the
// JavaScript bundle for a single attribute.
export function Header({ current }: { current?: string }) {
  return (
    <header className="sticky top-0 z-20 pt-4 sm:pt-5">
      <a href="#contenu" className="skip-link pill px-5 py-2.5 font-display text-[0.9rem] font-bold">
        Aller au contenu
      </a>
      <Container>
        <Glass dense blur={18} className="flex items-center justify-between gap-4 py-2.5 pl-4 pr-2.5 sm:pl-6 sm:pr-3">
          <Link href="/" className="flex items-center gap-3 rounded-[4px]">
            <Logo className="h-7 w-7 shrink-0 text-ink" />
            <span className="hidden font-display text-[0.95rem] font-bold tracking-[-0.02em] sm:inline">
              NMW Studios
            </span>
          </Link>

          <nav className="flex items-center gap-1 md:gap-5">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={current === item.href ? 'page' : undefined}
                className="hidden rounded-[4px] px-1 text-[0.95rem] text-ink-soft transition-colors duration-300 hover:text-ink aria-[current=page]:text-ink md:block"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={`mailto:${LEGAL.email}`}
              className="pill whitespace-nowrap px-5 py-2.5 font-display text-[0.9rem] font-bold tracking-[-0.01em] sm:px-6 sm:text-[0.95rem]"
            >
              Écrire un message
            </a>
          </nav>
        </Glass>
      </Container>
    </header>
  )
}
