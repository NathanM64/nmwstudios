export const SITE_CONFIG = {
  name: 'NMW Studios',
  description: 'Studio web indépendant spécialisé dans le développement d\'applications web modernes et performantes.',
  url: 'https://nmwstudios.com',
  author: {
    name: 'Nathan',
    email: 'contact@nmwstudios.com',
  },
} as const;

export const NAV_LINKS = [
  { href: '/', label: 'Accueil' },
  { href: '/projets', label: 'Projets' },
  { href: '/services', label: 'Services' },
  { href: '/tarifs', label: 'Tarifs' },
  { href: '/a-propos', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
] as const;
