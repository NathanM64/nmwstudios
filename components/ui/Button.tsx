'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useRef } from 'react';
import { animate } from 'motion';

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  bounce?: boolean;
}

export function Button({
  children,
  href,
  variant = 'primary',
  className,
  onClick,
  type = 'button',
  bounce = false,
}: ButtonProps) {
  const buttonRef = useRef<HTMLAnchorElement | HTMLButtonElement>(null);

  const handleHover = () => {
    if (!buttonRef.current) return;

    if (bounce) {
      // Animation bounce très subtile - un seul rebond
      animate(
        buttonRef.current,
        {
          y: [0, -2, 0],
          scale: [1, 1.02, 1]
        },
        { duration: 0.4, easing: [0.34, 1.56, 0.64, 1] }
      );
    } else {
      // Animation standard
      animate(
        buttonRef.current,
        { scale: 1.05, y: -2 },
        { duration: 0.2, easing: [0.22, 1, 0.36, 1] }
      );
    }
  };

  const handleHoverEnd = () => {
    if (!buttonRef.current) return;
    if (!bounce) {
      animate(
        buttonRef.current,
        { scale: 1, y: 0 },
        { duration: 0.2, easing: [0.22, 1, 0.36, 1] }
      );
    }
  };

  const baseStyles = 'relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 group';

  const variants = {
    primary: 'bg-gradient-to-r from-accent-blue to-blue-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 focus:ring-accent-blue before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-600 before:to-accent-blue before:opacity-0 hover:before:opacity-100 before:transition-opacity',
    secondary: 'bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg shadow-gray-900/30 hover:shadow-xl hover:shadow-gray-900/40 dark:from-white dark:to-gray-100 dark:text-black dark:shadow-white/20 dark:hover:shadow-white/30 focus:ring-gray-900',
    outline: 'border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black focus:ring-gray-900 shadow-lg shadow-gray-900/20 hover:shadow-xl hover:shadow-gray-900/30 dark:shadow-white/10 dark:hover:shadow-white/20',
  };

  const classes = cn(baseStyles, variants[variant], className);

  if (href) {
    return (
      <Link
        ref={buttonRef as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={classes}
        onMouseEnter={handleHover}
        onMouseLeave={handleHoverEnd}
      >
        <span className="relative z-10">{children}</span>
      </Link>
    );
  }

  return (
    <button
      ref={buttonRef as React.RefObject<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      className={classes}
      onMouseEnter={handleHover}
      onMouseLeave={handleHoverEnd}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
}
