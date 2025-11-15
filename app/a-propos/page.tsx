import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'À propos',
  description:
    'NMW Studios, agence web indépendante, conçoit des sites et applications sur mesure alliant design, performance et fiabilité technique.',
  alternates: {
    canonical: 'https://nmwstudios.com/a-propos',
  },
  openGraph: {
    title: 'À propos | NMW Studios',
    description: 'NMW Studios, agence web indépendante, conçoit des sites et applications sur mesure alliant design, performance et fiabilité technique.',
    url: 'https://nmwstudios.com/a-propos',
    type: 'website',
  },
}

const values = [
  {
    title: 'Transparence',
    description:
      'Délais réalistes, communication honnête et suivi constant à chaque étape du projet.',
  },
  {
    title: 'Qualité',
    description:
      'Conception web moderne, code maintenable, performances optimisées et solutions évolutives.',
  },
  {
    title: 'Accompagnement',
    description:
      'Support technique et conseils après la livraison pour assurer la réussite de votre projet sur le long terme.',
  },
]

const methodology = [
  {
    number: '01',
    title: 'Échange & Compréhension',
    description:
      'Analyse de vos besoins, objectifs et contraintes pour définir la meilleure solution technique et fonctionnelle.',
  },
  {
    number: '02',
    title: 'Conception & Maquettes',
    description:
      'Création de maquettes et architecture technique validées avec vous avant tout développement.',
  },
  {
    number: '03',
    title: 'Développement & Tests',
    description:
      'Développement itératif avec feedback régulier, tests et optimisation pour garantir performance et qualité.',
  },
  {
    number: '04',
    title: 'Mise en ligne & Suivi',
    description:
      'Livraison du projet, accompagnement à la prise en main, suivi et évolutions possibles sur le long terme.',
  },
]

const techStack = [
  {
    category: 'Frontend',
    technologies: ['React', 'Next.js', 'VueJS', 'TypeScript', 'Tailwind CSS'],
  },
  {
    category: 'Backend',
    technologies: ['Node.js', 'NestJS'],
  },
  {
    category: 'Bases de données',
    technologies: ['PostgreSQL', 'MongoDB', 'MySQL'],
  },
  {
    category: 'DevOps & Cloud',
    technologies: ['Docker', 'AWS', 'CI/CD', 'Vercel'],
  },
  {
    category: 'Autres outils',
    technologies: ['GraphQL', 'React Native', 'Cypress'],
  },
]

export default function AProposPage() {
  return (
    <>
      {/* Hero Section */}
      <Section className="pt-24 md:pt-32">
        <Container>
          <ScrollReveal className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white md:text-6xl">
              <span className="bg-gradient-to-r from-accent-blue to-purple-500 bg-clip-text text-transparent">
                NMW Studios
              </span>{' '}
              — Votre partenaire web fiable et sur mesure
            </h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 md:text-xl">
              NMW Studios accompagne les entreprises et indépendants dans la
              conception et le développement de solutions web performantes,
              modernes et évolutives.
            </p>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Du site vitrine au produit digital complet, notre mission est de
              transformer vos idées en expériences digitales concrètes et
              efficaces.
            </p>
          </ScrollReveal>
        </Container>
      </Section>

      {/* Notre approche */}
      <Section>
        <Container>
          <ScrollReveal className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
              Notre approche
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Chez NMW Studios, chaque projet est unique. Nous privilégions une
              collaboration claire, directe et transparente, pour vous garantir
              des solutions adaptées à vos besoins réels et une expérience
              client fluide.
            </p>
          </ScrollReveal>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {values.map((value, i) => (
              <ScrollReveal key={value.title} delay={i * 0.1}>
                <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-gray-600 dark:text-gray-400">
                    {value.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Qui se cache derrière NMW Studios */}
      <Section className="bg-gray-50 dark:bg-gray-950">
        <Container>
          <div className="mx-auto max-w-3xl">
            <ScrollReveal className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
                Qui se cache derrière NMW Studios ?
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  L&apos;agence est dirigée par{' '}
                  <strong className="text-gray-900 dark:text-white">
                    Nathan Marimbordes
                  </strong>
                  , développeur web fullstack avec plusieurs années
                  d&apos;expérience en entreprise et freelance. Son expertise
                  technique garantit que chaque projet est conçu avec rigueur,
                  fiabilité et créativité.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </Section>

      {/* Méthodologie */}
      <Section>
        <Container>
          <ScrollReveal className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
              Comment nous travaillons
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Un processus structuré pour garantir que vos projets aboutissent
              dans les meilleures conditions
            </p>
          </ScrollReveal>

          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {methodology.map((step, i) => (
              <ScrollReveal key={step.number} delay={i * 0.1}>
                <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-blue/10 text-xl font-bold text-accent-blue">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-gray-600 dark:text-gray-400">
                    {step.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Stack technique */}
      <Section className="bg-gray-50 dark:bg-gray-950">
        <Container>
          <ScrollReveal className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
              Des outils modernes pour des résultats durables
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Nous travaillons avec des technologies web éprouvées pour garantir
              fiabilité, performance et évolutivité.
            </p>
          </ScrollReveal>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {techStack.map((stack, i) => (
              <ScrollReveal key={stack.category} delay={i * 0.1}>
                <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {stack.category}
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {stack.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-lg bg-accent-blue/10 px-3 py-1 text-sm font-medium text-accent-blue"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA Final */}
      <Section className="bg-gradient-to-br from-accent-blue to-blue-600">
        <Container>
          <ScrollReveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Prêt à concrétiser votre projet web ?
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              Discutons de vos besoins et voyons comment NMW Studios peut
              concevoir un site ou une application qui reflète votre identité et
              soutient vos ambitions.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                href="/contact"
                variant="secondary"
                className="bg-white text-accent-blue hover:bg-gray-100"
                bounce
              >
                Demander un devis
              </Button>
              <Button
                href="/services"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                bounce
              >
                Voir nos services
              </Button>
            </div>
          </ScrollReveal>
        </Container>
      </Section>
    </>
  )
}
