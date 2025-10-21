'use client';

import { useEffect, useRef, useState } from 'react';
import { inView } from 'motion';

export function useCounter(target: number, duration: number = 2) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    const unsubscribe = inView(
      element,
      () => {
        // Éviter de relancer l'animation si elle a déjà été jouée
        if (hasAnimated.current) return;
        hasAnimated.current = true;

        // Animation manuelle avec requestAnimationFrame
        const startTime = performance.now();
        const startValue = 0;

        const animateCount = (currentTime: number) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / (duration * 1000), 1);

          // Easing function (ease-out cubic)
          const easedProgress = 1 - Math.pow(1 - progress, 3);

          const currentCount = Math.round(startValue + (target - startValue) * easedProgress);
          setCount(currentCount);

          if (progress < 1) {
            requestAnimationFrame(animateCount);
          }
        };

        requestAnimationFrame(animateCount);
      },
      { amount: 0.3 }
    );

    return () => unsubscribe();
  }, [target, duration]);

  return { count, ref };
}
