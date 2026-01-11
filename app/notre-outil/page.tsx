import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import type { Metadata } from 'next'
import { Check, Command, BarChart3, FileText, Users, FolderKanban, Bell, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'NMW Dashboard - Outil Gestion Freelance & Micro-Entrepreneur',
  description: 'Dashboard de gestion pour freelances et micro-entrepreneurs : clients, devis, factures, projets, comptabilité URSSAF. Développé avec Next.js, bientôt disponible en SaaS.',
  alternates: {
    canonical: 'https://nmwstudios.com/notre-outil',
  },
  openGraph: {
    title: 'NMW Dashboard - Outil Gestion Freelance | NMW Studios',
    description: 'Dashboard de gestion pour freelances : clients, devis, factures, projets, comptabilité. Bientôt disponible en SaaS.',
    url: 'https://nmwstudios.com/notre-outil',
    type: 'website',
  },
}

const features = [
  {
    icon: Users,
    title: 'Gestion clients',
    description: 'Centralisez toutes les infos de vos clients en un seul endroit. Recherche instantanée, historique complet des interactions.',
  },
  {
    icon: FileText,
    title: 'Devis & Factures',
    description: 'Créez des devis professionnels en quelques clics. Génération PDF automatique, envoi par email intégré.',
  },
  {
    icon: FolderKanban,
    title: 'Suivi de projets',
    description: 'Trackez l\'avancement de tous vos projets actifs. Statuts, progression, liens GitHub/staging/prod.',
  },
  {
    icon: BarChart3,
    title: 'Dashboard analytics',
    description: 'Visualisez votre activité en temps réel. CA mensuel/annuel, taux de conversion, pipeline commercial.',
  },
  {
    icon: Command,
    title: 'Command Palette (⌘K)',
    description: 'Naviguez à la vitesse de la lumière. Recherche globale, actions rapides, raccourcis clavier.',
  },
  {
    icon: Bell,
    title: 'Notifications automatiques',
    description: 'Relances factures, devis expirés, rappels clients. Templates email professionnels personnalisables.',
  },
]

const techStack = [
  { name: 'Next.js 15', description: 'Framework React moderne' },
  { name: 'TypeScript', description: 'Code robuste et maintenable' },
  { name: 'Tailwind CSS', description: 'Design système cohérent' },
  { name: 'Supabase', description: 'Backend et base de données' },
  { name: 'Prisma', description: 'ORM type-safe avec migrations' },
  { name: 'NextAuth v5', description: 'Authentification sécurisée' },
]

const faqs = [
  {
    question: 'Quand sera-t-il disponible ?',
    answer: 'Je vise un lancement en Q1/Q2 2025. Les inscrits à la liste d\'attente seront les premiers informés avec 2 semaines d\'avance.',
  },
  {
    question: 'Quel sera le prix ?',
    answer: 'Le pricing n\'est pas encore défini, mais l\'objectif est de rester accessible aux freelances (probablement < 30€/mois). Les early adopters auront une réduction à vie.',
  },
  {
    question: 'Puis-je avoir une démo ?',
    answer: 'Pour l\'instant, l\'outil est en usage privé. Les inscrits à la liste d\'attente recevront un accès anticipé à la beta.',
  },
  {
    question: 'C\'est juste un side-project ?',
    answer: 'Non, c\'est l\'outil que j\'utilise réellement pour gérer mon activité freelance au quotidien. Il gère mes vrais clients, mes vrais devis, mes vraies factures.',
  },
  {
    question: 'Quelle est la différence avec Pennylane/Sellsy ?',
    answer: 'NMW Dashboard est pensé pour les freelances tech, pas pour les comptables. Interface moderne, navigation rapide (⌘K), technologie 2025. Et surtout : créé par un freelance pour des freelances.',
  },
  {
    question: 'Mes données seront-elles sécurisées ?',
    answer: 'Oui. Hébergement Supabase (Europe), chiffrement, sauvegardes quotidiennes. Même infrastructure que les apps SaaS que je construis pour mes clients.',
  },
]

