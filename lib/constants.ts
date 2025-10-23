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
    description: 'Plateforme IA moderne pour transformer vos données en insights actionnables. Landing page tech avec animations Motion One et design system custom.',
    category: 'Landing Page',
    tags: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'Motion One', 'nmw-site-starter'],
    image: '/projects/nexus-ai-desktop.png',
    imageMobile: '/projects/nexus-ai-mobile.png',
    liveUrl: 'https://nexus-ai.nmwstudios.com',
    githubUrl: 'https://github.com/NathanM64/nexus-ai',
    year: '2025',
    client: 'Projet démo',
    objective: 'Démontrer la customisation complète du boilerplate nmw-site-starter avec une identité visuelle tech moderne (Indigo/Violet/Rose).',
    result: 'Landing page complète avec 7 sections, animations au scroll, et intégration d\'icônes Lucide dynamiques.',
    highlights: [
      'Animations Motion One avec scroll reveals',
      'Système d\'icônes Lucide dynamique',
      'Palette tech moderne (Indigo/Violet/Rose)',
      '7 sections optimisées (Hero, Features, Pricing, etc.)',
      'Dark mode avec next-themes',
      'SEO et performance optimisés'
    ]
  },
  {
    slug: 'atelier-bois',
    title: 'Atelier Bois',
    description: 'Site vitrine artisanal pour un atelier de menuiserie. Design chaleureux avec typographie serif et palette naturelle.',
    category: 'Site Vitrine',
    tags: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'Merriweather', 'nmw-site-starter'],
    image: '/projects/atelier-bois-desktop.png',
    imageMobile: '/projects/atelier-bois-mobile.png',
    liveUrl: 'https://atelier-bois.nmwstudios.com',
    githubUrl: 'https://github.com/NathanM64/atelier-bois',
    year: '2025',
    client: 'Projet démo',
    objective: 'Créer une identité artisanale authentique, complètement différente de Nexus AI, pour démontrer la flexibilité du boilerplate.',
    result: 'Landing page one-page avec navigation par anchors, 8 sections, et identité visuelle chaleureuse.',
    highlights: [
      'Identité artisanale (Marron/Crème/Vert forêt)',
      'Typographie serif (Merriweather + Inter)',
      'Navigation smooth scroll avec anchors',
      '8 sections complètes (Hero, Services, Projects, etc.)',
      'Animations subtiles avec Motion One',
      'Galerie de projets avec badges catégories'
    ]
  },
  {
    slug: 'taskflow',
    title: 'TaskFlow',
    description: 'Dashboard SaaS moderne pour la gestion de tâches. CRUD complet avec visualisation de données et command palette.',
    category: 'Dashboard SaaS',
    tags: ['Next.js 15', 'TypeScript', 'Zustand', 'Recharts', 'nmw-app-starter'],
    image: '/projects/taskflow-desktop.png',
    imageMobile: '/projects/taskflow-mobile.png',
    liveUrl: 'https://taskflow.nmwstudios.com',
    githubUrl: 'https://github.com/NathanM64/taskflow',
    year: '2025',
    client: 'Projet démo',
    objective: 'Démontrer les capacités dashboard/CRUD du boilerplate nmw-app-starter avec une application SaaS complète.',
    result: 'Dashboard fonctionnel avec CRUD, graphiques, command palette, et persistance localStorage.',
    highlights: [
      'CRUD complet (Create, Read, Update, Delete)',
      'Graphiques Recharts (statut, priorité)',
      'Command Palette (Ctrl+K) avec navigation clavier',
      'State management Zustand + localStorage',
      '5 options de tri (date, priorité, statut, nom, échéance)',
      'Dark mode avec persistance'
    ]
  }
] as const;
