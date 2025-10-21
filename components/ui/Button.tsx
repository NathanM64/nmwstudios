'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  bounce?: boolean;
  disabled?: boolean;
}

export function Button({
  children,
  href,
  variant = 'primary',
  className,
  onClick,
  type = 'button',
  disabled = false,
}: ButtonProps) {

  const baseStyles = 'relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 group transition-transform duration-200 hover:scale-105';

  const variants = {
    primary: 'bg-gradient-to-r from-accent-blue to-blue-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 focus:ring-accent-blue before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-600 before:to-accent-blue before:opacity-0 hover:before:opacity-100 before:transition-opacity',
    secondary: 'bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg shadow-gray-900/30 hover:shadow-xl hover:shadow-gray-900/40 dark:from-white dark:to-gray-100 dark:text-black dark:shadow-white/20 dark:hover:shadow-white/30 focus:ring-gray-900',
    outline: 'border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black focus:ring-gray-900 shadow-lg shadow-gray-900/20 hover:shadow-xl hover:shadow-gray-900/30 dark:shadow-white/10 dark:hover:shadow-white/20',
  };

  const classes = cn(baseStyles, variants[variant], className);

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
      >
        <span className="relative z-10">{children}</span>
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(classes, disabled && 'opacity-50 cursor-not-allowed hover:scale-100')}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
}
