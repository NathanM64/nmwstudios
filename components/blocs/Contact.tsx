import { Container } from '@/components/ui/Container'
import { Surtitre } from '@/components/ui/Section'
import { LEGAL, RENDEZ_VOUS } from '@/lib/legal'

export function Contact() {
  return (
    <section id="contact" className="regle py-16 sm:py-24">
      <Container>
        <Surtitre>Contact</Surtitre>
        <h2 className="mt-5 max-w-3xl font-display text-[clamp(1.7rem,3.6vw,2.6rem)] font-bold leading-[1.06] tracking-[-0.025em]">
          Écrivez-moi ce que vous avez sur les bras.
        </h2>
        <p className="mt-6 max-w-2xl text-lg text-encre-sourde">
          Une adresse de dépôt Git, une URL, ou trois lignes sur la situation. Je vous dis
          franchement si c’est pour moi ou non.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-5">
          {RENDEZ_VOUS ? (
            <a
              href={RENDEZ_VOUS}
              target="_blank"
              rel="noreferrer"
              className="bg-encre px-7 py-4 font-display text-lg font-bold tracking-[-0.01em] text-papier hover:bg-carbone"
            >
              Réserver un créneau
            </a>
          ) : null}
          <a
            href={`mailto:${LEGAL.email}`}
            className="font-display text-[clamp(1.25rem,3vw,1.75rem)] font-bold tracking-[-0.02em] text-carbone underline decoration-2 underline-offset-[6px] hover:decoration-encre"
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

        <p className="mt-10 max-w-2xl font-mono text-xs leading-relaxed text-encre-sourde">
          Ce site ne charge aucun script tiers et ne mesure aucune visite.
          {RENDEZ_VOUS ? ' La prise de rendez-vous ouvre un service externe, dans un autre onglet.' : ''}
        </p>
      </Container>
    </section>
  )
}
