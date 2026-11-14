export type Langue = 'fr' | 'en'
export type CleEcran = 'accueil' | 'offres' | 'realisations' | 'methode' | 'qui' | 'contact'
export type CleOffre = 'applications' | 'reprise' | 'sites' | 'automatisation' | 'hebergement'
// Une clé stable par adresse : c'est par elle qu'on passe d'une langue à l'autre.
export type CleRoute = CleEcran | 'refus' | 'legal' | `offre:${CleOffre}`

// Page hors menu, en français seulement, pour une recherche locale précise.
export type PageLocale = {
  title: string
  description: string
  h1: string
  lead: string
  paragraphe: string
  sousTitre: string
  liste: readonly (readonly [string, string, CleRoute])[]
  sousTitre2: string
  paragraphe2: string
}

// Un bloc est un paragraphe, ou une liste.
export type Bloc = string | readonly string[]
export type Vue = { src: string; alt: string; titre: string }
export type Offre = {
  cle: CleOffre
  slug: string
  titre: string
  resume: string
  meta: string
  prix?: string
  blocs: readonly Bloc[]
  vues?: { legende: string; liste: readonly Vue[] }
  appel: string
  // La page locale de cette offre, en français seulement : [texte du lien, adresse].
  local?: readonly [string, string]
}
export type Page = { title: string; description: string }
// [situation, réponse, où elle mène]
export type Situation = readonly [string, string, CleRoute]
export type Question = readonly [string, string]
export type Etape = readonly [string, string, string]
export type Mission = readonly [string] | readonly [string, string]
export type Realisation = {
  nom: string
  nature: string
  besoin: string
  faits: readonly string[]
  vues: readonly Vue[]
  href: string
  lien: string
}

export type Dictionnaire = {
  langue: Langue
  routes: Record<CleRoute, string>
  ecrans: readonly { cle: CleEcran; titre: string }[]
  chrome: {
    menu: string
    fermer: string
    sections: string
    appel: string
    suivant: string
    retour: string
    legal: string
    linkedin: string
    instagram: string
    autreLangue: string
    changerLangue: string
  }
  site: Page
  // Le texte alternatif de l'image partagée (OG), la même dans chaque langue.
  ogAlt: string
  pages: Record<'offres' | 'realisations' | 'methode' | 'refus' | 'qui' | 'contact' | 'legal' | 'introuvable', Page>
  accueil: {
    // Le h1 porte les mots qu'on cherche ; l'accroche, en dessous, porte la voix.
    titre: string
    accroche: readonly [string, string, string]
    identite: string
    lead: string
    ouParEmail: string
    reponds: string
    eyebrow: string
    situations: readonly Situation[]
  }
  offres: {
    titre: readonly [string, string]
    lead: string
    voirDetail: string
    liste: readonly Offre[]
  }
  realisations: {
    h1: readonly [string, string]
    lead: string
    legende: string
    liste: readonly Realisation[]
  }
  methode: {
    h1: readonly [string, string]
    lead: string
    paragraphe: string
    missions: readonly Mission[]
    eyebrow: string
    etapes: readonly Etape[]
    onglets: readonly [string, string]
  }
  refus: {
    h1: readonly [string, string]
    lead: string
    liste: readonly Question[]
  }
  qui: {
    h1: string
    lead: readonly [string, string, string]
    paragraphe: string
    faits: string
    faq: readonly Question[]
  }
  contact: {
    h1: readonly [string, string]
    lead: string
    pieces: string
    role: string
    lieu: string
    // Le lieu avec un lien vers chaque page locale, en français seulement : [avant, Bordeaux, entre, Bègles, après].
    local?: readonly [string, string, string, string, string]
    statut: string
    lienLegal: string
    surLinkedin: string
    et: string
  }
  formulaire: {
    nom: string
    email: string
    emailPlaceholder: string
    url: string
    telephone: string
    facultatif: string
    projet: string
    projetPlaceholder: string
    piege: string
    envoyer: string
    envoiEnCours: string
    envoye: string
    envoyeDetail: string
    tropDeMessages: string
    secours: string
  }
  carrousel: { agrandir: string; agrandirTitre: string; vues: string }
  legal: {
    h1: string
    editeur: string
    statut: string
    tva: string
    directeur: string
    contact: string
    hebergement: string
    telephone: string
    donnees: string
    donneesTexte: string
  }
  begles?: PageLocale
  agenceWeb?: PageLocale
  reprise?: PageLocale
  introuvable: { h1: readonly [string, string]; lead: string; bouton: string }
  donnees: { description: string; jobTitle: string; catalogue: string }
}
