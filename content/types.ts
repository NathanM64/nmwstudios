export type Langue = 'fr' | 'en'
export type CleEcran = 'accueil' | 'offres' | 'methode' | 'qui' | 'contact'
export type CleOffre = 'applications' | 'reprise' | 'sites' | 'automatisation' | 'hebergement'
// Une clé stable par adresse : c'est par elle qu'on passe d'une langue à l'autre.
export type CleRoute = CleEcran | 'refus' | 'legal' | `offre:${CleOffre}`

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
}
export type Page = { title: string; description: string }
// [situation, réponse, où elle mène]
export type Situation = readonly [string, string, CleRoute]
export type Question = readonly [string, string]
export type Etape = readonly [string, string, string]
export type Mission = readonly [string] | readonly [string, string]

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
    autreLangue: string
    changerLangue: string
  }
  site: Page
  // Le texte alternatif de l'image partagée (OG), la même dans chaque langue.
  ogAlt: string
  pages: Record<'offres' | 'methode' | 'refus' | 'qui' | 'contact' | 'legal' | 'introuvable', Page>
  accueil: {
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
    statut: string
    lienLegal: string
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
  introuvable: { h1: readonly [string, string]; lead: string; bouton: string }
  donnees: { description: string; jobTitle: string; catalogue: string }
}
