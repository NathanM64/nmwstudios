import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services',
  description: 'Découvrez nos services de création web sur mesure : sites vitrines, MVP, dashboards et maintenance.',
  alternates: {
    canonical: 'https://nmwstudios.com/services',
  },
  openGraph: {
    title: 'Services | NMW Studios',
    description: 'Découvrez nos services de création web sur mesure : sites vitrines, MVP, dashboards et maintenance.',
    url: 'https://nmwstudios.com/services',
    type: 'website',
  },
};

const services = [
  {
    id: 'creation-web-mvp',
    title: 'Création de sites web et MVP',
    description: 'Nous concevons des sites vitrines, landing pages ou MVP pour valoriser votre activité et tester vos idées. Chaque projet est pensé pour être rapide, fluide et facilement évolutif.',
    offerings: [
      {
        title: 'Sites vitrines professionnels',
        description: 'Présentez votre activité et générez des contacts qualifiés.',
      },
      {
        title: 'Landing pages optimisées',
        description: 'Conçues pour convertir vos visiteurs en clients.',
      },
      {
        title: 'MVP rapide',
        description: 'Testez vos idées sur le marché avant de les développer pleinement.',
      },
    ],
    results: [
      'Design moderne et responsive',
      'Performance et référencement optimisés',
      'Solutions pensées pour vos objectifs et votre audience',
    ],
    icon: (
      <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'dashboards-admin',
    title: 'Outils d\'administration et dashboards',
    description: 'Développons des interfaces sur mesure pour gérer facilement vos contenus, utilisateurs ou données, et vous permettre de piloter votre activité efficacement.',
    offerings: [
      {
        title: 'Back-office sur mesure',
        description: 'Interface intuitive adaptée à vos besoins.',
      },
      {
        title: 'Dashboards analytiques',
        description: 'Suivi clair de vos indicateurs clés.',
      },
      {
        title: 'Intégrations avec vos outils existants',
        description: 'CRM, ERP, services tiers.',
      },
    ],
    results: [
      'Gestion simplifiée et sécurisée',
      'Prise de décision facilitée',
      'Évolutivité et maintenance faciles',
    ],
    icon: (
      <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    id: 'maintenance-hebergement',
    title: 'Maintenance et hébergement',
    description: 'Nous assurons le suivi technique et la sécurité de vos projets pour garantir leur stabilité et performance à long terme.',
    offerings: [
      {
        title: 'Maintenance corrective',
        description: 'Résolution rapide de tout problème technique.',
      },
      {
        title: 'Maintenance évolutive',
        description: 'Ajout de nouvelles fonctionnalités et amélioration continue.',
      },
      {
        title: 'Hébergement et monitoring',
        description: 'Gestion complète de l\'infrastructure et surveillance permanente.',
      },
    ],
    results: [
      'Tranquillité d\'esprit',
      'Performances et sécurité optimales',
      'Support réactif et suivi régulier',
    ],
    icon: (
      <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero Section */}
      <Section className="pt-24 md:pt-32">
        <Container>
          <ScrollReveal className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white md:text-6xl">
              Services de{' '}
              <span className="bg-gradient-to-r from-accent-blue to-purple-500 bg-clip-text text-transparent">
                création web sur mesure
              </span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 md:text-xl">
              Du site vitrine au tableau de bord complet, NMW Studios accompagne ses clients dans tous leurs projets web
              avec rigueur, transparence et solutions adaptées à leurs besoins.
            </p>
          </ScrollReveal>
        </Container>
      </Section>

      {/* Services détaillés */}
      {services.map((service, index) => (
        <Section key={service.id} className={index % 2 === 1 ? 'bg-gray-50 dark:bg-gray-950' : ''}>
          <Container>
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Left: Icon + Description + Results */}
              <ScrollReveal>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-blue/10 text-accent-blue">
                  {service.icon}
                </div>
                <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
                  {service.title}
                </h2>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                  {service.description}
                </p>

                {/* Résultat pour vous */}
                <div className="mt-8">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-accent-blue">
                    Résultat pour vous
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {service.results.map((result) => (
                      <li key={result} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <svg className="mt-0.5 h-5 w-5 shrink-0 text-accent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {result}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>

              {/* Right: Ce que vous obtenez */}
              <div className="space-y-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-accent-blue">
                  Ce que vous obtenez
                </h3>
                {service.offerings.map((offering, i) => (
                  <ScrollReveal key={i} delay={i * 0.1}>
                    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                        {offering.title}
                      </h4>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {offering.description}
                      </p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </Container>
        </Section>
      ))}

      {/* CTA Final */}
      <Section className="bg-gradient-to-br from-accent-blue to-blue-600">
        <Container>
          <ScrollReveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Vous avez un projet web ?
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              Parlons de vos besoins et voyons ensemble comment NMW Studios peut créer un site ou une application qui reflète votre identité et vos ambitions.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
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
                Voir nos réalisations
              </Button>
            </div>
          </ScrollReveal>
        </Container>
      </Section>
    </>
  );
}
