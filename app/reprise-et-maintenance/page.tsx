import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Glass } from '@/components/ui/Glass'
import { Header } from '@/components/shell/Header'
import { Footer } from '@/components/shell/Footer'
import { Contact } from '@/components/blocks/Contact'
import { CRITERIA, STACKS } from '@/content/stacks'
import { ASSESSMENT } from '@/content/assessment'
import { og } from '@/lib/meta'
import { schemaService } from '@/lib/schema'

const SCHEMA = schemaService({
  path: '/reprise-et-maintenance/',
  crumb: 'Reprise et maintenance',
  name: 'Reprise et maintenance de site existant',
  serviceType: 'Reprise et maintenance de site web',
  description:
    "Reprise d'un site développé par un autre prestataire, puis maintenance au mois : Symfony, PHP sans framework, React et JavaScript ancien, WordPress sur mesure.",
  catalog: ['Symfony', 'PHP sans framework', 'React et JavaScript ancien', 'WordPress sur mesure'],
})

export const metadata: Metadata = {
  title: 'Reprise et maintenance de site existant',
  description:
    "Reprise d'un site développé par un autre : Symfony, PHP, React ancien, WordPress. Maintenance au mois pour les agences, en marque blanche.",
  alternates: { canonical: '/reprise-et-maintenance/' },
  openGraph: og('/reprise-et-maintenance/'),
}

// The four plates are not the same width: the grid alternates wide and narrow rather than
// lining up four identical cards.
const WIDTHS = ['lg:col-span-3', 'lg:col-span-3', 'lg:col-span-4', 'lg:col-span-2']

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <Header current="/reprise-et-maintenance/" />
      <main id="contenu">
        <Hero />
        <Assessment />
        <Stacks />
        <Handover />
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
          Non, je ne vais pas vous dire que tout est à refaire.
        </h1>
        <div
          className="enter mt-10 max-w-[40rem] space-y-5 text-lg leading-relaxed text-ink-soft"
          style={{ '--rank': 1 } as React.CSSProperties}
        >
          <p>
            C’est la phrase que vous attendez, parce que vous l’avez déjà entendue. Un site qui
            tourne depuis six ans avec du code que personne n’aime reste un site qui tourne depuis
            six ans.
          </p>
          <p>
            Mon travail est de le garder en vie et de le faire avancer. Quand une refonte est
            vraiment la bonne réponse, je vous le dis avec les chiffres qui le montrent, et c’est
            vous qui décidez.
          </p>
        </div>
      </Container>
    </section>
  )
}

function Assessment() {
  return (
    <Section
      id="etat-des-lieux"
      title="La reprise commence avant d’écrire la moindre ligne."
      intro={
        <p>
          Quatre étapes, dans cet ordre, parce que chacune a besoin de la précédente. Vous savez
          où j’en suis à tout moment.
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

        {ASSESSMENT.map((step, rank) => (
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

function Stacks() {
  return (
    <section id="technos" className="py-24 sm:py-32">
      {/* This page's break in rhythm: the three conditions decide everything, so they go on
          the one solid surface. */}
      <div className="band py-20 sm:py-24">
        <Container>
          <div className="grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <div>
              <h2 className="max-w-[14ch] font-display text-[clamp(1.9rem,4.2vw,3rem)] font-extrabold leading-[1.03] tracking-[-0.03em] text-balance">
                Symfony, PHP, React, WordPress : ce n’est pas la technologie qui décide.
              </h2>
              <p className="mt-7 max-w-[38rem] text-lg leading-relaxed text-white-bright/75">
                Une reprise se décide sur l’état du projet, pas sur le langage dans lequel il est
                écrit. Trois conditions, et elles sont les mêmes partout.
              </p>
            </div>

            <div className="lg:pt-2">
              <ul>
                {CRITERIA.map((criterion, rank) => (
                  <li
                    key={criterion}
                    className={`font-display text-[clamp(1.15rem,2.2vw,1.45rem)] font-bold leading-snug tracking-[-0.02em] ${
                      rank > 0 ? 'mt-7 border-t border-white-bright/15 pt-7' : ''
                    }`}
                  >
                    {criterion}
                  </li>
                ))}
              </ul>
              {/* An exclusion is not a fourth condition: it reads lower and more quietly, but
                  right when the reader is checking whether their case fits. */}
              <p className="mt-9 border-t border-white-bright/25 pt-7 leading-relaxed text-white-bright/70">
                Je ne reprends pas les sites montés sur un constructeur de pages. Votre
                intégrateur ira plus vite que moi et vous coûtera moins cher.
              </p>
            </div>
          </div>
        </Container>
      </div>

      <Container>
        <p className="rise mt-20 max-w-[40rem] text-lg leading-relaxed text-ink-soft">
          Le reste est une question de temps, et le temps se chiffre. Voici ce qui passe entre mes
          mains le plus souvent, et que vous cherchez peut-être en ce moment.
        </p>

        <div className="mt-10 grid gap-5 lg:grid-cols-6">
          {STACKS.map((stack, rank) => (
            <Glass
              key={stack.name}
              as="article"
              className={`rise px-7 py-8 sm:px-9 ${WIDTHS[rank]}`}
            >
              <h3 className="font-display text-2xl font-extrabold tracking-[-0.03em]">
                {stack.name}
              </h3>
              <p className="mt-4 max-w-[40rem] leading-relaxed text-ink-soft">{stack.body}</p>
            </Glass>
          ))}
        </div>

        <p className="rise mt-16 max-w-[26ch] font-display text-[clamp(1.2rem,2.4vw,1.6rem)] font-extrabold leading-[1.15] tracking-[-0.025em] text-balance">
          Si votre projet n’est pas dans cette liste, demandez quand même. Les trois conditions
          comptent plus que le nom du framework.
        </p>
      </Container>
    </section>
  )
}

const HANDOVER = [
  'Le dépôt Git, avec tout l’historique des changements.',
  'Les accès à l’hébergement et au nom de domaine, à votre nom.',
  'Un document qui explique comment le projet se déploie, en une page.',
]

function Handover() {
  return (
    <Section
      id="depart"
      title="Ce qui se passe le jour où vous arrêtez la maintenance."
      intro={
        <p>
          L’autre peur, celle dont on parle moins : se retrouver dépendant du prestataire qui a
          repris le projet. Voilà à quoi ressemble une sortie propre.
        </p>
      }
      background="sunken"
    >
      <div className="mt-14 grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center">
        <p className="rise max-w-[18ch] font-display text-[clamp(1.5rem,3.4vw,2.2rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-balance">
          Je ne garde ni accès, ni sauvegarde, ni compte de service.
        </p>

        <Glass thick className="rise px-7 py-8 sm:px-10 sm:py-10">
          <ul>
            {HANDOVER.map((line, rank) => (
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
            Un autre développeur peut reprendre le projet sans avoir à me parler.
          </p>
        </Glass>
      </div>
    </Section>
  )
}
