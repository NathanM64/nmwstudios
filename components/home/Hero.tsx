'use client';

import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { useEffect, useRef } from 'react';
import { animate, stagger } from 'motion';

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    // Séquence d'intro coordonnée
    const animateSequence = async () => {
      await animate('.hero-badge', { opacity: [0, 1], y: [-20, 0] }, { duration: 0.5 });
      await animate('.hero-title', { opacity: [0, 1], y: [20, 0] }, { duration: 0.6 });
      await animate('.hero-description', { opacity: [0, 1], y: [20, 0] }, { duration: 0.6 });
      await animate('.hero-buttons', { opacity: [0, 1], scale: [0.9, 1] }, { duration: 0.5 });
      animate('.hero-stat', { opacity: [0, 1], y: [20, 0] }, { duration: 0.4, delay: stagger(0.1) });
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

          <div className="hero-description mt-6 space-y-4 text-lg text-gray-600 dark:text-gray-400 md:text-xl" style={{ opacity: 0 }}>
            <p>
              NMW Studios conçoit des applications web professionnelles alliant design, performance et fiabilité technique. Nous accompagnons les entreprises et indépendants dans le développement de leur présence digitale, du site vitrine au produit web complet.
            </p>
            <p className="text-base md:text-lg">
              Plus qu&apos;un simple développement, chaque projet est conçu comme une collaboration claire et humaine, du concept à la mise en ligne.
            </p>
          </div>

          <div className="hero-buttons mt-10 flex flex-col gap-4 sm:flex-row" style={{ opacity: 0 }}>
            <Button href="/contact" variant="primary" className="text-base" bounce>
              Demander un devis gratuit
            </Button>
            <Button href="/projets" variant="outline" className="text-base" bounce>
              Voir nos réalisations
            </Button>
          </div>

          {/* Stats / Trust signals */}
          <div className="mt-16 grid grid-cols-1 gap-6 border-t border-gray-200 pt-8 dark:border-gray-800 sm:grid-cols-3">
            <div className="hero-stat flex items-start gap-3" style={{ opacity: 0 }}>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-blue/10 text-accent-blue">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  Performance & SEO intégrés dès la conception
                </div>
              </div>
            </div>

            <div className="hero-stat flex items-start gap-3" style={{ opacity: 0 }}>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-blue/10 text-accent-blue">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  Accompagnement clair et humain
                </div>
              </div>
            </div>

            <div className="hero-stat flex items-start gap-3" style={{ opacity: 0 }}>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-blue/10 text-accent-blue">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  Conception 100% sur mesure
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
