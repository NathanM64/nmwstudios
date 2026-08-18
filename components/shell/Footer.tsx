import { Container } from '@/components/ui/Container'

export function Footer() {
  return (
    <footer className="border-t border-border py-8 text-sm text-muted-foreground">
      <Container className="flex flex-wrap gap-x-6 gap-y-2">
        <a href="/mentions-legales" className="hover:text-foreground">Mentions légales</a>
        <a href="/confidentialite" className="hover:text-foreground">Confidentialité</a>
      </Container>
    </footer>
  )
}