export default function NotreOutilPage() {
  return (
    <>
      {/* Hero Section */}
      <Section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white pt-24 dark:from-gray-950 dark:to-gray-900 md:pt-32">
        <Container>
          <ScrollReveal className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-600 dark:text-green-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
              </span>
              En production depuis 2024
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white md:text-6xl">
              NMW Dashboard
            </h1>
            <p className="mt-6 text-xl text-gray-600 dark:text-gray-400 md:text-2xl">
              Le dashboard que j&apos;utilise pour gérer mon activité freelance
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                href="#waitlist"
                variant="primary"
                bounce
                className="bg-green-600 hover:bg-green-700"
              >
                <Zap className="mr-2 h-5 w-5" />
                Rejoindre la liste d&apos;attente
              </Button>
              <Button
                href="#features"
                variant="outline"
                bounce
              >
                Découvrir les fonctionnalités
              </Button>
            </div>
          </ScrollReveal>

          {/* Hero Screenshot - Placeholder */}
          <ScrollReveal delay={0.2}>
            <div className="relative mx-auto mt-16 max-w-6xl">
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 shadow-2xl dark:border-gray-800 dark:bg-gray-900">
                <div className="aspect-video w-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900">
                  {/* Placeholder - À remplacer par screenshot dashboard overview */}
                  <div className="flex h-full items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      [Screenshot Dashboard Overview - À venir]
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </Section>

      {/* Why Section */}
      <Section>
        <Container>
          <div className="mx-auto max-w-3xl">
            <ScrollReveal className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
                Pourquoi j&apos;ai créé NMW Dashboard ?
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="prose prose-lg mt-8 text-gray-600 dark:prose-invert dark:text-gray-400">
                <p>
                  En tant que développeur freelance, j&apos;avais besoin d&apos;un outil simple
                  et moderne pour gérer mes clients, créer mes devis et suivre mes projets.
                </p>
                <p>
                  Les solutions existantes étaient soit trop complexes (Sellsy, Axonaut, Pennylane),
                  soit datées techniquement (interfaces des années 2010), soit trop chères pour
                  un freelance qui débute (50-100€/mois).
                </p>
                <p>
                  J&apos;ai donc créé mon propre outil. Et maintenant, je l&apos;utilise au quotidien
                  pour gérer NMW Studios.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </Section>

      {/* Features Section */}
      <Section id="features" className="bg-gray-50 dark:bg-gray-950">
        <Container>
          <ScrollReveal className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
              Fonctionnalités actuelles
            </h2>
          </ScrollReveal>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <ScrollReveal key={feature.title} delay={i * 0.1}>
                <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
                  <div className="mb-4 inline-flex rounded-lg bg-accent-blue/10 p-3">
                    <feature.icon className="h-6 w-6 text-accent-blue" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Screenshots Grid - Placeholders */}
          <ScrollReveal delay={0.3}>
            <div className="mt-16 grid gap-8 md:grid-cols-2">
              {[
                'Gestion clients - Liste et recherche',
                'Création de devis - Éditeur items',
                'Dashboard analytics - Graphiques CA',
                'Command Palette - Navigation rapide (⌘K)',
              ].map((caption, i) => (
                <div key={i} className="overflow-hidden rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-900">
                  <div className="aspect-video w-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900">
                    <div className="flex h-full items-center justify-center p-4">
                      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                        [Screenshot - {caption}]
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </Container>
      </Section>

      {/* Tech Stack Section */}
      <Section>
        <Container>
          <div className="mx-auto max-w-4xl">
            <ScrollReveal className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
                Stack technique
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                Développé avec les mêmes technologies que j&apos;utilise pour mes clients
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {techStack.map((tech) => (
                  <div
                    key={tech.name}
                    className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-accent-blue"></div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {tech.name}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {tech.description}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="mt-12 rounded-2xl border border-accent-blue/20 bg-accent-blue/5 p-8 dark:bg-accent-blue/10">
                <p className="text-center text-lg text-gray-700 dark:text-gray-300">
                  → Même niveau de qualité et d&apos;attention aux détails que vous retrouverez
                  sur vos futurs projets.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </Section>

      {/* SaaS Waitlist Section */}
      <Section id="waitlist" className="bg-gradient-to-br from-accent-blue to-blue-600">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <ScrollReveal>
              <h2 className="text-3xl font-bold text-white md:text-4xl">
                Bientôt disponible en SaaS
              </h2>
              <p className="mt-6 text-lg text-blue-100">
                Je travaille actuellement à rendre cet outil accessible à tous les freelances
                et petites agences tech.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="mt-10 rounded-2xl bg-white p-8 dark:bg-gray-900">
                <h3 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
                  Rejoignez la liste d&apos;attente pour :
                </h3>
                <ul className="mb-8 space-y-3 text-left">
                  {[
                    'Être informé(e) du lancement en priorité',
                    'Bénéficier d\'une réduction early bird de 50%',
                    'Influencer les prochaines fonctionnalités',
                    'Accès anticipé à la beta privée',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Placeholder for Tally form */}
                <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 dark:border-gray-700 dark:bg-gray-800">
                  <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                    [Formulaire Tally à intégrer ici]
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="votre@email.com"
                      disabled
                      className="flex-1 rounded-lg border border-gray-300 px-4 py-3 dark:border-gray-700 dark:bg-gray-900"
                    />
                    <button
                      disabled
                      className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white opacity-50"
                    >
                      S&apos;inscrire
                    </button>
                  </div>
                </div>

                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  Aucun spam. Juste les infos importantes. Désinscription en 1 clic.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </Section>

      {/* FAQ Section */}
      <Section>
        <Container>
          <div className="mx-auto max-w-3xl">
            <ScrollReveal className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
                Questions fréquentes
              </h2>
            </ScrollReveal>

            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <ScrollReveal key={i} delay={i * 0.05}>
                  <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                    <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {faq.answer}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA Final - Services */}
      <Section className="bg-gray-50 dark:bg-gray-950">
        <Container>
          <ScrollReveal className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
              Vous avez besoin d&apos;un outil sur mesure ?
            </h2>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
              Si NMW Dashboard vous plaît, imaginez ce que je peux créer pour VOTRE business.
            </p>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Dashboard interne, SaaS, plateforme métier : je conçois des outils web modernes et sur mesure.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button href="/services" variant="primary" bounce>
                Découvrir mes services
              </Button>
              <Button href="/projets" variant="outline" bounce>
                Voir mes autres projets
              </Button>
            </div>
          </ScrollReveal>
        </Container>
      </Section>
    </>
  )
}
