import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tarifs',
  description:
    'Tarifs transparents pour nos services de développement web et accompagnement digital. Devis personnalisé gratuit.',
}

const pricingOptions = [
  {
    name: 'Landing page / MVP',
    description: 'Page unique ou MVP rapide pour présenter votre activité ou tester une idée.',
    startingPrice: 'À partir de 1 500 €',
    features: [
      'Design moderne et responsive',
      'Optimisation performance et SEO',
      'Structure pensée pour évoluer facilement',
    ],
    highlight: true,
  },
  {
    name: 'Site vitrine',
    description: 'Site complet pour présenter votre activité et générer des leads qualifiés.',
    startingPrice: 'À partir de 2 500 €',
    features: [
      "Jusqu'à 5 pages personnalisées",
      'Design moderne et responsive',
      'Formulaire de contact et SEO de base',
      'Analytics intégrés',
    ],
    highlight: false,
  },
  {
    name: 'Dashboard / Application sur mesure',
    description:
      "Outil d'administration, dashboard ou application web complète adaptée à vos besoins métier.",
    startingPrice: 'Sur devis',
    startingPriceDetail: '(à partir de 4 500 €)',
    features: [
      'Analyse complète et architecture adaptée',
      'Développement sur mesure et modulable',
      'Déploiement sécurisé et support initial inclus',
    ],
    highlight: false,
  },
]

const maintenanceOptions = [
  {
    name: 'Maintenance minimale',
    price: '50 €/mois',
    description: 'Vérifications ponctuelles et backups simples',
    features: [
      'Vérifications régulières',
      'Support par email',
      'Intervention si problème constaté',
    ],
  },
  {
    name: 'Maintenance standard',
    price: '100 €/mois',
    description: 'Maintenance proactive avec mises à jour régulières et suivi léger.',
    features: [
      'Mise à jour des contenus et plugins',
      'Monitoring léger et corrections ponctuelles',
      'Support prioritaire',
    ],
    highlight: true,
  },
  {
    name: 'Maintenance complète',
    price: '200 €/mois',
    description: 'Monitoring avancé, optimisation et support prioritaire pour garantir un fonctionnement optimal à long terme.',
    features: [
      'Hébergement et déploiement inclus si besoin',
      'Optimisations régulières et mises à jour complètes',
      'Support prioritaire et intervention rapide',
    ],
  },
]

const faqs = [
  {
    question: "Les tarifs incluent-ils l'hébergement ?",
    answer:
      "Pour les sites simples, l'hébergement peut être inclus. Pour les projets complexes, nous pouvons gérer l'hébergement dans le cadre de la maintenance complète.",
  },
  {
    question: 'Proposez-vous des paiements échelonnés ?',
    answer:
      'Oui, pour les projets supérieurs à 1 000 €, possibilité de paiement en 2 ou 3 fois.',
  },
  {
    question: 'Quels sont les délais de réalisation ?',
    answer:
      'Landing page : 1 à 2 semaines. Site vitrine : 2 à 4 semaines. Dashboard / Application sur mesure : 3 à 6 semaines.',
  },
  {
    question: 'Puis-je modifier mon site après livraison ?',
    answer:
      'Oui, la prise en main est incluse. Des fonctionnalités supplémentaires peuvent être ajoutées via maintenance ou nouveaux devis.',
  },
  {
    question: 'Travaillez-vous avec des frameworks spécifiques ?',
    answer:
      'Nous utilisons des technologies éprouvées du marché (Next.js, React, TypeScript) qui garantissent des sites performants et pérennes, sans dépendance à des solutions propriétaires.',
  },
  {
    question: 'Proposez-vous des refontes de sites existants ?',
    answer:
      'Oui, modernisation et migration possibles selon vos besoins. Tarif sur devis.',
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
                clairs et adaptés à votre projet
              </span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 md:text-xl">
              Chaque projet est unique. Les tarifs ci-dessous sont indicatifs et peuvent évoluer selon vos besoins et ambitions.
            </p>
          </ScrollReveal>
        </Container>
      </Section>

      {/* Pricing Grid - Projets */}
      <Section>
        <Container>
          <ScrollReveal className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
              Création de projets web
            </h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Nos tarifs de départ pour vos projets les plus fréquents
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
                    {option.startingPriceDetail && (
                      <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {option.startingPriceDetail}
                      </div>
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
              Maintenance & support technique
            </h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Assurez la performance et la sécurité de vos projets web
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
              FAQ – Questions courantes
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
              Un projet en tête ?
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              Chaque projet est unique. Discutons ensemble de vos besoins pour établir un
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
