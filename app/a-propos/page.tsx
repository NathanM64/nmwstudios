import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'À propos',
  description:
    'Développeur web freelance passionné, je crée des solutions web modernes et performantes adaptées à vos besoins.',
}

const values = [
  {
    title: 'Transparence',
    description:
      'Délais réalistes, tarifs clairs et communication honnête à chaque étape du projet.',
  },
  {
    title: 'Qualité',
    description:
      'Code propre, performances optimisées et respect des bonnes pratiques pour des projets durables.',
  },
  {
    title: 'Accompagnement',
    description:
      "Je reste disponible après la livraison pour assurer le suivi et l'évolution de votre projet.",
  },
]

const timeline = [
  {
    year: "2024 - Aujourd'hui",
    title: 'Lead Developer - Handddle',
    description:
      "Gestion complète de l'application web, déploiement et infrastructure DevOps. Pilotage technique de la plateforme de gestion d'impressions 3D en temps réel avec connexion directe aux machines. Refonte et évolution de l'architecture.",
    stack:
      'React, API Platform, MySQL, DevOps, CI/CD, Systèmes embarqués, Python',
  },
  {
    year: '2024',
    title: 'Consultant Développeur Web - AWS via Solutec',
    description:
      'Automatisation de la modernisation de code legacy (COBOL, PL/I) vers Java Spring et Angular. Gestion des dépendances mainframe, résolution de cas de test et création de CI avec AWS.',
    stack: 'Java Spring, Angular, AWS, CI/CD',
  },
  {
    year: '2023-2024',
    title: 'Développeur Fullstack - Monsieur Tshirt',
    description:
      'Conception de nouvelles features (backoffice, système de règles de promotion, app React Native/Electron sur Raspberry, e-commerce). Tests end-to-end avec Cypress.',
    stack: 'ReactJS, NodeJS, GraphQL, PostgreSQL, AWS, Cypress',
  },
  {
    year: '2021-2023',
    title: 'Développeur Fullstack - Akigora',
    description:
      'Développement de features variées (jobboard, Power BI, système de paiement, agenda, facturation, messagerie, notifications push, refonte parcours inscription). Maintenance plateforme globale.',
    stack: 'NodeJS, VueJS, MongoDB',
  },
  {
    year: '2020-2021',
    title: 'Développeur Fullstack - Handddle',
    description:
      "Gestion des impressions 3D en temps réel, gestion d'inventaires, connexion avec systèmes embarqués. Refonte complète de l'application de PHP/jQuery vers React/API Platform.",
    stack: 'React, API Platform, MySQL, PHP, jQuery',
  },
]

