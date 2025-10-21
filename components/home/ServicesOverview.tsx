'use client';

import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

const services = [
  {
    title: 'Création de sites web et MVP',
    description: 'Sites vitrines, landing pages ou MVP rapides pour tester vos idées. Après le lancement, je peux continuer à développer et ajouter des fonctionnalités selon vos besoins et votre budget.',
    benefits: [
      'Design moderne et responsive',
      'Performance optimisée (Lighthouse 90+)',
      'SEO intégré dès le départ',
    ],
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Outils d\'administration / Dashboards',
    description: 'Création d\'outils d\'administration et de dashboards pour gérer vos contenus et vos données internes.',
    benefits: [
      'Interfaces claires et adaptées à vos besoins',
      'Intégrations API si nécessaire',
      'Déploiement et hébergement possibles sous ma supervision',
    ],
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: 'Maintenance & Hébergement',
    description: 'Suivi, mises à jour et évolutions de vos projets existants. Je peux gérer l\'hébergement et le déploiement (Vercel, OVH ou autre infrastructure) pour que tout fonctionne correctement et en toute sécurité.',
    benefits: [
      'Monitoring et mises à jour',
      'Hébergement géré',
      'Support technique',
    ],
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
];

export function ServicesOverview() {

  return (
    <Section>
      <Container>
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-5xl">
            Comment je{' '}
            <span className="bg-gradient-to-r from-accent-blue to-purple-500 bg-clip-text text-transparent">
              transforme vos projets
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Des solutions techniques adaptées à vos ambitions, du MVP à l&apos;application d&apos;entreprise
          </p>
        </ScrollReveal>

        <div className="mt-16 grid gap-8 md:grid-cols-2 [&>*:nth-child(3)]:md:col-span-2 [&>*:nth-child(3)]:md:mx-auto [&>*:nth-child(3)]:md:max-w-2xl">
          {services.map((service, i) => (
            <ScrollReveal key={service.title} delay={i * 0.1}>
              <div className="service-card group rounded-2xl border border-gray-200 bg-white p-8 transition-all hover:border-accent-blue/50 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent-blue/10 text-accent-blue transition-transform group-hover:scale-110">
                {service.icon}
              </div>

              <h3 className="mt-6 text-xl font-bold text-gray-900 dark:text-white">
                {service.title}
              </h3>

              <p className="mt-3 text-gray-600 dark:text-gray-400">
                {service.description}
              </p>

              <ul className="mt-6 space-y-3">
                {service.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <svg className="mt-0.5 h-5 w-5 shrink-0 text-accent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.4} className="mt-12 rounded-xl border border-gray-200 bg-white/50 p-6 text-center dark:border-gray-800 dark:bg-gray-900/50">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Disponibilité limitée pour garantir qualité et suivi. Délais réalistes adaptés à chaque projet.
          </p>
        </ScrollReveal>
      </Container>
    </Section>
  );
}
