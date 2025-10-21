'use client';

import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

const steps = [
  {
    number: '01',
    title: 'Découverte & Stratégie',
    description: 'Analyse de vos besoins, de vos objectifs et de votre cible. Définition d\'une stratégie technique sur mesure.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Conception & Design',
    description: 'Maquettes interactives, design system et prototypes validés ensemble avant développement.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Développement Agile',
    description: 'Code moderne, tests rigoureux et livraison progressive avec feedback continu.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Déploiement & Suivi',
    description: 'Mise en production optimisée, formation et accompagnement post-lancement.',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
];

export function Process() {

  return (
    <Section>
      <Container>
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-5xl">
            Une approche{' '}
            <span className="bg-gradient-to-r from-accent-blue to-purple-500 bg-clip-text text-transparent">
              claire et professionnelle
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Je privilégie une approche structurée et réaliste. Chaque projet est conçu pour être fiable, maintenable et performant, tout en restant simple à utiliser.
          </p>
        </ScrollReveal>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <ScrollReveal key={step.number} delay={index * 0.1}>
              <div className="process-step group relative">
              {/* Connector line (hidden on mobile) */}
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-12 hidden h-px w-full bg-gradient-to-r from-accent-blue/50 to-transparent lg:block" />
              )}

              <div className="relative">
                {/* Number badge */}
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-blue/10 text-xl font-bold text-accent-blue ring-4 ring-white dark:ring-black">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-white text-accent-blue shadow-sm dark:bg-gray-900">
                  {step.icon}
                </div>

                {/* Content */}
                <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </Container>
    </Section>
  );
}
