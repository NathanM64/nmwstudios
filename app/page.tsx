import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Dock } from '@/components/shell/Dock'
import { ThemeToggle } from '@/components/shell/ThemeToggle'
import { SECTIONS } from '@/lib/shell/sections'

export default function Page() {
  return (
    <>
      <Dock />
      <main className="pb-28 sm:pb-0 sm:pt-24">
        <Container>
          <ThemeToggle />
        </Container>
        {SECTIONS.map(({ id, label }) => (
          <Section key={id} id={id}>
            <Container>
              <h2 className="font-mono text-xs uppercase tracking-[0.08em] text-accent">{label}</h2>
              <div className="min-h-[70vh]" />
            </Container>
          </Section>
        ))}
      </main>
    </>
  )
}
