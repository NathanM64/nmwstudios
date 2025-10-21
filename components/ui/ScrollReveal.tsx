'use client';

import { useEffect, useRef } from 'react';
import { inView, animate } from 'motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollReveal({ children, className, delay = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    const unsubscribe = inView(
      element,
      () => {
        animate(
          element,
          { opacity: [0, 1], y: [40, 0] },
          { duration: 0.6, delay, easing: [0.22, 1, 0.36, 1] }
        );
      },
      { amount: 0.3 }
    );

    return () => unsubscribe();
  }, [delay]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
