# NMW Studios - Portfolio

Portfolio professionnel développeur web freelance.

## Stack Technique

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Motion One
- **Deployment**: Vercel

## Développement

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build production
npm run build

# Lancer en production
npm start
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000).

## Structure du Projet

```
portfolio/
├── app/                    # Pages Next.js (App Router)
├── components/
│   ├── layout/            # Header, Footer, ThemeToggle
│   ├── ui/                # Composants UI réutilisables
│   ├── home/              # Composants spécifiques homepage
│   ├── projets/           # Composants projets
│   └── contact/           # Formulaire contact
├── lib/                   # Utilitaires et constantes
├── content/projets/       # Case studies Markdown
└── public/                # Assets statiques
```

## Features

- Dark mode persistant (localStorage)
- Responsive mobile-first
- Accessibilité WCAG AA
- SEO optimisé
- Performance Lighthouse 90+

## Design System

Voir `/PROJECT.md` à la racine pour les specs complètes du design system.
