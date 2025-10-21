'use client';

import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { TiltCard } from '@/components/ui/TiltCard';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

const projects = [
  {
    title: 'Nexus AI',
    category: 'Landing page',
    description: 'Landing page moderne pour une startup IA avec animations fluides et design system complet.',
    objective: 'Maximiser les conversions',
    result: '+40 % d\'inscriptions à la démo',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Motion One'],
    demoUrl: '#',
    gradient: 'from-blue-500 to-purple-600',
  },
  {
    title: 'Atelier Bois Massif',
    category: 'Refonte',
    description: 'Refonte complète d\'un site artisan vieillissant, modernisation et optimisation SEO locale.',
    objective: 'Améliorer la visibilité et l\'image',
    result: '+150 % de trafic organique',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    demoUrl: '#',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    title: 'TaskFlow',
    category: 'Application',
    description: 'Application de gestion interne intuitive avec filtres avancés et dark mode.',
    objective: 'Simplifier la gestion d\'équipe',
    result: 'Meilleure productivité et UX repensée',
    stack: ['React', 'TypeScript', 'Tailwind CSS'],
    demoUrl: '#',
    gradient: 'from-emerald-500 to-teal-600',
  },
];

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
            Chaque projet est une collaboration sur mesure avec ses propres défis et solutions
          </p>
        </ScrollReveal>

        <div className="mt-16 grid gap-8 md:grid-cols-2 [&>*:nth-child(3)]:md:col-span-2 [&>*:nth-child(3)]:md:mx-auto [&>*:nth-child(3)]:md:max-w-2xl">
          {projects.map((project, i) => (
            <ScrollReveal key={project.title} delay={i * 0.2}>
              <TiltCard className="project-card group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-all hover:shadow-2xl dark:border-gray-800 dark:bg-gray-900">
              <div className="flex flex-col p-8">
                {/* Image/Mockup placeholder */}
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-20`} />
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">
                        {project.title}
                      </div>
                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Screenshot à venir
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="mt-6">
                  <div className="inline-flex items-center gap-2">
                    <span className="text-sm font-medium text-accent-blue">
                      {project.category}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date().getFullYear()}
                    </span>
                  </div>

                  <h3 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
                    {project.title}
                  </h3>

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
                  <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold text-gray-900 dark:text-white">Stack : </span>
                    {project.stack.join(', ')}
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
  );
}
