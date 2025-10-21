import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services',
  description: 'Découvrez mes services de développement web : création de sites, MVP, dashboards et maintenance.',
};

const services = [
  {
    id: 'creation-web-mvp',
    title: 'Création de sites web et MVP',
    description: 'Sites vitrines, landing pages ou MVP rapides pour tester vos idées. Après le lancement, je peux continuer à développer et ajouter des fonctionnalités selon vos besoins et votre budget.',
    features: [
      {
        title: 'Sites vitrine professionnels',
        description: 'Site moderne pour présenter votre activité, vos services et générer des leads qualifiés.',
        deliverables: ['Design responsive', 'SEO optimisé', 'Formulaire de contact', 'Analytics intégré'],
      },
      {
        title: 'Landing pages haute conversion',
        description: 'Page unique optimisée pour convertir vos visiteurs en clients ou leads.',
        deliverables: ['A/B testing ready', 'Animations engageantes', 'CTA optimisés', 'Performance maximale'],
      },
      {
        title: 'MVP (Minimum Viable Product)',
        description: 'Version simplifiée de votre produit pour tester le marché rapidement et à moindre coût.',
        deliverables: ['Fonctionnalités essentielles', 'Itération rapide', 'Feedback utilisateurs', 'Évolution progressive'],
      },
    ],
    technologies: ['Next.js 15', 'React 18+', 'TypeScript', 'Tailwind CSS', 'Motion One'],
    process: [
      'Échange initial pour comprendre vos objectifs',
      'Proposition de maquettes et architecture technique',
      'Développement itératif avec feedback régulier',
      'Tests, optimisations et mise en production',
      'Formation et documentation si nécessaire',
    ],
    icon: (
      <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'dashboards-admin',
    title: 'Outils d\'administration / Dashboards',
    description: 'Création d\'outils d\'administration et de dashboards pour gérer vos contenus et vos données internes.',
    features: [
      {
        title: 'Back-office sur mesure',
        description: 'Interface d\'administration adaptée à vos processus métier et vos besoins spécifiques.',
        deliverables: ['CRUD complet', 'Gestion des rôles', 'Interface intuitive', 'Validation des données'],
      },
      {
        title: 'Dashboards analytiques',
        description: 'Visualisation de données pour suivre vos KPIs et prendre les bonnes décisions.',
        deliverables: ['Graphiques interactifs', 'Filtres avancés', 'Export de données', 'Temps réel possible'],
      },
      {
        title: 'Intégrations API',
        description: 'Connexion avec vos outils existants (CRM, ERP, services tiers).',
        deliverables: ['APIs REST/GraphQL', 'Webhooks', 'Synchronisation', 'Gestion d\'erreurs'],
      },
    ],
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL', 'MongoDB', 'Supabase'],
    process: [
      'Audit de vos besoins et processus actuels',
      'Conception de l\'architecture et des interfaces',
      'Développement par module avec tests unitaires',
      'Déploiement sécurisé et monitoring',
      'Support et évolutions continues',
    ],
    icon: (
      <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    id: 'maintenance-hebergement',
    title: 'Maintenance & Hébergement',
    description: 'Suivi, mises à jour et évolutions de vos projets existants. Je peux gérer l\'hébergement et le déploiement (Vercel, OVH ou autre infrastructure) pour que tout fonctionne correctement et en toute sécurité.',
    features: [
      {
        title: 'Maintenance corrective',
        description: 'Correction rapide des bugs et problèmes techniques rencontrés.',
        deliverables: ['Hotfixes prioritaires', 'Tests de régression', 'Documentation des corrections', 'Support réactif'],
      },
      {
        title: 'Maintenance évolutive',
        description: 'Ajout de nouvelles fonctionnalités et amélioration continue de votre application.',
        deliverables: ['Nouvelles features', 'Optimisations UX', 'Mise à jour des dépendances', 'Refactoring'],
      },
      {
        title: 'Hébergement et monitoring',
        description: 'Gestion de l\'infrastructure, déploiements et surveillance de la performance.',
        deliverables: ['Déploiement continu', 'Monitoring 24/7', 'Sauvegardes régulières', 'Alertes automatiques'],
      },
    ],
    technologies: ['Vercel', 'OVH', 'Git', 'Monitoring tools', 'CI/CD'],
    process: [
      'Audit de l\'existant et état des lieux',
      'Mise en place des outils de monitoring',
      'Plan de maintenance personnalisé',
      'Interventions régulières ou à la demande',
      'Rapports mensuels de performance',
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
                développement web
              </span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 md:text-xl">
              Du site vitrine au dashboard complexe, je vous accompagne dans tous vos projets web
              avec rigueur et transparence.
            </p>
          </ScrollReveal>
        </Container>
      </Section>

      {/* Services détaillés */}
      {services.map((service, index) => (
        <Section key={service.id} className={index % 2 === 1 ? 'bg-gray-50 dark:bg-gray-950' : ''}>
          <Container>
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Left: Icon + Description */}
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

                {/* Technologies */}
                <div className="mt-8">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-accent-blue">
                    Technologies utilisées
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {service.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Process */}
                <div className="mt-8">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-accent-blue">
                    Processus
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {service.process.map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-blue/10 text-xs font-semibold text-accent-blue">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>

              {/* Right: Features */}
              <div className="space-y-6">
                {service.features.map((feature, i) => (
                  <ScrollReveal key={i} delay={i * 0.1}>
                    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {feature.title}
                      </h3>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {feature.description}
                      </p>
                      <ul className="mt-4 space-y-2">
                        {feature.deliverables.map((item) => (
                          <li key={item} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <svg className="h-4 w-4 shrink-0 text-accent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {item}
                          </li>
                        ))}
                      </ul>
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
              Un projet en tête ?
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              Discutons de vos besoins et je vous proposerai une solution adaptée à votre budget et vos objectifs.
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
                Voir mes réalisations
              </Button>
            </div>
          </ScrollReveal>
        </Container>
      </Section>
    </>
  );
}
