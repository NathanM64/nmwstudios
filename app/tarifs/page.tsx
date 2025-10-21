import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tarifs',
  description:
    'Tarifs transparents pour mes services de développement web. Devis personnalisé gratuit.',
}

const pricingOptions = [
  {
    name: 'Landing page / MVP',
    description: 'Page unique ou MVP rapide pour tester une idée',
    startingPrice: 'À partir de 500 €',
    features: [
      'Pages optimisées pour convertir',
      'Animations et micro-interactions légères',
      'Optimisation performance',
      "Possibilité d'ajouter des intégrations simples",
    ],
    highlight: true,
  },
  {
    name: 'Site vitrine',
    description: 'Site professionnel pour présenter votre activité',
    startingPrice: 'À partir de 1 000 €',
    features: [
      "Jusqu'à 5 pages",
      'Design moderne et responsive',
      'Formulaire de contact et SEO de base',
      'Analytics intégré',
    ],
    highlight: false,
  },
  {
    name: 'Dashboard / Application sur mesure',
    description:
      "Outil d'administration ou application web pour gérer vos contenus ou données internes",
    startingPrice: 'Sur devis',
    features: [
      'Analyse des besoins et architecture adaptée',
      'Développement modulaire et tests unitaires',
      'Déploiement sécurisé',
      'Maintenance initiale incluse (1 à 2 mois)',
    ],
    highlight: false,
  },
]

const maintenanceOptions = [
  {
    name: 'Maintenance minimale',
    price: '20 €/mois',
    description: 'Vérifications ponctuelles et backups simples',
    features: [
      'Vérifications ponctuelles et backups simples',
      'Support uniquement par email',
      'Aucune intervention proactive si tout fonctionne bien',
    ],
  },
  {
    name: 'Maintenance basique',
    price: '50 €/mois',
    description: 'Vérifications régulières et mises à jour légères',
    features: [
      'Vérifications régulières, mises à jour légères',
      'Support email réactif',
      'Monitoring léger',
    ],
    highlight: true,
  },
  {
    name: 'Maintenance complète',
    price: '100–150 €/mois',
    description: 'Monitoring et support prioritaire avec optimisations',
    features: [
      'Monitoring régulier, corrections ponctuelles',
      'Optimisations mineures et mises à jour',
      'Support prioritaire',
      'Hébergement optionnel inclus',
    ],
  },
]

const faqs = [
  {
    question: "Les tarifs incluent-ils l'hébergement ?",
    answer:
      "Pour les sites statiques, l'hébergement peut être inclus gratuitement (Vercel, Netlify). Pour les sites plus complexes, comptez 10 € à 30 €/mois selon le trafic. L'hébergement est optionnellement inclus dans la formule Maintenance complète.",
  },
  {
    question: 'Proposez-vous des paiements échelonnés ?',
    answer:
      'Oui, pour les projets >1 000 €, possibilité de paiement en 2 ou 3 fois.',
  },
  {
    question: 'Quels sont les délais de réalisation ?',
    answer:
      'Landing page : 1 à 2 semaines. Site vitrine : 2 à 4 semaines. Dashboard / MVP : 3 à 6 semaines selon la complexité.',
  },
  {
    question: 'Puis-je modifier mon site après livraison ?',
    answer:
      'Oui, formation à la gestion de contenu incluse. Pour des fonctionnalités supplémentaires, maintenance ponctuelle ou mensuelle possible.',
  },
  {
    question: 'Travaillez-vous avec des frameworks spécifiques ?',
    answer:
      'Next.js, React, TypeScript pour le frontend, Node.js ou autre framework pour le backend.',
  },
  {
    question: 'Proposez-vous des refontes de sites existants ?',
    answer:
      'Oui, je peux moderniser votre site ou le migrer vers une stack récente. Tarif selon la complexité.',
  },
]

