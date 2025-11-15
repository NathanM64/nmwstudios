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
  { href: '/notre-outil', label: 'Notre outil' },
  { href: '/services', label: 'Services' },
  { href: '/tarifs', label: 'Tarifs' },
  { href: '/a-propos', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
] as const;

export const PROJECTS = [
  {
    slug: 'nmw-dashboard',
    title: 'NMW Dashboard',
    description: 'Dashboard professionnel multi-tenant pour la gestion d\'activité freelance. Gestion clients, devis, factures, projets avec génération PDF, envoi d\'emails automatiques et analytics avancés.',
    category: 'SaaS Multi-Tenant',
    tags: ['Next.js 15', 'TypeScript', 'Prisma', 'Supabase', 'NextAuth', 'React-PDF'],
    image: '/projects/nmw-dashboard-desktop.png',
    imageMobile: '/projects/nmw-dashboard-mobile.png',
    liveUrl: 'https://app.nmwstudios.com',
    githubUrl: null,
    year: '2024',
    client: 'NMW Studios (Usage interne)',
    objective: 'Créer un outil de gestion complet et moderne pour remplacer les solutions existantes trop chères ou obsolètes, et démontrer la capacité du studio à construire des SaaS production-ready.',
    result: 'Un dashboard multi-tenant complet utilisé quotidiennement en production pour gérer l\'activité de l\'agence. 6 modules fonctionnels, système de permissions avancé, espace client dédié, et notifications automatisées.',
    highlights: [
      'Gestion clients avec recherche instantanée et historique',
      'Devis & Factures avec génération PDF et envoi email',
      'Dashboard analytics avec comparaison N vs N-1',
      'Command Palette (⌘K) pour navigation rapide',
      'Notifications automatiques (relances, rappels)',
      'Architecture multi-tenant avec isolation des données',
      'Espace client pour consultation et signature',
      'Système de permissions RBAC dynamique'
    ]
  },
  {
    slug: 'nexus-ai',
    title: 'Nexus AI',
    description: 'Création d\'une landing page moderne pour une plateforme d\'analyse d\'insights propulsée par l\'IA. Un design fluide et technologique, animé au scroll, qui met en valeur le produit dès le premier regard.',
    category: 'Landing Page SaaS',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Motion One'],
    image: '/projects/nexus-ai-desktop.png',
    imageMobile: '/projects/nexus-ai-mobile.png',
    liveUrl: 'https://nexus-ai.nmwstudios.com',
    githubUrl: 'https://github.com/NathanM64/nexus-ai',
    year: '2025',
    client: 'Landing Page SaaS',
    objective: 'Montrer la capacité du studio à concevoir des interfaces SaaS dynamiques et performantes avec une identité visuelle forte.',
    result: 'Une landing page complète et animée, optimisée pour la performance et le SEO, illustrant la maîtrise du design moderne et de l\'animation web.',
    highlights: [
      'Animations fluides au scroll avec Motion One',
      'Identité visuelle tech moderne (palette Indigo/Violet/Rose)',
      '7 sections stratégiques (Hero, Features, Pricing, Testimonials)',
      'Dark mode intégré et persistant',
      'Performance optimale (Lighthouse 95+)',
      'Architecture évolutive et maintenable'
    ]
  },
  {
    slug: 'atelier-bois',
    title: 'Atelier Bois',
    description: 'Création d\'un site vitrine chaleureux pour un atelier de menuiserie. Design authentique, typographie artisanale et palette naturelle pour une identité forte et humaine.',
    category: 'Site Vitrine',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Merriweather'],
    image: '/projects/atelier-bois-desktop.png',
    imageMobile: '/projects/atelier-bois-mobile.png',
    liveUrl: 'https://atelier-bois.nmwstudios.com',
    githubUrl: 'https://github.com/NathanM64/atelier-bois',
    year: '2025',
    client: 'Site Vitrine Artisanal',
    objective: 'Illustrer la capacité du studio à concevoir des sites sur mesure alignés sur les valeurs et l\'univers d\'une marque.',
    result: 'Un site fluide et immersif, combinant élégance et simplicité, pensé pour inspirer confiance et refléter un savoir-faire artisanal.',
    highlights: [
      'Identité artisanale chaleureuse (palette Marron/Crème/Vert)',
      'Typographie serif soignée pour authenticité',
      'Navigation fluide et intuitive',
      '8 sections complètes du storytelling au contact',
      'Animations subtiles et naturelles',
      'Galerie de réalisations avec catégories'
    ]
  },
  {
    slug: 'taskflow',
    title: 'TaskFlow',
    description: 'Développement d\'un tableau de bord complet pour la gestion de tâches et d\'équipes. Design sobre et efficace, interactions rapides et visualisation de données en temps réel.',
    category: 'Dashboard SaaS',
    tags: ['Next.js', 'TypeScript', 'Zustand', 'Recharts'],
    image: '/projects/taskflow-desktop.png',
    imageMobile: '/projects/taskflow-mobile.png',
    liveUrl: 'https://taskflow.nmwstudios.com',
    githubUrl: 'https://github.com/NathanM64/taskflow',
    year: '2025',
    client: 'Dashboard SaaS',
    objective: 'Démontrer la capacité du studio à concevoir des outils web puissants et intuitifs adaptés aux besoins des entreprises.',
    result: 'Une application SaaS fluide et ergonomique : CRUD complet, tableaux dynamiques, graphiques interactifs et navigation rapide via palette de commandes.',
    highlights: [
      'Interface intuitive avec gestion complète des tâches',
      'Graphiques interactifs pour suivi visuel',
      'Palette de commandes rapide (Ctrl+K)',
      'Persistance des données et préférences',
      'Tri et filtrage avancés',
      'Dark mode intégré'
    ]
  }
] as const;
