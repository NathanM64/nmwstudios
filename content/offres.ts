// Un bloc est un paragraphe, ou une liste.
export type Bloc = string | readonly string[]

export type Offre = {
  slug: string
  titre: string
  resume: string
  meta: string
  prix?: string
  blocs: readonly Bloc[]
  vues?: { legende: string; liste: readonly { src: string; alt: string; titre: string }[] }
  appel: string
}

// La première offre s'affiche à /ce-que-je-fais, les autres à /ce-que-je-fais/<slug>.
// Les applications ouvrent : c'est la carte qui montre quelque chose.
export const OFFRES: readonly Offre[] = [
  {
    slug: 'applications',
    titre: 'Une application, un outil interne, un premier produit',
    resume: 'Une première version qui tourne, puis des itérations courtes.',
    meta: 'Une première version qui tourne, puis des versions courtes et régulières : outil interne, espace client, premier produit. Vous voyez le chantier avancer.',
    blocs: [
      'Une première version qui tourne, puis des versions courtes et régulières : outil interne, espace client, premier produit. Vous voyez le chantier avancer, pas une livraison surprise.',
    ],
    vues: {
      legende: 'Mon outil, construit pour moi. Données de démonstration.',
      liste: [
        { src: '/demo/temps.webp', alt: 'Le suivi du temps, une semaine en calendrier', titre: 'Temps' },
        { src: '/demo/compta.webp', alt: 'La comptabilité de la micro-entreprise : chiffre d’affaires, charges, plafond', titre: 'Comptabilité' },
        { src: '/demo/facture.webp', alt: 'Une facture générée depuis le temps passé', titre: 'Facture' },
      ],
    },
    appel: 'Parler de votre application',
  },
  {
    slug: 'reprise',
    titre: 'Reprendre votre site ou votre application',
    resume: 'Du code que d’autres ont écrit, remis en marche et tenu.',
    meta: 'Je lis le code que d’autres ont écrit, je le remets en état de marche et je le fais vivre. Facturé au temps passé, au taux annoncé avant de commencer.',
    blocs: [
      'Je lis le code que d’autres ont écrit, je le remets en état de marche et je le fais vivre. Une reprise se facture au temps passé, au taux annoncé avant de commencer.',
      'Envoyez-moi l’adresse de votre site. Si vous ne savez pas comment il a été fait, l’adresse suffit, je vous le dis. Les accès viennent après qu’on se soit parlé, en lecture seule quand c’est possible, et je n’en conserve aucun. Je vous écris ce qui tient, ce qui casse, ce que je ferais en premier. Le devis vient après.',
      'Trois choses que je vérifie d’abord :',
      [
        'Le code source, accessible en entier',
        'Un projet qui redémarre sur une machine neuve',
        'Un hébergement et un domaine transférables',
      ],
      'Je ne reprends pas les sites sans code source, montés sur Wix, Squarespace ou un éditeur équivalent : ça vous coûterait plus cher que de refaire.',
    ],
    appel: 'Parler de votre existant',
  },
  {
    slug: 'sites',
    titre: 'Un site vitrine ou une page de campagne',
    resume: 'Sobre et rapide, que vous pouvez faire évoluer sans moi.',
    meta: 'Un site rapide, que vous pouvez faire évoluer sans moi, sans constructeur de pages. À partir de 1 500 €, jusqu’à trois pages, vos maquettes ou les miennes si vous n’en avez pas.',
    prix: 'À partir de 1 500 €, jusqu’à trois pages.',
    blocs: [
      'Un site rapide, que vous pouvez faire évoluer sans moi. Pas de constructeur de pages : du code qu’un autre développeur peut reprendre. Vos maquettes, intégrées telles quelles, sous votre nom ; les miennes seulement si vous n’en avez pas.',
      'Un site sur mesure, avec une direction graphique et des animations propres, se chiffre après cadrage. Les montants sont indicatifs et s’ajustent selon le périmètre et les contenus.',
    ],
    appel: 'Parler de votre site',
  },
  {
    slug: 'automatisation',
    titre: 'Faire disparaître une tâche répétitive',
    resume: 'Ce que votre équipe refait chaque jour à la main.',
    meta: 'Classement des demandes entrantes, extraction de données depuis des documents, relances et rédaction assistée dans un backoffice. Je mesure avant et après.',
    blocs: [
      'Des tâches précises qui disparaissent de votre journée : classement automatique des demandes entrantes, extraction de données depuis des documents, relances et notifications, rédaction assistée dans un backoffice.',
      'On mesure avant et après. Si le gain n’est pas là, je vous le dis.',
    ],
    appel: 'Parler de vos tâches répétitives',
  },
  {
    slug: 'hebergement',
    titre: 'Héberger et surveiller votre site',
    resume: 'Hébergement, domaine, sauvegardes, alerte si le site tombe. Transférable.',
    meta: 'Hébergement, nom de domaine, certificat de sécurité, sauvegarde chaque nuit, alerte si le site ne répond plus. Transférable le jour où vous le décidez.',
    blocs: [
      'Inclus : l’hébergement, le nom de domaine, le certificat de sécurité, une sauvegarde chaque nuit, une alerte si le site ne répond plus, les mises à jour de sécurité du serveur.',
      'Non inclus : toute modification de contenu ou de code, facturée à l’heure ou dans un forfait dédié.',
      'Transférable le jour où vous le décidez.',
    ],
    appel: 'Parler de votre hébergement',
  },
]

export const offreParSlug = (slug: string) => OFFRES.find((o) => o.slug === slug)

export const hrefOffre = (offre: Offre) =>
  offre === OFFRES[0] ? '/ce-que-je-fais' : `/ce-que-je-fais/${offre.slug}`
