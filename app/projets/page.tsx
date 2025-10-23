import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { ProjectCard } from '@/components/projets/ProjectCard'
import { PROJECTS } from '@/lib/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projets',
  description: 'Découvrez mes projets de développement web : landing pages, sites vitrines et dashboards SaaS.',
}

export default function ProjetsPage() {
  return (
    <>
      {/* Hero Section */}
      <Section className="pt-24 md:pt-32">
        <Container>
          <ScrollReveal className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white md:text-6xl">
              Mes{' '}
              <span className="bg-gradient-to-r from-accent-blue to-purple-500 bg-clip-text text-transparent">
                réalisations
              </span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 md:text-xl">
              Découvrez 3 projets démo fonctionnels qui illustrent mes compétences en développement web moderne.
              Chaque projet est déployé en ligne et accessible via un lien direct.
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

      {/* About Boilerplates Section */}
      <Section className="bg-gray-50 dark:bg-gray-950">
        <Container>
          <ScrollReveal className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
              Une base technique solide :{' '}
              <span className="bg-gradient-to-r from-accent-blue to-purple-500 bg-clip-text text-transparent">
                mes boilerplates maison
              </span>
            </h2>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
              Ces projets reposent sur mes propres boilerplates (nmw-site-starter et nmw-app-starter),
              garantissant un démarrage ultra-rapide, une qualité constante et une scalabilité maximale.
              Chaque boilerplate intègre un design system complet, des composants testés et réutilisables,
              et les dernières best practices Next.js pour des applications performantes et maintenables.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm dark:bg-gray-900 dark:text-gray-300">
                Next.js 15
              </span>
              <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm dark:bg-gray-900 dark:text-gray-300">
                TypeScript Strict
              </span>
              <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm dark:bg-gray-900 dark:text-gray-300">
                Tailwind CSS
              </span>
              <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm dark:bg-gray-900 dark:text-gray-300">
                Motion One
              </span>
              <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm dark:bg-gray-900 dark:text-gray-300">
                Design System
              </span>
            </div>
          </ScrollReveal>
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
              je peux vous livrer un projet de qualité en quelques jours.
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
