import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Glass } from '@/components/ui/Glass'
import { Header } from '@/components/shell/Header'
import { Footer } from '@/components/shell/Footer'
import { Contact } from '@/components/blocks/Contact'
import { DayRate } from '@/components/blocks/DayRate'
import { AFTER_LAUNCH, PRICING_RULES, PREREQUISITES, BENCHMARKS } from '@/content/project'
import { og } from '@/lib/meta'
import { schemaService } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Projet complet en sous-traitance pour agence',
  description:
    "Vous avez vendu, je développe : de la première ligne à la mise en ligne, en marque blanche. Estimation en jours validée avant de commencer, facturation au temps passé.",
  alternates: { canonical: '/projet-complet/' },
  openGraph: og('/projet-complet/'),
}

const SCHEMA = schemaService({
  path: '/projet-complet/',
  crumb: 'Projet complet',
  name: 'Développement de projet web complet',
  serviceType: 'Développement web en sous-traitance',
  description:
    "Développement d'un projet web de bout en bout pour une agence, de la première ligne à la mise en ligne, en marque blanche, sur estimation en jours validée avant de commencer.",
})

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <Header current="/projet-complet/" />
      <main id="contenu">
        <Hero />
        <Prerequisites />
        <Pricing />
        <Benchmarks />
        <AfterLaunch />
        <DayRate />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

function Hero() {
  return (
    <section className="pb-14 pt-14 sm:pb-20 sm:pt-24">
      <Container>
        <h1 className="enter max-w-[15ch] font-display text-[clamp(2.2rem,5.4vw,4rem)] font-extrabold leading-[0.98] tracking-[-0.04em] text-balance">
          Vous avez vendu. Le risque vient de changer de camp.
        </h1>
        <div
          className="enter mt-10 max-w-[40rem] space-y-5 text-lg leading-relaxed text-ink-soft"
          style={{ '--rank': 1 } as React.CSSProperties}
        >
          <p>
            Tant que le projet se vendait, il n’existait pas. Maintenant il y a une date, un
            budget, un client qui attend, et personne chez vous pour tenir tout ça.
          </p>
          <p>
            Je prends le développement en marque blanche, du premier fichier à la mise en ligne.
            Vous gardez le client, la relation et les décisions, et votre agence reste le seul nom
            sur le projet. L’estimation que je vous donne est un plafond, pas un point de départ.
          </p>
        </div>
      </Container>
    </section>
  )
}

