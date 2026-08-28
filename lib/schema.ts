import { LEGAL, TJM } from '@/lib/legal'

export const SITE = 'https://nmwstudios.com'

// Bumpée à la main. Une date de build dirait « modifié » à chaque déploiement, y compris
// quand pas une ligne du contenu n'a changé.
export const MODIFIE_LE = '2026-08-28'

// Ce qui rattache le domaine à une identité réelle ailleurs sur le web. Tant que la liste
// est vide, sameAs est omis : un profil mort vaut moins que pas de profil du tout.
const PROFILS: string[] = []

const STUDIO = `${SITE}/#studio`
const PERSONNE = `${SITE}/#nathan`
const PRESTATION = `${SITE}/#prestation`

// L'adresse postale reste aux mentions légales. Le code postal et la commune suffisent à
// situer l'activité pour un moteur, et ce sont eux que reprendrait une fiche en zone de
// service, où le numéro de rue n'est jamais affiché.
const ADRESSE = {
  '@type': 'PostalAddress',
  postalCode: '33130',
  addressLocality: 'Bègles',
  addressRegion: 'Nouvelle-Aquitaine',
  addressCountry: 'FR',
}

const FRANCE = { '@type': 'Country', name: 'France' }

// Les données structurées ne disent que ce que le site affiche déjà : l'activité, la zone,
// le contact et le seul chiffre. Rien qui ne soit vérifiable sur la page ou dans les mentions
// légales, sinon Google finit par voir une contradiction et cesse de faire confiance au bloc.
export const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ProfessionalService',
      '@id': STUDIO,
      name: 'NMW Studios',
      legalName: LEGAL.denomination,
      url: SITE,
      logo: `${SITE}/logo.png`,
      image: `${SITE}/opengraph-image.jpg`,
      email: LEGAL.email,
      telephone: LEGAL.telephone,
      description:
        "Développeur web en sous-traitance pour les agences sans équipe technique. Renfort, projet complet, reprise et maintenance d'un existant, en marque blanche.",
      address: ADRESSE,
      areaServed: FRANCE,
      founder: { '@id': PERSONNE },
      employee: { '@id': PERSONNE },
      knowsLanguage: 'fr',
      ...(PROFILS.length ? { sameAs: PROFILS } : {}),
      // Un seul tarif, à la journée, identique pour les trois modes. C'est ce que dit la page.
      makesOffer: {
        '@type': 'Offer',
        name: 'Développement web en marque blanche',
        itemOffered: { '@id': PRESTATION },
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: TJM,
          priceCurrency: 'EUR',
          unitText: 'jour',
          valueAddedTaxIncluded: false,
        },
      },
    },
    // Le prestataire est une personne seule : c'est elle que le lecteur évalue, et c'est elle
    // qu'un moteur doit pouvoir relier à autre chose que ce domaine.
    {
      '@type': 'Person',
      '@id': PERSONNE,
      name: LEGAL.directeurPublication,
      jobTitle: 'Développeur web',
      worksFor: { '@id': STUDIO },
      knowsAbout: ['Symfony', 'PHP', 'React', 'Next.js', 'WordPress', 'Reprise de code existant'],
      ...(PROFILS.length ? { sameAs: PROFILS } : {}),
    },
    {
      '@type': 'Service',
      '@id': PRESTATION,
      name: 'Développement web en marque blanche',
      serviceType: 'Développement web en sous-traitance',
      provider: { '@id': STUDIO },
      areaServed: FRANCE,
      audience: { '@type': 'BusinessAudience', name: 'Agences web et de communication' },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE}/#site`,
      url: SITE,
      name: 'NMW Studios',
      inLanguage: 'fr-FR',
      publisher: { '@id': STUDIO },
    },
  ],
} as const

// Injecté par chaque page de service : le graphe du layout décrit le studio, pas ce que
// cette page-là vend.
export function schemaService({
  chemin,
  fil,
  nom,
  serviceType,
  description,
  catalogue,
}: {
  chemin: string
  fil: string
  nom: string
  serviceType: string
  description: string
  catalogue?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${SITE}${chemin}#service`,
        name: nom,
        serviceType,
        url: `${SITE}${chemin}`,
        provider: { '@id': STUDIO },
        areaServed: FRANCE,
        audience: { '@type': 'BusinessAudience', name: 'Agences web et de communication' },
        description,
        ...(catalogue
          ? {
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'Technologies reprises',
                itemListElement: catalogue.map((item) => ({
                  '@type': 'Offer',
                  itemOffered: { '@type': 'Service', name: `Reprise ${item}` },
                })),
              },
            }
          : {}),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE}${chemin}#fil`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: fil },
        ],
      },
    ],
  }
}
