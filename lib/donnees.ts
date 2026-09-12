import { OFFRES, hrefOffre } from '@/content/offres'

const SITE = 'https://nmwstudios.com'
const ID = `${SITE}/#organisation`
const FRANCE = { '@type': 'Country', name: 'France' }

// Ce que Google lit : la même chose que le lecteur, ni plus ni moins. Un seul prix, celui du site vitrine.
export const DONNEES = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': ID,
  name: 'NMW Studios',
  url: `${SITE}/`,
  email: 'contact@nmwstudios.com',
  description:
    'Sites, applications et outils métier. Je construis, je reprends l’existant, et j’assure la suite si vous le souhaitez.',
  foundingDate: '2025',
  founder: { '@type': 'Person', name: 'Nathan Marimbordes', jobTitle: 'Développeur web indépendant' },
  address: { '@type': 'PostalAddress', addressLocality: 'Bègles', postalCode: '33130', addressCountry: 'FR' },
  areaServed: FRANCE,
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Prestations',
    itemListElement: OFFRES.map((o) => ({
      '@type': 'Offer',
      url: `${SITE}${hrefOffre(o)}/`,
      ...(o.slug === 'sites'
        ? { priceSpecification: { '@type': 'UnitPriceSpecification', priceCurrency: 'EUR', minPrice: 1500 } }
        : {}),
      itemOffered: {
        '@type': 'Service',
        name: o.titre,
        description: o.resume,
        url: `${SITE}${hrefOffre(o)}/`,
        provider: { '@id': ID },
        areaServed: FRANCE,
      },
    })),
  },
}

// Le fil d'Ariane d'une sous-route : la page courante n'a pas de lien, comme le veut Google.
export const filAriane = (etapes: readonly [string, string | null][]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: etapes.map(([name, chemin], i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name,
    ...(chemin ? { item: `${SITE}${chemin}` } : {}),
  })),
})
