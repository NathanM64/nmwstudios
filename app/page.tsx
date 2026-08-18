import { cookies } from 'next/headers'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Dock } from '@/components/shell/Dock'
import { ThemeToggle } from '@/components/shell/ThemeToggle'
import { AudienceSwitch } from '@/components/shell/AudienceSwitch'
import { Footer } from '@/components/shell/Footer'
import { AUDIENCE_COOKIE } from '@/lib/shell/audience'
import { SECTIONS } from '@/lib/shell/sections'

export default async function Page() {
  const rappelAgence = (await cookies()).get(AUDIENCE_COOKIE)?.value === 'agence'

  return (
    <>
      <Dock />
      <main className="pb-28 sm:pb-0 sm:pt-24">
        <Container className="flex items-center justify-between gap-4">
          <AudienceSwitch current="entreprise" />
          <ThemeToggle />
        </Container>

        {rappelAgence && (
          <Container>
            <a href="/agences" className="mt-4 inline-block text-sm text-muted-foreground underline">
              Revenir à la version agence
            </a>
          </Container>
        )}

        {SECTIONS.map(({ id, label }) => (
          <Section key={id} id={id}>
            <Container>
              <h2 className="font-mono text-xs uppercase tracking-[0.08em] text-accent">{label}</h2>
              <div className="min-h-[70vh]" />
            </Container>
          </Section>
        ))}
      </main>
      <Footer />
    </>
  )
}
