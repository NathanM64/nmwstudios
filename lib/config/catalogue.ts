// lib/config/catalogue.ts
export type Unite = 'forfait' | 'mensuel' | 'pourcentage'

export type GroupeId =
  | 'socle' | 'volume' | 'contenu' | 'fonctionnel'
  | 'visibilite' | 'conformite' | 'technique' | 'services' | 'recurrent'

export type Groupe = { id: GroupeId; titre: string; intro: string; exclusif?: boolean }

export type Option = {
  id: string
  libelle: string
  prix: number
  unite: Unite
  explication: string
  groupe: GroupeId
  /** Options répétables : tranches de pages, articles, langues. */
  quantifiable?: { max: number; suffixe: string }
  /** Effet déclenché sur l'aperçu vivant ; voir components/config/Apercu.tsx. */
  apercu?: string
}

export const SOCLE_ID = 'socle'

export const GROUPES: readonly Groupe[] = [
  { id: 'socle', titre: 'Votre site',
    intro: 'Le point de départ. Trois pages, un formulaire de contact, rien de superflu.' },
  { id: 'volume', titre: 'Pages et langues',
    intro: 'Combien de pages il vous faut, et dans combien de langues.' },
  { id: 'contenu', titre: 'Contenu',
    intro: 'Vos textes et vos images. C’est ce qui retarde le plus souvent un projet : autant décider maintenant qui s’en charge.' },
  { id: 'fonctionnel', titre: 'Fonctionnalités',
    intro: 'Ce que vos visiteurs pourront faire, au-delà de vous lire.' },
  { id: 'visibilite', titre: 'Être trouvé',
    intro: 'Apparaître quand quelqu’un cherche votre métier près de chez vous.' },
  { id: 'conformite', titre: 'Conformité',
    intro: 'Ce que la loi impose à tout le monde, et ce qu’elle impose à certains seulement.' },
  { id: 'technique', titre: 'Technique',
    intro: 'Le socle qui ne se voit pas : reprise de l’existant, adresse, vitesse de chargement.' },
  { id: 'services', titre: 'Accompagnement',
    intro: 'Avant la construction pour décider quoi faire, après la livraison pour en reprendre la main.' },
  { id: 'recurrent', titre: 'Je m’occupe de tout', exclusif: true,
    intro: 'Une fois le site en ligne, quelqu’un doit s’en occuper. Vous, ou moi.' },
] as const

