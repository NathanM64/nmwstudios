'use client';

import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

const technologies = [
  {
    category: 'Frontend',
    items: ['Next.js 15', 'React 18+', 'TypeScript', 'Tailwind CSS', 'Motion One / Framer Motion'],
  },
  {
    category: 'Backend & API',
    items: ['Node.js / NestJS', 'REST ou GraphQL', 'PostgreSQL', 'MongoDB', 'Supabase'],
  },
  {
    category: 'Outils & Déploiement',
    items: ['Git / GitHub', 'Vercel', 'ESLint / Prettier'],
  },
  {
    category: 'Performance & Accessibilité',
    items: ['Lighthouse / Web Vitals', 'SEO & bonnes pratiques', 'PWA'],
  },
];

export function TechStack() {

  return (
    <Section>
      <Container>
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-5xl">
            <span className="bg-gradient-to-r from-accent-blue to-purple-500 bg-clip-text text-transparent">
              Des outils modernes pour des résultats durables
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Nous utilisons des technologies modernes, reconnues pour leur stabilité et leur évolutivité — sans complexité inutile pour nos clients.
          </p>
        </ScrollReveal>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {technologies.map((tech, i) => (
            <ScrollReveal key={tech.category} delay={i * 0.1}>
              <div className="tech-category">
                <h3 className="text-sm font-bold uppercase tracking-wider text-accent-blue">
                  {tech.category}
                </h3>
                <ul className="mt-4 space-y-3">
                  {tech.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      <svg
                        className="h-4 w-4 shrink-0 text-accent-blue"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
