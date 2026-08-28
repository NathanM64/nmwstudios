import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Glass } from '@/components/ui/Glass'
import { Header } from '@/components/shell/Header'
import { Footer } from '@/components/shell/Footer'
import { Contact } from '@/components/blocks/Contact'
import { DayRate } from '@/components/blocks/DayRate'
import { HANDED_OVER, DECISION_SPLIT } from '@/content/reinforcement'
import { og } from '@/lib/meta'
import { schemaService } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Renfort ponctuel pour agence web',
  description:
    "Développeur en renfort sur vos projets pendant un pic de charge. À la journée, sans durée minimum, sans encadrement à fournir. En marque blanche.",
  alternates: { canonical: '/renfort/' },
  openGraph: og('/renfort/'),
}

const SCHEMA = schemaService({
  path: '/renfort/',
  crumb: 'Renfort ponctuel',
  name: 'Renfort ponctuel de développement web',
  serviceType: 'Renfort de développement web en régie',
  description:
    "Développeur web en renfort sur la production d'une agence pendant un pic de charge, à la journée et sans durée minimum, en marque blanche.",
})

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <Header current="/renfort/" />
      <main id="contenu">
        <Hero />
        <Reading />
        <Arbitration />
        <Handover />
        <DayRate />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

// Pas de dalle ici : la page s'ouvre sur une phrase, et la phrase est le sujet.
function Hero() {
  return (
    <section className="pb-14 pt-14 sm:pb-20 sm:pt-24">
      <Container>
        <h1 className="enter max-w-[15ch] font-display text-[clamp(2.2rem,5.4vw,4rem)] font-extrabold leading-[0.98] tracking-[-0.04em] text-balance">
          Vous n’avez personne pour m’expliquer le projet.
        </h1>
        <div
          className="enter mt-10 max-w-[40rem] space-y-5 text-lg leading-relaxed text-ink-soft"
          style={{ '--rank': 1 } as React.CSSProperties}
        >
          <p>
            C’est précisément pour ça que vous cherchez quelqu’un. Un renfort qu’il faut encadrer
            vous coûte deux fois : ses jours, et ceux de la personne qui l’encadre. Cette personne
            n’existe pas chez vous.
          </p>
          <p>
            Alors je pars du code. Je le lis, je le fais tourner, et ce que je vous demande ensuite
            tient en quelques questions, pas en une réunion de cadrage. À la journée, sans durée
            minimum.
          </p>
        </div>
      </Container>
    </section>
  )
}

function Reading() {
  return (
    <Section
      id="lecture"
      title="Je lis le code avant d’y toucher."
      intro={
        <p>
          La première journée d’un renfort ne produit pas de fonctionnalité, et c’est normal. Elle
          produit une carte.
        </p>
      }
    >
      <div className="mt-14 grid gap-x-16 gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <p className="rise max-w-[20ch] font-display text-[clamp(1.5rem,3.4vw,2.2rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-balance">
          Un renfort qui écrit avant d’avoir lu vous laisse du code à digérer.
        </p>
        <div className="rise max-w-[40rem] space-y-5 text-lg leading-relaxed text-ink-soft">
          <p>
            J’ouvre le projet, je le fais démarrer, et je le lis. Pas en diagonale : je regarde
            comment il est construit, où sont les pièges, et ce que ses conventions disent sans
            être écrites nulle part.
          </p>
          <p>
            À la fin de ce temps-là, je sais où poser les mains, et vous savez ce que j’ai vu. Cet
            audit part par écrit avant la première ligne, et il vous reste même si la mission
            s’arrête là.
          </p>
        </div>
      </div>
    </Section>
  )
}

function Arbitration() {
  return (
    <section id="arbitrage" className="py-24 sm:py-32">
      {/* This page's break in rhythm: the dividing line is what answers the reader's fear, so
          it goes on the one solid surface. */}
      <div className="band py-20 sm:py-24">
        <Container>
          <div className="grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <div>
              <h2 className="max-w-[16ch] font-display text-[clamp(1.9rem,4.2vw,3rem)] font-extrabold leading-[1.03] tracking-[-0.03em] text-balance">
                Vous n’arbitrez que ce qui vous regarde.
              </h2>
              <p className="mt-7 max-w-[38rem] text-lg leading-relaxed text-white-bright/75">
                Sans équipe technique, vous n’avez personne pour trancher une question technique.
                La ligne est donc posée à l’avance, et elle ne bouge pas en cours de mission.
              </p>
            </div>

            <div className="lg:pt-2">
              {DECISION_SPLIT.map((bloc, rank) => (
                <div
                  key={bloc.title}
                  className={rank > 0 ? 'mt-7 border-t border-white-bright/15 pt-7' : ''}
                >
                  <h3 className="font-display text-[clamp(1.15rem,2.2vw,1.45rem)] font-bold leading-snug tracking-[-0.02em]">
                    {bloc.title}
                  </h3>
                  <p className="mt-3.5 leading-relaxed text-white-bright/70">{bloc.body}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </section>
  )
}

function Handover() {
  return (
    <Section
      id="depart"
      title="Ce que vous retrouvez quand je pars."
      intro={
        <p>
          Un renfort dure six jours, parfois quinze. Ce qu’il laisse derrière lui dure beaucoup
          plus longtemps que ça.
        </p>
      }
      background="sunken"
    >
      <div className="mt-14 grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center">
        <p className="rise max-w-[18ch] font-display text-[clamp(1.5rem,3.4vw,2.2rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-balance">
          Quinze jours de renfort ne doivent pas créer six mois de questions.
        </p>

        <Glass thick className="rise px-7 py-8 sm:px-10 sm:py-10">
          <ul>
            {HANDED_OVER.map((line, rank) => (
              <li
                key={line}
                className={`text-lg leading-snug ${
                  rank > 0 ? 'mt-5 border-t border-ink/10 pt-5' : ''
                }`}
              >
                {line}
              </li>
            ))}
          </ul>
          <p className="mt-7 border-t border-ink/10 pt-5 text-sm leading-relaxed text-ink-soft">
            Le développeur qui passe après moi n’a besoin ni de mon numéro, ni de ma mémoire.
          </p>
        </Glass>
      </div>
    </Section>
  )
}
