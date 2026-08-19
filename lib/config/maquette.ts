export type Langue = 'fr' | 'en' | 'es' | 'de'

/** Langues de la maquette dans l'ordre d'achat : le français, puis une de plus par unité de `langue`. */
export const LANGUES: readonly Langue[] = ['fr', 'en', 'es', 'de']

/** Habillage commun aux sept métiers : les libellés d'interface, qui ne dépendent pas de
 *  l'activité. Tout ce qui en dépend vit dans `lib/config/domaines.ts`. */
export type Habillage = {
  actualites: string
  creneaux: string[]
  reserver: string
  inscrire: string
  envoyer: string
  pieceJointe: string
  regler: string
  connexion: string
  photo: string
  visuel: string
  redigees: string
}

export const HABILLAGE: Record<Langue, Habillage> = {
  fr: {
    actualites: 'Actualités',
    creneaux: ['9 h', '10 h', '11 h', '14 h', '15 h', '16 h'],
    reserver: 'Réserver un créneau',
    inscrire: 'S’inscrire',
    envoyer: 'Envoyer',
    pieceJointe: 'Pièce jointe',
    regler: 'Régler en ligne',
    connexion: 'Connexion',
    photo: 'recadrée et allégée',
    visuel: 'visuel sous licence',
    redigees: 'Textes rédigés',
  },
  en: {
    actualites: 'News',
    creneaux: ['9 am', '10 am', '11 am', '2 pm', '3 pm', '4 pm'],
    reserver: 'Book a slot',
    inscrire: 'Sign up',
    envoyer: 'Send',
    pieceJointe: 'Attachment',
    regler: 'Pay online',
    connexion: 'Log in',
    photo: 'cropped and compressed',
    visuel: 'licensed image',
    redigees: 'Pages written',
  },
  es: {
    actualites: 'Novedades',
    creneaux: ['9:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
    reserver: 'Reservar una cita',
    inscrire: 'Suscribirse',
    envoyer: 'Enviar',
    pieceJointe: 'Adjunto',
    regler: 'Pagar en línea',
    connexion: 'Acceder',
    photo: 'recortada y aligerada',
    visuel: 'imagen con licencia',
    redigees: 'Textos redactados',
  },
  de: {
    actualites: 'Aktuelles',
    creneaux: ['9 Uhr', '10 Uhr', '11 Uhr', '14 Uhr', '15 Uhr', '16 Uhr'],
    reserver: 'Termin buchen',
    inscrire: 'Abonnieren',
    envoyer: 'Senden',
    pieceJointe: 'Anhang',
    regler: 'Online bezahlen',
    connexion: 'Anmelden',
    photo: 'zugeschnitten und verkleinert',
    visuel: 'Lizenzbild',
    redigees: 'Verfasste Seiten',
  },
}
