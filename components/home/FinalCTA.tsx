import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export function FinalCTA() {
  return (
    <Section className="bg-gradient-to-br from-accent-blue to-blue-600">
      <Container>
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-white md:text-5xl">
            Prêt à donner vie à votre projet ?
          </h2>
          <p className="mt-6 text-lg text-blue-100">
            Que vous ayez besoin d&apos;un site vitrine, d&apos;une refonte technique ou
            d&apos;une application sur mesure, je suis là pour transformer vos idées en réalité.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button
              href="/contact"
              variant="secondary"
              className="bg-white text-accent-blue hover:bg-gray-100"
              bounce
            >
              Demander un devis gratuit
            </Button>
            <Button
              href="/projets"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              bounce
            >
              Voir d&apos;autres projets
            </Button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-blue-100">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Réponse sous 24h</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Devis personnalisé</span>
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </Section>
  );
}
