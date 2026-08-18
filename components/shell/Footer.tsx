import { Container } from '@/components/ui/Container'

export function Footer() {
  return (
    <footer className="border-t border-border py-8 text-sm text-muted-foreground">
      <Container className="flex flex-wrap gap-x-6 gap-y-2">
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- ancre volontaire : lien de pied de page vers une page statique. */}
        <a href="/" className="hover:text-foreground">Accueil</a>
        <a href="/mentions-legales" className="hover:text-foreground">Mentions légales</a>
        <a href="/confidentialite" className="hover:text-foreground">Confidentialité</a>
      </Container>
    </footer>
  )
}
