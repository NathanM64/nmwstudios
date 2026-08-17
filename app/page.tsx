import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { ThemeToggle } from '@/components/shell/ThemeToggle'

export default function Page() {
  return (
    <main>
      <Section>
        <Container>
          <ThemeToggle />
        </Container>
      </Section>
    </main>
  )
}
