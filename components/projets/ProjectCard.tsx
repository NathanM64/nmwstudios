'use client'

import Image from 'next/image'
import Link from 'next/link'
import { TiltCard } from '@/components/ui/TiltCard'
import { ExternalLink, ArrowRight } from 'lucide-react'

interface ProjectCardProps {
  slug: string
  title: string
  description: string
  category: string
  tags: readonly string[]
  image: string
  liveUrl: string
  githubUrl: string | null
  year: string
  objective: string
  result: string
  highlights: readonly string[]
}

export function ProjectCard({ project }: { project: ProjectCardProps }) {
  return (
    <TiltCard className="project-card group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-all hover:shadow-2xl dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-col">
        {/* Screenshot */}
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={project.image}
            alt={`Screenshot de ${project.title}`}
            fill
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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

          {/* Highlights */}
          <div className="mt-6">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              Points clés :
            </span>
            <ul className="mt-3 space-y-2">
              {project.highlights.slice(0, 4).map((highlight) => (
                <li
                  key={highlight}
                  className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                >
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0 text-accent-blue"
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
                  {highlight}
                </li>
              ))}
            </ul>
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

          {/* Links - CTA bien visible */}
          <div className="mt-6 space-y-3">
            {/* Main CTA - Project Details */}
            <Link
              href={`/projets/${project.slug}`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent-blue px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg"
            >
              Découvrir le projet
              <ArrowRight className="h-4 w-4" />
            </Link>

            {/* Secondary CTA - Live Demo */}
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <ExternalLink className="h-4 w-4" />
              Voir la démo
            </a>
          </div>
        </div>
      </div>
    </TiltCard>
  )
}
