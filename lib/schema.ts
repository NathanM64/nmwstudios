import { LEGAL, TJM } from '@/lib/legal'

export const SITE = 'https://nmwstudios.com'

// Les données structurées ne disent que ce que le site affiche déjà : l'activité, la zone,
// le contact et le seul chiffre. Rien qui ne soit vérifiable sur la page ou dans les mentions
// légales, sinon Google finit par voir une contradiction et cesse de faire confiance au bloc.
export const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${SITE}/#studio`,
  name: 'NMW Studios',
  legalName: LEGAL.denomination,
  url: SITE,
  logo: `${SITE}/icon.svg`,
  email: LEGAL.email,
  telephone: LEGAL.telephone,
  description:
    "Développeur web en sous-traitance pour les agences sans équipe technique. Renfort, projet complet, reprise et maintenance d'un existant, en marque blanche.",
  address: {
    '@type': 'PostalAddress',
    streetAddress: LEGAL.adresse.split(',')[0].trim(),
    postalCode: '33130',
    addressLocality: 'Bègles',
    addressCountry: 'FR',
  },
  areaServed: { '@type': 'Country', name: 'France' },
  founder: { '@type': 'Person', name: LEGAL.directeurPublication },
  knowsLanguage: 'fr',
  // Un seul tarif, à la journée, identique pour les trois modes. C'est ce que dit la page.
  makesOffer: {
    '@type': 'Offer',
    name: 'Développement web en marque blanche',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: TJM,
      priceCurrency: 'EUR',
      unitText: 'jour',
      valueAddedTaxIncluded: false,
    },
  },
} as const
