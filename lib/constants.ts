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

export const PROJECTS = [
  {
    slug: 'nexus-ai',
    title: 'Nexus AI',
    description: 'Concept fictif — création d\'une landing page SaaS pour une plateforme de génération d\'insights par IA. Design tech moderne avec animations fluides et système d\'icônes dynamique.',
    category: 'Landing Page SaaS',
    tags: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'Motion One', 'nmw-site-starter'],
    image: '/projects/nexus-ai-desktop.png',
    imageMobile: '/projects/nexus-ai-mobile.png',
    liveUrl: 'https://nexus-ai.nmwstudios.com',
    githubUrl: 'https://github.com/NathanM64/nexus-ai',
    year: '2025',
    client: 'Projet concept créé pour démontrer mes compétences en design system et développement Next.js',
    objective: 'Démontrer la customisation complète du boilerplate nmw-site-starter avec une identité visuelle tech moderne (palette Indigo/Violet/Rose) et des animations avancées.',
    result: 'Landing page complète avec 7 sections optimisées, animations au scroll via Motion One, système d\'icônes Lucide dynamiques, et architecture scalable.',
    highlights: [
      'Animations Motion One avec scroll reveals et stagger',
      'Système d\'icônes Lucide chargées dynamiquement',
      'Palette tech moderne (Indigo/Violet/Rose)',
      '7 sections optimisées (Hero, Features, Pricing, Testimonials, etc.)',
      'Dark mode avec next-themes et persistance',
      'Performance et SEO optimisés (scores Lighthouse 95+)'
    ]
  },
  {
    slug: 'atelier-bois',
    title: 'Atelier Bois',
    description: 'Concept fictif — création d\'un site vitrine pour un atelier artisanal de menuiserie. Design chaleureux avec typographie serif, palette naturelle et identité authentique.',
    category: 'Site Vitrine',
    tags: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'Merriweather', 'nmw-site-starter'],
    image: '/projects/atelier-bois-desktop.png',
    imageMobile: '/projects/atelier-bois-mobile.png',
    liveUrl: 'https://atelier-bois.nmwstudios.com',
    githubUrl: 'https://github.com/NathanM64/atelier-bois',
    year: '2025',
    client: 'Projet concept créé pour démontrer la flexibilité de customisation du boilerplate',
    objective: 'Créer une identité artisanale authentique et chaleureuse, radicalement différente de Nexus AI, pour illustrer la versatilité du boilerplate nmw-site-starter.',
    result: 'Landing page one-page avec navigation smooth scroll, 8 sections complètes, identité visuelle cohérente (marron/crème/vert forêt), et galerie de réalisations.',
    highlights: [
      'Identité artisanale complète (Marron/Crème/Vert forêt)',
      'Typographie serif (Merriweather) + sans-serif (Inter)',
      'Navigation fluide par anchors avec smooth scroll',
      '8 sections (Hero, Services, Projects, Testimonials, Contact, etc.)',
      'Animations subtiles et naturelles avec Motion One',
      'Galerie de projets avec catégories et badges'
    ]
  },
  {
    slug: 'taskflow',
    title: 'TaskFlow',
    description: 'Concept fictif — création d\'un dashboard SaaS de gestion de tâches. CRUD complet, visualisation de données avec Recharts, et command palette pour navigation rapide.',
    category: 'Dashboard SaaS',
    tags: ['Next.js 15', 'TypeScript', 'Zustand', 'Recharts', 'nmw-app-starter'],
    image: '/projects/taskflow-desktop.png',
    imageMobile: '/projects/taskflow-mobile.png',
    liveUrl: 'https://taskflow.nmwstudios.com',
    githubUrl: 'https://github.com/NathanM64/taskflow',
    year: '2025',
    client: 'Projet concept créé pour démontrer mes compétences en développement d\'applications SaaS',
    objective: 'Démontrer les capacités dashboard/CRUD du boilerplate nmw-app-starter : gestion d\'état, persistance, visualisation de données, et UX moderne.',
    result: 'Dashboard SaaS fonctionnel avec CRUD complet, graphiques interactifs Recharts, command palette (Ctrl+K), state management Zustand, et persistance localStorage.',
    highlights: [
      'CRUD complet avec modal de création/édition',
      'Graphiques Recharts interactifs (statut, priorité)',
      'Command Palette (Ctrl+K) avec navigation clavier optimisée',
      'State management Zustand + persistance localStorage',
      '5 options de tri (date, priorité, statut, nom, échéance)',
      'Dark mode avec persistance des préférences utilisateur'
    ]
  }
] as const;
