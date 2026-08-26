export type Langue = 'fr' | 'en' | 'es' | 'de'

/** Langues de la maquette dans l'ordre d'achat : le français, puis une de plus par unité de `langue`. */
export const LANGUES: readonly Langue[] = ['fr', 'en', 'es', 'de']

/** Pages du socle. Le volume du site s'en déduit avec les tranches de `pages` : la navigation et
 *  le bloc des provenances doivent nommer le même nombre de pages. */
export const PAGES_SOCLE = 3

/** Habillage commun aux sept métiers : les libellés d'interface, qui ne dépendent pas de
 *  l'activité. Tout ce qui en dépend vit dans `lib/config/domaines.ts`. */
export type Habillage = {
  actualites: string
  jours: string[]
  creneaux: string[]
  reserver: string
  confirmation: string
  inscrire: string
  envoyer: string
  pieceJointe: string
  regler: string
  connexion: string
  fournies: string
  redigees: string
  etapes: string[]
  question: string
  reponse: string
  fichier: string
}

export const HABILLAGE: Record<Langue, Habillage> = {
  fr: {
    actualites: 'Actualités',
    jours: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    creneaux: ['9 h', '10 h', '11 h', '14 h', '15 h', '16 h'],
    reserver: 'Réserver un créneau',
    confirmation: 'Confirmation par e-mail',
    inscrire: 'S’inscrire',
    envoyer: 'Envoyer',
    pieceJointe: 'Pièce jointe',
    regler: 'Régler en ligne',
    connexion: 'Connexion',
    fournies: 'Pages fournies',
    redigees: 'Pages rédigées',
    etapes: ['Votre demande', 'Vos coordonnées', 'Validation'],
    question: 'Souhaitez-vous être rappelé ?',
    reponse: 'Oui, le matin',
    fichier: 'plan-du-projet.pdf',
  },
  en: {
    actualites: 'News',
    jours: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    creneaux: ['9 am', '10 am', '11 am', '2 pm', '3 pm', '4 pm'],
    reserver: 'Book a slot',
    confirmation: 'Confirmation by e-mail',
    inscrire: 'Sign up',
    envoyer: 'Send',
    pieceJointe: 'Attachment',
    regler: 'Pay online',
    connexion: 'Log in',
    fournies: 'Pages supplied',
    redigees: 'Pages written',
    etapes: ['Your request', 'Your details', 'Confirmation'],
    question: 'Would you like a call back?',
    reponse: 'Yes, in the morning',
    fichier: 'project-plan.pdf',
  },
  es: {
    actualites: 'Novedades',
    jours: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    creneaux: ['9:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
    reserver: 'Reservar una cita',
    confirmation: 'Confirmación por correo',
    inscrire: 'Suscribirse',
    envoyer: 'Enviar',
    pieceJointe: 'Adjunto',
    regler: 'Pagar en línea',
    connexion: 'Acceder',
    fournies: 'Páginas facilitadas',
    redigees: 'Páginas redactadas',
    etapes: ['Su solicitud', 'Sus datos', 'Validación'],
    question: '¿Desea que le llamemos?',
    reponse: 'Sí, por la mañana',
    fichier: 'plano-del-proyecto.pdf',
  },
  de: {
    actualites: 'Aktuelles',
    jours: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
    creneaux: ['9 Uhr', '10 Uhr', '11 Uhr', '14 Uhr', '15 Uhr', '16 Uhr'],
    reserver: 'Termin buchen',
    confirmation: 'Bestätigung per E-Mail',
    inscrire: 'Abonnieren',
    envoyer: 'Senden',
    pieceJointe: 'Anhang',
    regler: 'Online bezahlen',
    connexion: 'Anmelden',
    fournies: 'Gelieferte Seiten',
    redigees: 'Verfasste Seiten',
    etapes: ['Ihre Anfrage', 'Ihre Daten', 'Bestätigung'],
    question: 'Möchten Sie zurückgerufen werden?',
    reponse: 'Ja, vormittags',
    fichier: 'projektplan.pdf',
  },
}