function Prerequisites() {
  return (
    <Section
      id="demarrage"
      title="Ce qu’il me faut sur la table."
      intro={
        <p>
          Quatre choses, et la dernière est une porte : rien n’est travaillé avant elle. Ce qui
          manque ne bloque pas toujours, mais se paie toujours en jours.
        </p>
      }
    >
      {/* The rail carries the sequence and fills on scroll: without it, four numbered
          paragraphs read like four paragraphs. */}
      <ol className="relative mt-16 pl-14 sm:pl-24">
        <span
          aria-hidden="true"
          className="absolute bottom-8 left-0 top-3 w-px overflow-hidden bg-ink/12"
        >
          <span className="fill block h-full w-px bg-ink/70" />
        </span>

        {PREREQUISITES.map((step, rank) => (
          <li key={step.title} className="rise relative pb-14 last:pb-0">
            <span
              aria-hidden="true"
              className="figures absolute -left-11 top-0 font-display text-[1.5rem] font-extrabold leading-none tracking-[-0.04em] text-ink-soft/55 sm:-left-[4.5rem] sm:text-[2.6rem]"
            >
              {String(rank + 1).padStart(2, '0')}
            </span>
            <h3 className="font-display text-[clamp(1.2rem,2.4vw,1.6rem)] font-extrabold leading-[1.15] tracking-[-0.025em]">
              {step.title}
            </h3>
            <p className="mt-3.5 max-w-[40rem] leading-relaxed text-ink-soft">{step.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  )
}

function Pricing() {
  return (
    <section id="chiffrage" className="py-24 sm:py-32">
      {/* La rupture de rythme de cette page : une estimation qui ne peut que baisser est
          l'argument, elle passe donc sur la seule surface pleine. */}
      <div className="band py-20 sm:py-24">
        <Container>
          <div className="grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <div>
              <h2 className="max-w-[15ch] font-display text-[clamp(1.9rem,4.2vw,3rem)] font-extrabold leading-[1.03] tracking-[-0.03em] text-balance">
                Si je finis en avance, vous payez moins.
              </h2>
              <p className="mt-7 max-w-[38rem] text-lg leading-relaxed text-white-bright/75">
                C’est la différence entre une estimation et un forfait. Un forfait vous fait payer
                la marge que le prestataire a prise pour se protéger. Ici, vous payez les jours
                réellement travaillés, et l’estimation ne sert qu’à vous dire jusqu’où ça peut
                aller.
              </p>
            </div>

            <div className="lg:pt-2">
              <ul>
                {PRICING_RULES.map((rule, rank) => (
                  <li
                    key={rule}
                    className={`font-display text-[clamp(1.15rem,2.2vw,1.45rem)] font-bold leading-snug tracking-[-0.02em] ${
                      rank > 0 ? 'mt-7 border-t border-white-bright/15 pt-7' : ''
                    }`}
                  >
                    {rule}
                  </li>
                ))}
              </ul>
              {/* A moving scope is what derails projects: it reads lower and more quietly,
                  but it reads. */}
              <p className="mt-9 border-t border-white-bright/25 pt-7 leading-relaxed text-white-bright/70">
                Si le périmètre change en cours de route, je m’arrête et je vous envoie une
                nouvelle estimation. Vous validez, ou vous ne validez pas. Une journée n’est
                jamais travaillée avant d’avoir été acceptée.
              </p>
            </div>
          </div>
        </Container>
      </div>
    </section>
  )
}

function Benchmarks() {
  return (
    <Section
      id="reperes"
      title="À quoi ressemble un nombre de jours."
      density="low"
      intro={
        <p>
          Ce sont des ordres de grandeur, pas des forfaits. Ils servent à situer une conversation
          avant qu’elle commence : votre projet, lui, est estimé sur ce qu’il contient vraiment.
        </p>
      }
    >
      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {BENCHMARKS.map((benchmark) => (
          <Glass key={benchmark.project} as="article" className="rise px-7 py-8 sm:px-9">
            <p className="figures font-display text-[clamp(1.9rem,4vw,2.6rem)] font-extrabold leading-none tracking-[-0.04em]">
              {benchmark.days}
            </p>
            <h3 className="mt-5 font-display text-xl font-extrabold leading-snug tracking-[-0.025em]">
              {benchmark.project}
            </h3>
            <p className="mt-3 leading-relaxed text-ink-soft">{benchmark.detail}</p>
          </Glass>
        ))}
      </div>
    </Section>
  )
}

function AfterLaunch() {
  return (
    <Section
      id="apres"
      title="Le jour de la mise en ligne n’est pas une fin."
      intro={
        <p>
          Un projet livré continue de vivre, et c’est en général le moment où le prestataire
          disparaît ou sort un contrat de maintenance. Ni l’un ni l’autre ici.
        </p>
      }
      background="sunken"
    >
      <div className="mt-14 grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center">
        <p className="rise max-w-[18ch] font-display text-[clamp(1.5rem,3.4vw,2.2rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-balance">
          Rien ne change de tarif après la livraison.
        </p>

        <Glass thick className="rise px-7 py-8 sm:px-10 sm:py-10">
          <ul>
            {AFTER_LAUNCH.map((line, rank) => (
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
            Tout se compte de la même façon : les jours passés, au même tarif. Il n’y a pas
            d’abonnement à signer le jour de la livraison.
          </p>
        </Glass>
      </div>
    </Section>
  )
}