export const OPTIONS: readonly Option[] = [
  { id: SOCLE_ID, libelle: '1 à 3 pages, formulaire de contact', prix: 1500, unite: 'forfait', groupe: 'socle',
    explication: 'Le socle : trois pages, un formulaire qui envoie un e-mail, aucune base de données.', apercu: 'socle' },

  { id: 'pages', libelle: '3 pages de plus', prix: 600, unite: 'forfait', groupe: 'volume',
    quantifiable: { max: 4, suffixe: 'tranche' }, apercu: 'pages',
    explication: 'Chaque tranche ajoute trois pages : services, tarifs, réalisations, à vous de voir.' },
  { id: 'blog', libelle: 'Un blog', prix: 700, unite: 'forfait', groupe: 'volume', apercu: 'blog',
    explication: 'Une section actualités que vous alimentez vous-même.' },
  { id: 'langue', libelle: 'Une langue de plus', prix: 800, unite: 'forfait', groupe: 'volume',
    quantifiable: { max: 3, suffixe: 'langue' }, apercu: 'langue',
    explication: 'Le site entier dans une langue supplémentaire, avec un sélecteur.' },

  { id: 'redaction', libelle: 'J’écris vos textes', prix: 150, unite: 'forfait', groupe: 'contenu',
    quantifiable: { max: 15, suffixe: 'page' },
    explication: 'Je vous interroge sur votre métier, puis j’écris. Les faits viennent de vous.' },
  { id: 'reprise', libelle: 'Je reprends vos textes existants', prix: 400, unite: 'forfait', groupe: 'contenu',
    explication: 'Vos contenus actuels, restructurés et remis en forme.' },
  { id: 'photos', libelle: 'Je retouche vos photos', prix: 300, unite: 'forfait', groupe: 'contenu',
    explication: 'Recadrage, correction, allègement. Je ne prends pas les photos : vous les fournissez.' },
  { id: 'visuels', libelle: 'Visuels sous licence', prix: 150, unite: 'forfait', groupe: 'contenu',
    explication: 'Sélection d’images libres de droits quand vous n’avez pas les vôtres.' },

  { id: 'formulaire', libelle: 'Formulaire avancé', prix: 400, unite: 'forfait', groupe: 'fonctionnel', apercu: 'formulaire',
    explication: 'Plusieurs étapes, pièces jointes, champs conditionnels.' },
  { id: 'rdv', libelle: 'Prise de rendez-vous', prix: 900, unite: 'forfait', groupe: 'fonctionnel', apercu: 'rdv',
    explication: 'Vos clients réservent un créneau en ligne.' },
  { id: 'newsletter', libelle: 'Newsletter', prix: 500, unite: 'forfait', groupe: 'fonctionnel',
    explication: 'Collecte des adresses et envoi des campagnes.' },
  { id: 'paiement', libelle: 'Paiement en ligne', prix: 1200, unite: 'forfait', groupe: 'fonctionnel',
    explication: 'Encaissement par carte, sans passer par une boutique complète.' },
  { id: 'membre', libelle: 'Espace membre', prix: 1500, unite: 'forfait', groupe: 'fonctionnel', apercu: 'membre',
    explication: 'Vos clients se connectent pour accéder à un contenu réservé.' },

  { id: 'seo', libelle: 'Fondations SEO', prix: 600, unite: 'forfait', groupe: 'visibilite', apercu: 'seo',
    explication: 'Structure, métadonnées, données structurées, Search Console.' },
  { id: 'seo-local', libelle: 'Référencement local', prix: 800, unite: 'forfait', groupe: 'visibilite',
    explication: 'Fiche Google, pages par ville, citations locales.' },
  { id: 'article', libelle: 'Un article optimisé', prix: 180, unite: 'forfait', groupe: 'visibilite',
    quantifiable: { max: 10, suffixe: 'article' },
    explication: 'Article rédigé pour une requête précise.' },

  { id: 'legal', libelle: 'Mentions légales et CGV', prix: 300, unite: 'forfait', groupe: 'conformite',
    explication: 'Rédigées pour votre activité, pas copiées d’un modèle.' },
  { id: 'rgpd', libelle: 'Conformité RGPD', prix: 400, unite: 'forfait', groupe: 'conformite',
    explication: 'Bannière conforme, registre des traitements, politique de confidentialité.' },
  { id: 'a11y', libelle: 'Accessibilité RGAA', prix: 1200, unite: 'forfait', groupe: 'conformite', apercu: 'a11y',
    explication: 'Mise en conformité et déclaration. Obligatoire au-delà de 10 salariés et 2 M€ de chiffre d’affaires sur un service grand public, pas en dessous.' },

  { id: 'migration', libelle: 'Migration de votre site actuel', prix: 600, unite: 'forfait', groupe: 'technique',
    explication: 'Reprise des contenus et redirections, pour ne rien perdre de votre référencement.' },
  { id: 'domaine', libelle: 'Domaine et e-mails professionnels', prix: 200, unite: 'forfait', groupe: 'technique',
    explication: 'Nom de domaine réservé et adresses configurées.' },
  { id: 'perf', libelle: 'Optimisation de la vitesse', prix: 500, unite: 'forfait', groupe: 'technique', apercu: 'perf',
    explication: 'Mesures avant et après, chiffres à l’appui.' },
  { id: 'express', libelle: 'Livraison accélérée', prix: 30, unite: 'pourcentage', groupe: 'technique',
    explication: 'Votre projet passe devant les autres.' },

  { id: 'cadrage', libelle: 'Atelier de cadrage', prix: 500, unite: 'forfait', groupe: 'services',
    explication: 'Une demi-journée pour décider quoi construire avant de construire.' },
  { id: 'formation', libelle: 'Formation à la prise en main', prix: 600, unite: 'forfait', groupe: 'services',
    explication: 'Deux heures, une à deux personnes.' },

  { id: 'sans-suivi', libelle: 'Je m’en occupe moi-même', prix: 0, unite: 'mensuel', groupe: 'recurrent',
    explication: 'Vous gardez la main sur l’hébergement et les mises à jour. Le site vous appartient de toute façon.' },
  { id: 'heberg', libelle: 'Hébergement et domaine', prix: 35, unite: 'mensuel', groupe: 'recurrent', apercu: 'heberg',
    explication: 'Je m’occupe de l’hébergement, du domaine et du certificat.' },
  { id: 'essentiel', libelle: 'Essentiel', prix: 90, unite: 'mensuel', groupe: 'recurrent', apercu: 'essentiel',
    explication: 'Hébergement, mises à jour, sauvegardes quotidiennes, surveillance, correctifs.' },
  { id: 'serenite', libelle: 'Sérénité', prix: 190, unite: 'mensuel', groupe: 'recurrent', apercu: 'serenite',
    explication: 'Essentiel, plus une heure de modifications par mois et une intervention sous 4 h.' },
  { id: 'partenaire', libelle: 'Partenaire', prix: 390, unite: 'mensuel', groupe: 'recurrent', apercu: 'partenaire',
    explication: 'Sérénité, plus les évolutions, le suivi d’audience et un rapport mensuel.' },
] as const

const PAR_ID = new Map(OPTIONS.map((o) => [o.id, o]))

export function optionParId(id: string): Option | undefined {
  return PAR_ID.get(id)
}
