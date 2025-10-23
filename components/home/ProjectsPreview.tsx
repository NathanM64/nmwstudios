'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { TiltCard } from '@/components/ui/TiltCard'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { PROJECTS } from '@/lib/constants'
import { ExternalLink, Github, ArrowRight } from 'lucide-react'

const projects = PROJECTS

export function ProjectsPreview() {
  return (
    <Section>
      <Container>
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-5xl">
            <span className="bg-gradient-to-r from-accent-blue to-purple-500 bg-clip-text text-transparent">
              Projets récents
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Chaque projet illustre une approche sur-mesure, entre design soigné,
            performance technique et expérience utilisateur fluide.
          </p>
        </ScrollReveal>

        <div className="mt-16 grid gap-8 md:grid-cols-2 [&>*:nth-child(3)]:md:col-span-2 [&>*:nth-child(3)]:md:mx-auto [&>*:nth-child(3)]:md:max-w-2xl">
          {projects.map((project, i) => (
            <ScrollReveal key={project.title} delay={i * 0.2}>
              <TiltCard className="project-card group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-all hover:shadow-2xl dark:border-gray-800 dark:bg-gray-900">
                <div className="flex flex-col">
                  {/* Screenshot */}
                  <div className="relative aspect-video w-full overflow-hidden">
                    <Image
                      src={project.image}
                      alt={`Screenshot de ${project.title}`}
                      fill
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <div className="inline-flex items-center gap-2">
                      <span className="text-sm font-medium text-accent-blue">
                        {project.category}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {project.year}
                      </span>
                    </div>

                    <Link href={`/projets/${project.slug}`}>
                      <h3 className="mt-3 text-2xl font-bold text-gray-900 transition-colors hover:text-accent-blue dark:text-white dark:hover:text-accent-blue">
                        {project.title}
                      </h3>
                    </Link>

                    <p className="mt-3 text-gray-600 dark:text-gray-400">
                      {project.description}
                    </p>

                    <div className="mt-6 space-y-3">
                      <div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          Objectif :{' '}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {project.objective}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          Résultat :{' '}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {project.result}
                        </span>
                      </div>
                    </div>

                    {/* Stack */}
                    <div className="mt-6 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Links */}
                    <div className="mt-6 space-y-3">
                      {/* Main CTA - Case Study */}
                      <Link
                        href={`/projets/${project.slug}`}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent-blue px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg"
                      >
                        Voir le case study
                        <ArrowRight className="h-4 w-4" />
                      </Link>

                      {/* Secondary CTAs */}
                      <div className="flex gap-3">
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Démo
                        </a>
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                          <Github className="h-4 w-4" />
                          Code
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button href="/projets" variant="secondary" bounce>
            Voir tous les projets
          </Button>
        </div>
      </Container>
    </Section>
  )
}