export default function AProposPage() {
  return (
    <>
      {/* Hero Section */}
      <Section className="pt-24 md:pt-32">
        <Container>
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            {/* Texte */}
            <ScrollReveal>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white md:text-6xl">
                Développeur web{' '}
                <span className="bg-gradient-to-r from-accent-blue to-purple-500 bg-clip-text text-transparent">
                  passionné et disponible
                </span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 md:text-xl">
                Derrière NMW Studios, il y a <strong>Nathan Marimbordes</strong>
                , développeur web fullstack avec{' '}
                <strong>5 ans d&apos;expérience</strong> en entreprise et
                freelance.
              </p>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                Passionné par la qualité du code et la création de solutions
                robustes, je me suis spécialisé dans le développement
                d&apos;applications web modernes, scalables et performantes.
              </p>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                Aujourd&apos;hui, je mets cette expertise au service des
                entrepreneurs, PME et startups qui cherchent un partenaire
                technique fiable pour concrétiser leurs projets.
              </p>
            </ScrollReveal>

            {/* Image placeholder / Avatar */}
            <ScrollReveal delay={0.2}>
              <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-accent-blue/20 to-purple-500/20 dark:border-gray-800">
                <div className="flex h-full items-center justify-center p-8">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-gray-900 dark:text-white">
                      NMW
                    </div>
                    <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                      Photo à venir
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </Section>

      {/* Mon approche */}
      <Section>
        <Container>
          <ScrollReveal className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
              Mon approche
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              En freelance, je privilégie une collaboration directe, sans
              intermédiaire. Cela me permet d&apos;être réactif, transparent et
              pleinement investi dans votre projet.
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

      {/* Parcours */}
      <Section className="bg-gray-50 dark:bg-gray-950">
        <Container>
          <ScrollReveal className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
              Mon parcours professionnel
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              5 ans d&apos;expérience en développement web, de l&apos;alternance
              au poste de consultant, avec des projets variés et challengeants.
            </p>
          </ScrollReveal>

          <div className="mx-auto mt-16 max-w-4xl space-y-8">
            {timeline.map((item, i) => (
              <ScrollReveal key={item.year} delay={i * 0.1}>
                <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                  {/* Année en badge */}
                  <div className="mb-4">
                    <span className="inline-block rounded-full bg-accent-blue px-4 py-1.5 text-xs font-bold text-white">
                      {item.year}
                    </span>
                  </div>

                  {/* Contenu */}
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                  <div className="mt-4">
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-500">
                      Stack :{' '}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {item.stack}
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Formation */}
      <Section>
        <Container>
          <ScrollReveal className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
              Formation
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Un parcours de formation solide en développement web et
              informatique.
            </p>
          </ScrollReveal>

          <div className="mx-auto mt-16 max-w-3xl space-y-6">
            <ScrollReveal delay={0.1}>
              <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Master Expert Développement Web
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      Ynov - Bordeaux
                    </p>
                  </div>
                  <span className="text-sm font-medium text-accent-blue">
                    2021 - 2023
                  </span>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Bachelor Développement Web
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      Ynov - Bordeaux
                    </p>
                  </div>
                  <span className="text-sm font-medium text-accent-blue">
                    2020 - 2021
                  </span>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      DUT Informatique
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      IUT de Bayonne et du Pays Basque
                    </p>
                  </div>
                  <span className="text-sm font-medium text-accent-blue">
                    2018 - 2020
                  </span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </Section>

      {/* Stack technique */}
      <Section className="bg-gray-50 dark:bg-gray-950">
        <Container>
          <ScrollReveal className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
              Technologies que j&apos;utilise
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Je travaille avec des outils modernes et éprouvés pour garantir
              performance, maintenabilité et évolutivité.
            </p>
          </ScrollReveal>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <ScrollReveal delay={0.1}>
              <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Frontend (Maîtrisé)
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    'React',
                    'Next.js',
                    'VueJS',
                    'TypeScript',
                    'GraphQL',
                    'jQuery',
                  ].map((tech) => (
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

            <ScrollReveal delay={0.2}>
              <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Backend (Maîtrisé)
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    'Node.js',
                    'NestJS',
                    'Symfony',
                    'API Platform',
                    'Java Spring',
                  ].map((tech) => (
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

            <ScrollReveal delay={0.3}>
              <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Bases de données
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {['PostgreSQL', 'MongoDB', 'MySQL'].map((tech) => (
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

            <ScrollReveal delay={0.4}>
              <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  DevOps & Cloud
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {['Docker', 'AWS', 'CI/CD', 'Git', 'Vercel'].map((tech) => (
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

            <ScrollReveal delay={0.5}>
              <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Autres technologies
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {['Angular', 'React Native', 'Cypress', 'Electron'].map(
                    (tech) => (
                      <span
                        key={tech}
                        className="rounded-lg bg-purple-500/10 px-3 py-1 text-sm font-medium text-purple-600 dark:text-purple-400"
                      >
                        {tech}
                      </span>
                    )
                  )}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.6}>
              <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Méthodologies
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {['Scrum', 'Gitflow', 'Clean Code', 'Tests E2E'].map(
                    (tech) => (
                      <span
                        key={tech}
                        className="rounded-lg bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-600 dark:text-emerald-400"
                      >
                        {tech}
                      </span>
                    )
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </Section>

      {/* CTA Final */}
      <Section className="bg-gradient-to-br from-accent-blue to-blue-600">
        <Container>
          <ScrollReveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Prêt à démarrer un projet ensemble ?
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              Je suis disponible pour discuter de vos besoins et voir comment je
              peux vous aider à concrétiser votre projet.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                href="/contact"
                variant="secondary"
                className="bg-white text-accent-blue hover:bg-gray-100"
                bounce
              >
                Me contacter
              </Button>
              <Button
                href="/tarifs"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Voir les tarifs
              </Button>
            </div>
          </ScrollReveal>
        </Container>
      </Section>
    </>
  )
}
