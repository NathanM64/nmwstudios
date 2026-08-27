import { Container } from '@/components/ui/Container'
import { Surtitre } from '@/components/ui/Section'
import { LEGAL } from '@/lib/legal'

// Pas de formulaire : il faudrait un service tiers, donc un script et un cookie qui
// ne sont pas les miens. Une adresse suffit et se lit sans JavaScript.
export function Contact() {
  return (
    <section id="contact" className="regle py-16 sm:py-24">
      <Container>
        <Surtitre>Contact</Surtitre>
        <h2 className="mt-5 max-w-3xl font-display text-[clamp(1.7rem,3.6vw,2.6rem)] font-bold leading-[1.06] tracking-[-0.025em]">
          Écrivez-moi ce que vous avez sur les bras.
        </h2>
        <p className="mt-6 max-w-2xl text-lg text-encre-sourde">
          Une adresse de dépôt Git, une URL, ou trois lignes sur la situation. Je réponds sous
          24 heures ouvrées et je vous dis franchement si c&apos;est pour moi ou non.
        </p>
        <div className="mt-10 flex flex-wrap items-baseline gap-x-10 gap-y-4">
          <a
            href={`mailto:${LEGAL.email}`}
            className="font-display text-[clamp(1.25rem,3vw,2rem)] font-bold tracking-[-0.02em] text-carbone underline decoration-2 underline-offset-[6px] hover:decoration-encre"
          >
            {LEGAL.email}
          </a>
          <a
            href={`tel:${LEGAL.telephoneLien}`}
            className="font-mono text-sm text-encre-sourde hover:text-carbone"
          >
            {LEGAL.telephone}
          </a>
        </div>
        <p className="mt-8 font-mono text-xs text-encre-sourde">
          Pas de formulaire, pas de prise de rendez-vous automatique, pas de suivi de visite.
        </p>
      </Container>
    </section>
  )
}
