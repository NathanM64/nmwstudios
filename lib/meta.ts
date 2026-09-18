import type { Metadata } from 'next'
import { DICOS, avecBarre, offreParSlug } from '@/content'
import type { CleRoute, Dictionnaire, Langue, Page } from '@/content/types'

export const SITE = 'https://nmwstudios.com'

// Une adresse fixe dans public/, déclarée page par page : posée en fichier à la racine, l'image
// n'atteignait que l'accueil, chaque page qui fixe son og:url perdant l'héritage.
const imageOG = (t: Dictionnaire) => [{ url: '/opengraph-image.jpg', width: 1200, height: 630, type: 'image/jpeg', alt: t.ogAlt }]

export function metaSite(t: Dictionnaire): Metadata {
  return {
    metadataBase: new URL(SITE),
    // Des adresses fixes : Google ne rattrape pas un favicon qui change d'empreinte à chaque déploiement.
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
        { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { url: '/icon.svg', type: 'image/svg+xml' },
      ],
      apple: '/apple-touch-icon.png',
    },
    title: t.site.title,
    description: t.site.description,
    openGraph: { images: imageOG(t) },
  }
}

// canonical, og:url et hreflang d'une page, à partir de sa clé : la même page existe dans chaque langue.
export function metaPage(t: Dictionnaire, cle: CleRoute, page?: Page, index = true): Metadata {
  const chemin = (langue: Langue) => avecBarre(DICOS[langue].routes[cle])
  return {
    ...page,
    alternates: { canonical: chemin(t.langue), languages: { fr: chemin('fr'), en: chemin('en'), 'x-default': chemin('fr') } },
    openGraph: { url: chemin(t.langue), images: imageOG(t) },
    ...(index ? {} : { robots: { index: false } }),
  }
}

export function metaOffre(t: Dictionnaire, slug: string): Metadata {
  const offre = offreParSlug(t, slug)
  return offre ? metaPage(t, `offre:${offre.cle}`, { title: `${offre.titre}, NMW Studios`, description: offre.meta }) : {}
}