export default function TarifsPage() {
  return (
    <>
      {/* Hero Section */}
      <Section className="pt-24 md:pt-32">
        <Container>
          <ScrollReveal className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white md:text-6xl">
              Tarifs{' '}
              <span className="bg-gradient-to-r from-accent-blue to-purple-500 bg-clip-text text-transparent">
                transparents et adaptables
              </span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 md:text-xl">
              Chaque projet est unique. Les montants ci-dessous sont à titre
              indicatif et seront ajustés selon vos besoins réels.
            </p>
          </ScrollReveal>
        </Container>
      </Section>

      {/* Pricing Grid - Projets */}
      <Section>
        <Container>
          <ScrollReveal className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
              Création de projets
            </h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Tarifs de départ pour les projets les plus courants
            </p>
          </ScrollReveal>

          <div className="grid gap-8 md:grid-cols-3">
            {pricingOptions.map((option, i) => (
              <ScrollReveal key={option.name} delay={i * 0.1}>
                <div
                  className={`relative rounded-2xl border p-8 ${
                    option.highlight
                      ? 'border-accent-blue bg-accent-blue/5 shadow-lg shadow-accent-blue/10 dark:bg-accent-blue/10'
                      : 'border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900'
                  }`}
                >
                  {option.highlight && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-accent-blue px-4 py-1 text-xs font-semibold text-white">
                        Populaire
                      </span>
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {option.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {option.description}
                  </p>

                  <div className="mt-6">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {option.startingPrice}
                    </span>
                    {option.startingPrice !== 'Sur devis' && (
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                        HT
                      </span>
                    )}
                  </div>

                  <ul className="mt-8 space-y-3">
                    {option.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400"
                      >
                        <svg
                          className="mt-0.5 h-5 w-5 shrink-0 text-accent-blue"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    <Button
                      href="/contact"
                      variant={option.highlight ? 'primary' : 'outline'}
                      className="w-full"
                      bounce
                    >
                      Demander un devis
                    </Button>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Maintenance Pricing */}
      <Section className="bg-gray-50 dark:bg-gray-950">
        <Container>
          <ScrollReveal className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
              Maintenance & Support
            </h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Gardez votre projet à jour et performant
            </p>
          </ScrollReveal>

          <div className="grid gap-8 md:grid-cols-3">
            {maintenanceOptions.map((option, i) => (
              <ScrollReveal key={option.name} delay={i * 0.1}>
                <div
                  className={`relative rounded-2xl border p-8 ${
                    option.highlight
                      ? 'border-accent-blue bg-accent-blue/5 shadow-lg shadow-accent-blue/10 dark:bg-accent-blue/10'
                      : 'border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900'
                  }`}
                >
                  {option.highlight && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-accent-blue px-4 py-1 text-xs font-semibold text-white">
                        Recommandé
                      </span>
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {option.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {option.description}
                  </p>

                  <div className="mt-6">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      {option.price}
                    </span>
                  </div>

                  <ul className="mt-6 space-y-3">
                    {option.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400"
                      >
                        <svg
                          className="mt-0.5 h-5 w-5 shrink-0 text-accent-blue"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* FAQ Section */}
      <Section>
        <Container>
          <ScrollReveal className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
              Questions fréquentes
            </h2>
          </ScrollReveal>

          <div className="mx-auto max-w-3xl space-y-6">
            {faqs.map((faq, i) => (
              <ScrollReveal key={i} delay={i * 0.05}>
                <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {faq.question}
                  </h3>
                  <p className="mt-3 text-gray-600 dark:text-gray-400">
                    {faq.answer}
                  </p>
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
              Besoin d&apos;un devis personnalisé ?
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              Chaque projet est unique. Discutons de vos besoins pour établir un
              devis précis et adapté.
            </p>
            <div className="mt-8">
              <Button
                href="/contact"
                variant="secondary"
                className="bg-white text-accent-blue hover:bg-gray-100"
                bounce
              >
                Demander un devis gratuit
              </Button>
            </div>
          </ScrollReveal>
        </Container>
      </Section>
    </>
  )
}
