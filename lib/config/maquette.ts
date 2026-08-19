export type Langue = 'fr' | 'en' | 'es' | 'de'

/** Langues de la maquette dans l'ordre d'achat : le français, puis une de plus par unité de `langue`. */
export const LANGUES: readonly Langue[] = ['fr', 'en', 'es', 'de']

export type TextesMaquette = {
  /** Trois pages du socle puis les douze des tranches : sert aussi à nommer les pages rédigées. */
  pages: string[]
  titre: string
  corps: string
  blocsRepris: string[]
  actualites: string
  articles: { titre: string; requete: string }[]
  creneaux: string[]
  reserver: string
  inscrire: string
  pieceJointe: string
  regler: string
  connexion: string
  photo: string
  visuel: string
  redigees: string
}

export const TEXTES: Record<Langue, TextesMaquette> = {
  fr: {
    pages: ['Accueil', 'Services', 'Contact', 'Tarifs', 'Réalisations', 'À propos', 'Équipe', 'FAQ', 'Blog', 'Presse', 'Partenaires', 'Recrutement', 'Mentions', 'Plan', 'Aide'],
    titre: 'Charpentier à Bègles depuis 1998',
    corps: 'Ossature bois, extension, rénovation de toiture. Devis sous 48 h, chantiers en Gironde.',
    blocsRepris: ['Nos services', 'Notre histoire', 'Nous contacter'],
    actualites: 'Actualités',
    articles: [
      { titre: 'Quel bois pour une extension ?', requete: 'extension bois bègles' },
      { titre: 'Prix d’une toiture en 2026', requete: 'prix toiture gironde' },
      { titre: 'Ossature ou maçonnerie', requete: 'ossature bois avis' },
      { titre: 'Isoler une charpente ancienne', requete: 'isolation charpente' },
      { titre: 'Faut-il un permis pour une véranda', requete: 'permis véranda gironde' },
      { titre: 'Entretenir un bardage bois', requete: 'entretien bardage' },
      { titre: 'Combien de temps dure un chantier', requete: 'délai chantier bois' },
      { titre: 'Bois local ou importé', requete: 'bois local gironde' },
      { titre: 'Rénover sans tout casser', requete: 'rénovation toiture bègles' },
      { titre: 'Choisir son couvreur', requete: 'couvreur bègles avis' },
    ],
    creneaux: ['9 h', '10 h', '11 h', '14 h', '15 h', '16 h'],
    reserver: 'Réserver un créneau',
    inscrire: 'S’inscrire',
    pieceJointe: 'Pièce jointe',
    regler: 'Régler en ligne',
    connexion: 'Connexion',
    photo: 'recadrée et allégée',
    visuel: 'visuel sous licence',
    redigees: 'Textes rédigés',
  },
  en: {
    pages: ['Home', 'Services', 'Contact', 'Pricing', 'Projects', 'About', 'Team', 'FAQ', 'Blog', 'Press', 'Partners', 'Careers', 'Legal', 'Sitemap', 'Help'],
    titre: 'Carpenter in Bègles since 1998',
    corps: 'Timber frames, extensions, roof renovation. Quote within 48 h, projects across Gironde.',
    blocsRepris: ['Our services', 'Our story', 'Get in touch'],
    actualites: 'News',
    articles: [
      { titre: 'Which timber for an extension?', requete: 'timber extension bègles' },
      { titre: 'What a roof costs in 2026', requete: 'roof price gironde' },
      { titre: 'Timber frame or masonry', requete: 'timber frame reviews' },
      { titre: 'Insulating an old roof structure', requete: 'roof structure insulation' },
      { titre: 'Does a veranda need a permit', requete: 'veranda permit gironde' },
      { titre: 'Caring for timber cladding', requete: 'timber cladding care' },
      { titre: 'How long a building site lasts', requete: 'timber project timeline' },
      { titre: 'Local or imported timber', requete: 'local timber gironde' },
      { titre: 'Renovating without tearing it all down', requete: 'roof renovation bègles' },
      { titre: 'Choosing your roofer', requete: 'roofer bègles reviews' },
    ],
    creneaux: ['9 am', '10 am', '11 am', '2 pm', '3 pm', '4 pm'],
    reserver: 'Book a slot',
    inscrire: 'Sign up',
    pieceJointe: 'Attachment',
    regler: 'Pay online',
    connexion: 'Log in',
    photo: 'cropped and compressed',
    visuel: 'licensed image',
    redigees: 'Pages written',
  },
  es: {
    pages: ['Inicio', 'Servicios', 'Contacto', 'Tarifas', 'Proyectos', 'Quiénes somos', 'Equipo', 'Preguntas', 'Blog', 'Prensa', 'Socios', 'Empleo', 'Aviso legal', 'Mapa del sitio', 'Ayuda'],
    titre: 'Carpintero en Bègles desde 1998',
    corps: 'Estructuras de madera, ampliaciones, renovación de tejados. Presupuesto en 48 h, obras en Gironda.',
    blocsRepris: ['Nuestros servicios', 'Nuestra historia', 'Contactar'],
    actualites: 'Novedades',
    articles: [
      { titre: '¿Qué madera para una ampliación?', requete: 'ampliación madera bègles' },
      { titre: 'Precio de un tejado en 2026', requete: 'precio tejado gironda' },
      { titre: 'Estructura de madera u obra', requete: 'estructura madera opiniones' },
      { titre: 'Aislar una cubierta antigua', requete: 'aislamiento cubierta' },
      { titre: '¿Hace falta licencia para una veranda?', requete: 'licencia veranda gironda' },
      { titre: 'Mantener un revestimiento de madera', requete: 'mantenimiento revestimiento' },
      { titre: 'Cuánto dura una obra', requete: 'plazo obra madera' },
      { titre: 'Madera local o importada', requete: 'madera local gironda' },
      { titre: 'Renovar sin derribarlo todo', requete: 'renovación tejado bègles' },
      { titre: 'Cómo elegir al tejador', requete: 'tejador bègles opiniones' },
    ],
    creneaux: ['9:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
    reserver: 'Reservar una cita',
    inscrire: 'Suscribirse',
    pieceJointe: 'Adjunto',
    regler: 'Pagar en línea',
    connexion: 'Acceder',
    photo: 'recortada y aligerada',
    visuel: 'imagen con licencia',
    redigees: 'Textos redactados',
  },
  de: {
    pages: ['Startseite', 'Leistungen', 'Kontakt', 'Preise', 'Referenzen', 'Über uns', 'Team', 'FAQ', 'Blog', 'Presse', 'Partner', 'Karriere', 'Impressum', 'Sitemap', 'Hilfe'],
    titre: 'Zimmerei in Bègles seit 1998',
    corps: 'Holzrahmenbau, Anbauten, Dachsanierung. Angebot in 48 Stunden, Baustellen in der Gironde.',
    blocsRepris: ['Unsere Leistungen', 'Unsere Geschichte', 'Kontakt aufnehmen'],
    actualites: 'Aktuelles',
    articles: [
      { titre: 'Welches Holz für einen Anbau?', requete: 'holzanbau bègles' },
      { titre: 'Was ein Dach 2026 kostet', requete: 'dach preis gironde' },
      { titre: 'Holzrahmen oder Mauerwerk', requete: 'holzrahmenbau erfahrungen' },
      { titre: 'Einen alten Dachstuhl dämmen', requete: 'dachstuhl dämmung' },
      { titre: 'Braucht ein Wintergarten eine Genehmigung', requete: 'wintergarten genehmigung gironde' },
      { titre: 'Holzfassade richtig pflegen', requete: 'holzfassade pflege' },
      { titre: 'Wie lange eine Baustelle dauert', requete: 'bauzeit holzbau' },
      { titre: 'Heimisches oder importiertes Holz', requete: 'heimisches holz gironde' },
      { titre: 'Sanieren ohne alles abzureißen', requete: 'dachsanierung bègles' },
      { titre: 'Den richtigen Dachdecker finden', requete: 'dachdecker bègles erfahrungen' },
    ],
    creneaux: ['9 Uhr', '10 Uhr', '11 Uhr', '14 Uhr', '15 Uhr', '16 Uhr'],
    reserver: 'Termin buchen',
    inscrire: 'Abonnieren',
    pieceJointe: 'Anhang',
    regler: 'Online bezahlen',
    connexion: 'Anmelden',
    photo: 'zugeschnitten und verkleinert',
    visuel: 'Lizenzbild',
    redigees: 'Verfasste Seiten',
  },
}
