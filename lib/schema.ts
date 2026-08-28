import { OFFERS } from '@/content/offers'
import { LEGAL, DAY_RATE } from '@/lib/legal'

export const SITE = 'https://nmwstudios.com'

// Bumped by hand. A build date would claim "modified" on every deploy, including when not a
// single line of content has changed.
export const LAST_MODIFIED = '2026-08-28'

// What ties the domain to a real identity elsewhere on the web. While the list is empty,
// sameAs is left out: a dead profile is worth less than no profile at all.
const PROFILES: string[] = []

const STUDIO = `${SITE}/#studio`
const PERSON = `${SITE}/#nathan`
const SERVICE_OFFERING = `${SITE}/#prestation`

// The street address stays in the legal notice. Postcode and town are enough to place the
// business for a search engine, and they are what a service-area listing would carry anyway,
// where the street number is never shown.
const ADDRESS = {
  '@type': 'PostalAddress',
  postalCode: '33130',
  addressLocality: 'Bègles',
  addressRegion: 'Nouvelle-Aquitaine',
  addressCountry: 'FR',
}

const FRANCE = { '@type': 'Country', name: 'France' }

// Structured data only says what the site already shows: the business, the area, the contact
// and the single figure. Nothing that cannot be checked on the page or in the legal notice,
// otherwise Google eventually sees a contradiction and stops trusting the block.
export const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ProfessionalService',
      '@id': STUDIO,
      name: 'NMW Studios',
      legalName: LEGAL.legalName,
      url: SITE,
      logo: `${SITE}/logo.png`,
      image: `${SITE}/opengraph-image.jpg`,
      email: LEGAL.email,
      // `telephone`, et non `phone` : la seconde n'existe pas dans le vocabulaire, le numero
      // etait publie sans que personne ne le lise.
      telephone: LEGAL.phone,
      description:
        "Développeur web en sous-traitance pour les agences sans équipe technique. Renfort, projet complet, reprise et maintenance d'un existant, en marque blanche.",
      address: ADDRESS,
      areaServed: FRANCE,
      founder: { '@id': PERSON },
      employee: { '@id': PERSON },
      knowsLanguage: 'fr',
      priceRange: `${DAY_RATE} €`,
      ...(PROFILES.length ? { sameAs: PROFILES } : {}),
      // One rate, per day, the same for all three modes. That is what the page says.
      makesOffer: {
        '@type': 'Offer',
        name: 'Développement web en marque blanche',
        itemOffered: { '@id': SERVICE_OFFERING },
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: DAY_RATE,
          priceCurrency: 'EUR',
          unitText: 'jour',
          valueAddedTaxIncluded: false,
        },
      },
    },
    // The contractor is one person: they are who the reader judges, and who a search engine
    // needs to be able to tie to something other than this domain.
    {
      '@type': 'Person',
      '@id': PERSON,
      name: LEGAL.publisher,
      jobTitle: 'Développeur web',
      worksFor: { '@id': STUDIO },
      knowsAbout: ['Symfony', 'PHP', 'React', 'Next.js', 'WordPress', 'Reprise de code existant'],
      ...(PROFILES.length ? { sameAs: PROFILES } : {}),
    },
    {
      '@type': 'Service',
      '@id': SERVICE_OFFERING,
      name: 'Développement web en marque blanche',
      serviceType: 'Développement web en sous-traitance',
      provider: { '@id': STUDIO },
      areaServed: FRANCE,
      audience: { '@type': 'BusinessAudience', name: 'Agences web et de communication' },
      // Les trois modes d'engagement ont chacun leur page depuis la relance : le graphe les
      // rattache au meme service et au meme tarif, ce que trois pages isolees ne disent pas.
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Modes d’engagement',
        itemListElement: OFFERS.map((offer) => ({
          '@type': 'Offer',
          name: offer.title,
          url: offer.link ? `${SITE}${offer.link.href}` : SITE,
          itemOffered: { '@id': SERVICE_OFFERING },
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: DAY_RATE,
            priceCurrency: 'EUR',
            unitText: 'jour',
            valueAddedTaxIncluded: false,
          },
        })),
      },
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

// Injected by each service page: the layout graph describes the studio, not what this
// particular page sells.
export function schemaService({
  path,
  crumb,
  name,
  serviceType,
  description,
  catalog,
}: {
  path: string
  crumb: string
  name: string
  serviceType: string
  description: string
  catalog?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${SITE}${path}#service`,
        name: name,
        serviceType,
        url: `${SITE}${path}`,
        provider: { '@id': STUDIO },
        areaServed: FRANCE,
        audience: { '@type': 'BusinessAudience', name: 'Agences web et de communication' },
        description,
        ...(catalog
          ? {
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'Technologies reprises',
                itemListElement: catalog.map((item) => ({
                  '@type': 'Offer',
                  itemOffered: { '@type': 'Service', name: `Reprise ${item}` },
                })),
              },
            }
          : {}),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE}${path}#fil`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: crumb },
        ],
      },
    ],
  }
}
