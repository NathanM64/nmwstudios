import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { ProjectCard } from '@/components/projets/ProjectCard'
import { PROJECTS } from '@/lib/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projets',
  description: 'Découvrez nos réalisations en développement web : landing pages, sites vitrines et dashboards SaaS.',
  alternates: {
    canonical: 'https://nmwstudios.com/projets',
  },
  openGraph: {
    title: 'Projets | NMW Studios',
    description: 'Découvrez nos réalisations en développement web : landing pages, sites vitrines et dashboards SaaS.',
    url: 'https://nmwstudios.com/projets',
    type: 'website',
  },
}

export default function ProjetsPage() {
  return (
    <>
      {/* Hero Section */}
      <Section className="pt-24 md:pt-32">
        <Container>
          <ScrollReveal className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white md:text-6xl">
              Nos{' '}
              <span className="bg-gradient-to-r from-accent-blue to-purple-500 bg-clip-text text-transparent">
                réalisations
              </span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 md:text-xl">
              Découvrez une sélection de projets qui illustrent notre approche du développement web moderne.
              Chaque réalisation est déployée en ligne et accessible directement.
            </p>
          </ScrollReveal>
        </Container>
      </Section>

      {/* Projects Grid */}
      <Section>
        <Container>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {PROJECTS.map((project, i) => (
              <ScrollReveal key={project.slug} delay={i * 0.15}>
                <ProjectCard project={project} />
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
              Besoin d&apos;un site web performant ?
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              Que ce soit pour une landing page, un site vitrine ou un dashboard SaaS,
              nous pouvons concevoir et livrer un projet de qualité adapté à vos besoins.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                href="/contact"
                variant="secondary"
                className="bg-white text-accent-blue hover:bg-gray-100"
                bounce
              >
                Discutons de votre projet
              </Button>
              <Button
                href="/tarifs"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                bounce
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
