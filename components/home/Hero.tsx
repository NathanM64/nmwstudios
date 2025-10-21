'use client';

import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { useEffect, useRef } from 'react';
import { animate, stagger } from 'motion';
import { useCounter } from '@/hooks/useCounter';

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { count: lighthouseScore, ref: lighthouseRef } = useCounter(95, 1.5);
  const { count: typescriptPercent, ref: typescriptRef } = useCounter(100, 1.5);
  const { count: yearsExperience, ref: yearsRef } = useCounter(5, 1.2);

  useEffect(() => {
    if (!heroRef.current) return;

    // Séquence d'intro coordonnée
    const animateSequence = async () => {
      await animate('.hero-badge', { opacity: [0, 1], y: [-20, 0] }, { duration: 0.5 });
      await animate('.hero-title', { opacity: [0, 1], y: [20, 0] }, { duration: 0.6 });
      await animate('.hero-description', { opacity: [0, 1], y: [20, 0] }, { duration: 0.6 });
      await animate('.hero-buttons', { opacity: [0, 1], scale: [0.9, 1] }, { duration: 0.5 });
      // Animer les stats SANS opacity pour que le counter soit visible dès le départ
      animate('.hero-stat', { y: [20, 0] }, { duration: 0.4, delay: stagger(0.1) });
    };

    animateSequence();
  }, []);

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center py-16 md:py-24">
      <Container>
        <div ref={heroRef} className="mx-auto max-w-4xl">
          <div className="hero-badge inline-block rounded-full border border-accent-blue/20 bg-accent-blue/5 px-4 py-1.5 text-sm font-medium text-accent-blue dark:border-accent-blue/30 dark:bg-accent-blue/10" style={{ opacity: 0 }}>
            Studio web indépendant
          </div>

          <h1 className="hero-title mt-8 text-4xl font-bold tracking-tight text-gray-900 dark:text-white md:text-6xl lg:text-7xl" style={{ opacity: 0 }}>
            Développement web moderne
            <br />
            <span className="bg-gradient-to-r from-accent-blue via-purple-500 to-accent-blue bg-clip-text text-transparent">
              et sur mesure
            </span>
          </h1>

          <p className="hero-description mt-6 text-lg text-gray-600 dark:text-gray-400 md:text-xl" style={{ opacity: 0 }}>
            Studio web indépendant spécialisé dans la création d&apos;applications web{' '}
            <span className="font-semibold text-gray-900 dark:text-white">
              performantes, modernes et évolutives
            </span>
            . De la création de sites vitrines au développement de MVP rapides,
            je transforme vos idées en produits digitaux fiables et maintenables.
          </p>

          <div className="hero-buttons mt-10 flex flex-col gap-4 sm:flex-row" style={{ opacity: 0 }}>
            <Button href="/contact" variant="primary" className="text-base" bounce>
              Demander un devis gratuit
            </Button>
            <Button href="/projets" variant="outline" className="text-base" bounce>
              Voir mes réalisations
            </Button>
          </div>

          {/* Stats / Trust signals */}
          <div className="mt-16 grid grid-cols-3 gap-8 border-t border-gray-200 pt-8 dark:border-gray-800">
            <div ref={lighthouseRef} className="hero-stat">
              <div className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
                {lighthouseScore}+
              </div>
              <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Score Lighthouse
              </div>
            </div>
            <div ref={typescriptRef} className="hero-stat">
              <div className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
                {typescriptPercent}%
              </div>
              <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                TypeScript
              </div>
            </div>
            <div ref={yearsRef} className="hero-stat">
              <div className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
                {yearsExperience} ans
              </div>
              <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                d&apos;expérience
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
