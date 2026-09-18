import { avecBarre, hrefOffre } from '@/content'
import type { Dictionnaire } from '@/content/types'
import { SITE } from './meta'

const ID = `${SITE}/#organisation`
const FRANCE = { '@type': 'Country', name: 'France' }

// Ce que Google lit : la même chose que le lecteur, ni plus ni moins. Un seul prix, celui du site vitrine.
// La zone servie reste la France côté français ; l'anglais s'adresse à tout le monde.
export const donnees = (t: Dictionnaire) => ({
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': ID,
  name: 'NMW Studios',
  url: `${SITE}${avecBarre(t.routes.accueil)}`,
  inLanguage: t.langue,
  email: 'contact@nmwstudios.com',
  logo: `${SITE}/icon-512.png`,
  image: `${SITE}/opengraph-image.jpg`,
  description: t.donnees.description,
  foundingDate: '2025',
  founder: { '@type': 'Person', name: 'Nathan Marimbordes', jobTitle: t.donnees.jobTitle },
  address: { '@type': 'PostalAddress', addressLocality: 'Bègles', postalCode: '33130', addressCountry: 'FR' },
  ...(t.langue === 'fr' ? { areaServed: FRANCE } : {}),
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: t.donnees.catalogue,
    itemListElement: t.offres.liste.map((o) => ({
      '@type': 'Offer',
      url: `${SITE}${avecBarre(hrefOffre(t, o))}`,
      ...(o.cle === 'sites' ? { priceSpecification: { '@type': 'UnitPriceSpecification', priceCurrency: 'EUR', minPrice: 1500 } } : {}),
      itemOffered: {
        '@type': 'Service',
        name: o.titre,
        description: o.resume,
        url: `${SITE}${avecBarre(hrefOffre(t, o))}`,
        provider: { '@id': ID },
        ...(t.langue === 'fr' ? { areaServed: FRANCE } : {}),
      },
    })),
  },
})

// Le fil d'Ariane d'une sous-route : la page courante n'a pas de lien, comme le veut Google.
export const filAriane = (etapes: readonly [string, string | null][]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: etapes.map(([name, chemin], i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name,
    ...(chemin ? { item: `${SITE}${avecBarre(chemin)}` } : {}),
  })),
})
