export type Offre = {
  slug: string
  titre: string
  paragraphes: readonly string[]
  appel: string
}

// La première offre s'affiche à /ce-que-je-fais, les autres à /ce-que-je-fais/<slug>.
export const OFFRES: readonly Offre[] = [
  {
    slug: 'sites',
    titre: 'Sites vitrines et landing pages',
    paragraphes: [
      "Un site sobre et rapide, que vous pouvez faire évoluer sans moi. Pas de constructeur de pages : du code que n'importe quel développeur peut reprendre.",
      "Un site vitrine simple, jusqu'à trois pages, démarre à 1 500 €. Un site sur mesure avec une direction graphique et des animations propres se chiffre après cadrage. Les montants sont indicatifs et s'ajustent selon le périmètre et les contenus.",
    ],
    appel: 'Parler de votre site',
  },
  {
    slug: 'applications',
    titre: 'Applications, SaaS et MVP',
    paragraphes: [
      'Une première version qui tourne, puis des itérations courtes. Backoffice, portail client, outil interne, produit à mettre devant ses premiers utilisateurs.',
      'Vous voyez des versions au fil du chantier, pas une livraison surprise à la fin.',
    ],
    appel: 'Parler de votre application',
  },
  {
    slug: 'reprise',
    titre: 'Reprise et maintenance',
    paragraphes: [
      "Je lis le code que d'autres ont écrit, je le remets en état de marche et je le fais vivre. Tout le marché vend du neuf ; reprendre l'existant coûte souvent moins cher et casse moins de choses.",
      'Trois conditions : le code source accessible en entier, un projet capable de redémarrer sur une machine neuve, un hébergement et un domaine transférables.',
      'Je ne reprends pas les sites montés sur un constructeur de pages : ça vous coûterait plus cher que de refaire.',
    ],
    appel: 'Parler de votre existant',
  },
  {
    slug: 'automatisation',
    titre: 'Automatisation et IA',
    paragraphes: [
      'Des tâches précises qui disparaissent de votre journée : classement automatique des demandes entrantes, extraction de données depuis des documents, relances et notifications, rédaction assistée dans un backoffice.',
      "On mesure avant et après. Si le gain n'est pas là, je vous le dis.",
    ],
    appel: 'Parler de vos tâches répétitives',
  },
  {
    slug: 'hebergement',
    titre: 'Hébergement et exploitation',
    paragraphes: [
      'Inclus : hébergement, nom de domaine, certificat TLS, sauvegardes quotidiennes, supervision de disponibilité, mises à jour de sécurité du serveur.',
      "Non inclus : toute modification de contenu ou de code, facturée à l'heure ou dans un forfait dédié.",
      'Transférable le jour où vous le décidez.',
    ],
    appel: 'Parler de votre hébergement',
  },
]

export const offreParSlug = (slug: string) => OFFRES.find((o) => o.slug === slug)

export const hrefOffre = (offre: Offre) =>
  offre === OFFRES[0] ? '/ce-que-je-fais' : `/ce-que-je-fais/${offre.slug}`
