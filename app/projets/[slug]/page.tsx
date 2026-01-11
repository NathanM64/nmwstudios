import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { PROJECTS } from '@/lib/constants'
import { ExternalLink, ArrowLeft, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  return PROJECTS.map((project) => ({
    slug: project.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = PROJECTS.find((p) => p.slug === slug)

  if (!project) {
    return {
      title: 'Projet non trouvé',
    }
  }

  return {
    title: `${project.title} - Case Study`,
    description: project.description,
    alternates: {
      canonical: `https://nmwstudios.com/projets/${slug}`,
    },
    openGraph: {
      title: `${project.title} - Case Study | NMW Studios`,
      description: project.description,
      url: `https://nmwstudios.com/projets/${slug}`,
      images: [project.image],
    },
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params
  const projectIndex = PROJECTS.findIndex((p) => p.slug === slug)

  if (projectIndex === -1) {
    notFound()
  }

  const project = PROJECTS[projectIndex]
  const prevProject = projectIndex > 0 ? PROJECTS[projectIndex - 1] : null
  const nextProject = projectIndex < PROJECTS.length - 1 ? PROJECTS[projectIndex + 1] : null

  return (
    <>
      {/* Hero Section with CTA */}
      <Section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white pt-24 dark:from-gray-950 dark:to-gray-900 md:pt-32">
        <Container>
          <ScrollReveal>
            <div className="mx-auto max-w-4xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-accent-blue/10 px-4 py-2 text-sm font-medium text-accent-blue">
                <span>{project.category}</span>
                <span>•</span>
                <span>{project.year}</span>
              </div>
              <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white md:text-6xl">
                {project.title}
              </h1>
              <p className="mt-6 text-xl text-gray-600 dark:text-gray-400">
                {project.description}
              </p>

              {/* CTA Button - Live Demo */}
              <div className="mt-8 flex justify-center">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent-blue px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl"
                >
                  <ExternalLink className="h-5 w-5" />
                  Explorer la démo
                </a>
              </div>
            </div>
          </ScrollReveal>

          {/* Hero Screenshot */}
          <ScrollReveal delay={0.2}>
            <div className="relative mx-auto mt-16 max-w-6xl overflow-hidden rounded-2xl border border-gray-200 shadow-2xl dark:border-gray-800">
              <Image
                src={project.image}
                alt={`Screenshot de ${project.title}`}
                width={1200}
                height={675}
                className="w-full"
                priority
              />
            </div>
          </ScrollReveal>
        </Container>
      </Section>

      {/* Project Overview */}
      <Section>
        <Container>
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-12 md:grid-cols-2">
              <ScrollReveal>
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-accent-blue">
                    Contexte
                  </h2>
                  <h3 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                    {project.client}
                  </h3>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">
                    {project.description}
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-accent-blue">
                    Objectif
                  </h2>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">
                    {project.objective}
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* Key Features */}
      <Section className="bg-gray-50 dark:bg-gray-950">
        <Container>
          <div className="mx-auto max-w-4xl">
            <ScrollReveal className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
                Points clés du projet
              </h2>
            </ScrollReveal>

            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {project.highlights.map((highlight, i) => (
                <ScrollReveal key={i} delay={i * 0.1}>
                  <div className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-blue/10">
                      <svg
                        className="h-5 w-5 text-accent-blue"
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
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{highlight}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Stack Technique */}
      <Section>
        <Container>
          <div className="mx-auto max-w-4xl">
            <ScrollReveal className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
                Stack technique
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                Technologies et outils utilisés pour ce projet
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="mt-12 flex flex-wrap justify-center gap-4">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-gray-200 bg-white px-6 py-3 text-base font-medium text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </Section>

      {/* Results */}
      <Section className="bg-gray-50 dark:bg-gray-950">
        <Container>
          <div className="mx-auto max-w-4xl">
            <ScrollReveal className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
                Résultat
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                {project.result}
              </p>
            </ScrollReveal>

            {/* Mobile Screenshot - Only show if project has mobile image */}
            {project.imageMobile && (
              <ScrollReveal delay={0.2}>
                <div className="relative mx-auto mt-12 max-w-sm overflow-hidden rounded-2xl border border-gray-200 shadow-xl dark:border-gray-800">
                  <Image
                    src={project.imageMobile}
                    alt={`Screenshot mobile de ${project.title}`}
                    width={375}
                    height={812}
                    className="w-full"
                  />
                </div>
              </ScrollReveal>
            )}
          </div>
        </Container>
      </Section>

      {/* CTA to visit live site */}
      <Section className="bg-gradient-to-br from-accent-blue to-blue-600">
        <Container>
          <ScrollReveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Prêt à découvrir le projet en action ?
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              Explorez la démo en ligne pour découvrir toutes les fonctionnalités
            </p>
            <div className="mt-8">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-base font-semibold text-accent-blue shadow-lg transition-all hover:bg-gray-100 hover:shadow-xl"
              >
                <ExternalLink className="h-5 w-5" />
                Explorer la démo
              </a>
            </div>
          </ScrollReveal>
        </Container>
      </Section>

      {/* Navigation to other projects */}
      <Section>
        <Container>
          <div className="mx-auto max-w-4xl">
            <ScrollReveal>
              <div className="flex items-center justify-between border-t border-gray-200 pt-8 dark:border-gray-800">
                {prevProject ? (
                  <Link
                    href={`/projets/${prevProject.slug}`}
                    className="group flex items-center gap-2 text-gray-600 transition-colors hover:text-accent-blue dark:text-gray-400"
                  >
                    <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                    <div className="text-left">
                      <div className="text-sm font-medium">Projet précédent</div>
                      <div className="text-base font-semibold">{prevProject.title}</div>
                    </div>
                  </Link>
                ) : (
                  <div />
                )}

                {nextProject ? (
                  <Link
                    href={`/projets/${nextProject.slug}`}
                    className="group flex items-center gap-2 text-gray-600 transition-colors hover:text-accent-blue dark:text-gray-400"
                  >
                    <div className="text-right">
                      <div className="text-sm font-medium">Projet suivant</div>
                      <div className="text-base font-semibold">{nextProject.title}</div>
                    </div>
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                ) : (
                  <div />
                )}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="mt-8 text-center">
                <Button href="/projets" variant="secondary">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voir tous les projets
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </Section>
    </>
  )
}
