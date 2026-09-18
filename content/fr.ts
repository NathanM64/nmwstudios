import type { Dictionnaire } from './types'

export const FR: Dictionnaire = {
  langue: 'fr',
  routes: {
    accueil: '/',
    offres: '/ce-que-je-fais',
    'offre:applications': '/ce-que-je-fais',
    'offre:reprise': '/ce-que-je-fais/reprise',
    'offre:sites': '/ce-que-je-fais/sites',
    'offre:automatisation': '/ce-que-je-fais/automatisation',
    'offre:hebergement': '/ce-que-je-fais/hebergement',
    methode: '/comment-je-travaille',
    refus: '/comment-je-travaille/ce-que-je-ne-fais-pas',
    qui: '/qui-je-suis',
    contact: '/contact',
    legal: '/mentions-legales',
  },
  // L'ordre est celui du menu, et celui que suivent les flèches.
  ecrans: [
    { cle: 'accueil', titre: 'Accueil' },
    { cle: 'offres', titre: 'Ce que je fais' },
    { cle: 'methode', titre: 'Comment je travaille' },
    { cle: 'qui', titre: 'Qui je suis' },
    { cle: 'contact', titre: 'Contact' },
  ],
  chrome: {
    menu: 'Menu',
    fermer: 'Fermer',
    sections: 'Sections',
    appel: 'Parler de votre projet',
    suivant: 'Suivant :',
    retour: 'Retour :',
    legal: 'Mentions légales',
    autreLangue: 'EN',
    changerLangue: 'English version',
  },
  site: {
    title: 'NMW Studios, développeur web indépendant à Bordeaux',
    description:
      'Je conçois, je développe, je reprends et j’accompagne vos sites et applications web, en direct et en marque blanche pour les agences. Le code est à vous.',
  },
  ogAlt: 'NMW Studios. Je conçois, je développe, je reprends et j’accompagne. Vous décidez jusqu’où. Nathan Marimbordes, développeur web indépendant à Bordeaux.',
  pages: {
    offres: {
      title: 'Ce que je fais : sites, reprise, automatisation. NMW Studios',
      description:
        'Reprise de l’existant, sites vitrines, applications, automatisation et hébergement. Cinq façons de travailler ensemble, chacune sur sa page. Le code est à vous.',
    },
    methode: {
      title: 'Comment je travaille, en direct et en marque blanche',
      description:
        'Depuis 2025, une agence parisienne me confie ses applications en marque blanche. Cinq étapes, et à chacune quelque chose entre vos mains, avec une date.',
    },
    refus: {
      title: 'Ce que je ne fais pas : les limites que je pose. NMW Studios',
      description:
        'Les sites sans code source, les projets qui demandent une équipe, les applications mobiles natives, un prix de maintenance avant d’avoir construit le projet.',
    },
    qui: {
      title: 'Nathan Marimbordes, développeur web indépendant à Bordeaux',
      description:
        'Nathan Marimbordes, développeur web depuis 2020, à mon compte depuis 2025, à Bordeaux. Je travaille seul, et je le dis, et je vous oriente si votre projet demande une équipe.',
    },
    contact: {
      title: 'Contact, parlons de votre projet, NMW Studios à Bordeaux',
      description:
        'Un message suffit, je le lis moi-même et je réponds dans la journée. Nathan Marimbordes, développeur web indépendant, à Bordeaux.',
    },
    legal: { title: 'Mentions légales, NMW Studios', description: 'Éditeur, hébergeur et données personnelles du site nmwstudios.com.' },
    introuvable: { title: 'Page introuvable, NMW Studios', description: 'Cette page n’existe pas ou n’existe plus.' },
  },
  accueil: {
    accroche: ['Je conçois, je développe,', 'je reprends et j’accompagne.', 'Vous décidez jusqu’où.'],
    identite: ', développeur web indépendant à Bordeaux. Pour les entreprises en direct, et pour les agences en marque blanche.',
    lead: 'Sites vitrines, applications et outils métier. Je construis, je reprends l’existant, et j’assure la suite si vous le souhaitez. Le code est à vous.',
    ouParEmail: 'ou par email :',
    reponds: 'Je réponds dans la journée.',
    eyebrow: 'Quatre situations que je connais bien',
    situations: [
      ['Votre site a cinq ans et plus personne ne veut y toucher.', 'Je le reprends, sans repartir de zéro.', 'offre:reprise'],
      ['Votre agence a une maquette validée et personne pour l’intégrer avant la date.', 'Je l’intègre avant la date, sous votre nom.', 'methode'],
      ['Votre équipe recopie des données à la main tous les jours.', 'Je fais disparaître la tâche.', 'offre:automatisation'],
      ['Votre prestataire ne répond plus.', 'Je prends la suite, et je réponds.', 'offre:reprise'],
    ],
  },
  offres: {
    titre: ['Cinq façons de travailler ensemble.', 'Une que peu de gens proposent.'],
    lead: 'Créer, reprendre, automatiser, héberger. Et reprendre ce qui existe déjà, au lieu de refaire : c’est la plus rare.',
    voirDetail: 'Voir le détail',
    // La première offre s'affiche à l'index des offres, les autres sous leur slug.
    // Les applications ouvrent : c'est la carte qui montre quelque chose.
    liste: [
      {
        cle: 'applications',
        slug: 'applications',
        titre: 'Une application, un outil interne, un premier produit',
        resume: 'Une première version qui tourne, puis des itérations courtes.',
        meta: 'Une première version qui tourne, puis des versions courtes et régulières : outil interne, espace client, premier produit. Vous voyez le chantier avancer.',
        blocs: [
          'Une première version qui tourne, puis des versions courtes et régulières : outil interne, espace client, premier produit. Vous voyez le chantier avancer, pas une livraison surprise.',
        ],
        vues: {
          legende: 'Mon outil, construit pour moi. Données de démonstration.',
          liste: [
            { src: '/demo/temps.webp', alt: 'Le suivi du temps, une semaine en calendrier', titre: 'Temps' },
            { src: '/demo/compta.webp', alt: 'La comptabilité de la micro-entreprise : chiffre d’affaires, charges, plafond', titre: 'Comptabilité' },
            { src: '/demo/facture.webp', alt: 'Une facture générée depuis le temps passé', titre: 'Facture' },
          ],
        },
        appel: 'Parler de votre application',
      },
      {
        cle: 'reprise',
        slug: 'reprise',
        titre: 'Reprendre votre site ou votre application',
        resume: 'Du code que d’autres ont écrit, remis en marche et tenu.',
        meta: 'Je lis le code que d’autres ont écrit, je le remets en état de marche et je le fais vivre. Facturé au temps passé, au taux annoncé avant de commencer.',
        blocs: [
          'Je lis le code que d’autres ont écrit, je le remets en état de marche et je le fais vivre. Une reprise se facture au temps passé, au taux annoncé avant de commencer.',
          'Envoyez-moi l’adresse de votre site, même si vous ne savez pas comment il a été fait. Je vous écris ce qui tient, ce qui casse, ce que je ferais en premier. Les accès viennent après qu’on se soit parlé, et je n’en conserve aucun. Le devis vient après.',
          'Trois choses que je vérifie d’abord :',
          ['Le code source, accessible en entier', 'Un projet qui redémarre sur une machine neuve', 'Un hébergement et un domaine transférables'],
        ],
        appel: 'Parler de votre existant',
      },
      {
        cle: 'sites',
        slug: 'sites',
        titre: 'Un site vitrine ou une page de campagne',
        resume: 'Sobre et rapide, que vous pouvez faire évoluer sans moi.',
        meta: 'Un site rapide, que vous pouvez faire évoluer sans moi, sans constructeur de pages. À partir de 1 500 €, jusqu’à trois pages, vos maquettes ou les miennes si vous n’en avez pas.',
        prix: 'À partir de 1 500 €, jusqu’à trois pages.',
        blocs: [
          'Un site rapide, que vous pouvez faire évoluer sans moi. Pas de constructeur de pages : du code qu’un autre développeur peut reprendre. Vos maquettes, intégrées telles quelles, sous votre nom ; les miennes seulement si vous n’en avez pas.',
          'Un site sur mesure, avec une direction graphique et des animations propres, se chiffre après cadrage. Les montants sont indicatifs et s’ajustent selon le périmètre et les contenus.',
        ],
        appel: 'Parler de votre site',
      },
      {
        cle: 'automatisation',
        slug: 'automatisation',
        titre: 'Faire disparaître une tâche répétitive',
        resume: 'Ce que votre équipe refait chaque jour à la main.',
        meta: 'Classement des demandes entrantes, extraction de données depuis des documents, relances et rédaction assistée dans un backoffice. Je mesure avant et après.',
        blocs: [
          'Des tâches précises qui disparaissent de votre journée : classement automatique des demandes entrantes, extraction de données depuis des documents, relances et notifications, rédaction assistée dans un backoffice.',
          'On mesure avant et après. Si le gain n’est pas là, je vous le dis.',
        ],
        appel: 'Parler de vos tâches répétitives',
      },
      {
        cle: 'hebergement',
        slug: 'hebergement',
        titre: 'Héberger et surveiller votre site',
        resume: 'Hébergement, domaine, sauvegardes, alerte si le site tombe. Transférable.',
        meta: 'Hébergement, nom de domaine, certificat de sécurité, sauvegarde chaque nuit, alerte si le site ne répond plus. Transférable le jour où vous le décidez.',
        blocs: [
          'Inclus : l’hébergement, le nom de domaine, le certificat de sécurité, une sauvegarde chaque nuit, une alerte si le site ne répond plus, les mises à jour de sécurité du serveur.',
          'Non inclus : toute modification de contenu ou de code, facturée à l’heure ou dans un forfait dédié.',
          'Transférable le jour où vous le décidez.',
        ],
        appel: 'Parler de votre hébergement',
      },
    ],
  },
  methode: {
    h1: ['Depuis 2025,', 'une agence parisienne me confie ses applications et ses nouveaux projets.'],
    lead: 'En marque blanche : vos maquettes, vos délais, votre nom devant votre client.',
    paragraphe: 'Je ne contacte jamais votre client, je ne signe pas mon travail, je ne conserve aucun accès une fois le chantier livré. Ce que je peux décrire :',
    missions: [
      ['Une application de saisie sur tablette pour les équipes terrain d’un grand groupe.'],
      ['Un backoffice de jeu concours à forte audience.', 'Tirage, notifications automatiques, suivi de performance.'],
      ['La reprise et la maintenance d’un parc d’applications existantes.'],
    ],
    eyebrow: 'Ce que vous avez en main à chaque étape',
    // Chaque étape finit par ce que vous avez en main.
    etapes: [
      ['Cadrage', 'Un périmètre écrit, un prix et une date.', 'Ce que le projet fait, et ce qu’il ne fera pas.'],
      ['Conception', 'La liste des écrans, avec les points signalés.', 'Vos maquettes telles quelles ; les miennes si vous n’en avez pas.'],
      ['Développement', 'Une adresse où voir l’avancement.', 'Des versions visibles au fil du chantier. Si une date glisse, vous le savez avant.'],
      ['Mise en ligne', 'Le projet en ligne, transférable.', 'Sur votre hébergement ou sur le mien.'],
      ['Suivi', 'Si vous le souhaitez.', 'Sinon, le code et la documentation.'],
    ],
    onglets: ['Comment je travaille', 'Ce que je ne fais pas'],
  },
  refus: {
    h1: ['Ce que je', 'ne fais pas.'],
    lead: 'Rien ne rassure autant qu’un prestataire qui pose ses limites. Voici les miennes.',
    liste: [
      ['Les sites sans code source', 'Wix, Squarespace ou un éditeur équivalent : les reprendre vous coûterait plus cher que de refaire. Je vous le dis à la première lecture.'],
      ['Les projets qui demandent une équipe', 'Je travaille seul. Si votre projet demande cinq personnes, je vous le dirai et je vous orienterai, au lieu de le prendre et de vous mettre en retard.'],
      ['Les applications mobiles natives', 'Pas d’application iOS ou Android sur mesure. Un besoin simple passe souvent par le web, et je vous dirai si c’est le cas.'],
      ['Un prix de maintenance avant d’avoir construit', 'Le chiffrer avant de connaître le projet n’a pas de sens. Le périmètre de l’hébergement, lui, est écrit noir sur blanc.'],
    ],
  },
  qui: {
    h1: 'Nathan Marimbordes.',
    lead: ['Développeur web depuis 2020, à mon compte depuis 2025.', 'Je travaille seul, et je le dis :', 'si votre projet demande une équipe, je vous le dirai et je vous orienterai.'],
    paragraphe:
      'Mes chantiers durent et se relaient : pendant qu’un client relit, un autre avance. J’ai de la place, et je vous dis à partir de quand avant de m’engager. Si une fonctionnalité va coûter cher pour rien, je le dis avant de la chiffrer. Je préviens avant de dépasser, pas après.',
    faits: 'Bordeaux. À distance pour toute la France.',
    faq: [
      ['Vous êtes seul, que se passe-t-il si vous n’êtes plus disponible ?', 'Le code est livré et documenté, il est chez vous, à votre nom, et l’hébergement est transférable. Un autre développeur peut reprendre sans avoir besoin de moi.'],
      ['Vous pouvez reprendre un site fait par une autre agence ?', 'Oui, même si l’agence n’existe plus. Envoyez-moi l’adresse, je vous écris ce qui tient et ce qui casse avant tout devis, et je vous dis si une refonte vaut mieux qu’une reprise.'],
      ['Travaillez-vous en marque blanche pour des agences ?', 'Oui, en freelance. Vos maquettes, vos délais, votre nom devant votre client. Je ne contacte jamais votre client et je ne signe pas mon travail.'],
      ['Combien coûte une reprise ?', 'Au temps passé, au taux annoncé avant de commencer. Le devis vient après l’état des lieux.'],
      ['Combien coûte un site ?', 'Un site vitrine simple, jusqu’à trois pages, démarre à 1 500 €. Un site sur mesure se chiffre après cadrage, selon le périmètre et les contenus.'],
      ['Combien de temps pour une première version ?', 'La date se fixe au cadrage, à partir de ce que le projet doit faire et de ce que vous fournissez. Vous voyez des versions avant cette date.'],
      ['Que se passe-t-il après la livraison ?', 'Vous choisissez : je continue à faire vivre le projet, ou vous repartez avec le code, la documentation et un hébergement transférable.'],
    ],
  },
  contact: {
    h1: ['Parlons de', 'votre projet.'],
    lead: 'Un message suffit. Je le lis moi-même et je réponds dans la journée.',
    pieces: 'Des maquettes ou un cahier des charges à joindre ? Par email, en pièce jointe.',
    role: ', développeur web indépendant.',
    lieu: 'Bordeaux. À distance pour toute la France.',
    statut: 'Entrepreneur individuel, ',
    lienLegal: 'SIRET et mentions légales',
  },
  formulaire: {
    nom: 'Votre nom',
    email: 'Votre email',
    emailPlaceholder: 'vous@entreprise.fr',
    url: 'L’adresse de votre site, s’il existe',
    telephone: 'Votre téléphone, si vous préférez qu’on s’appelle',
    facultatif: '(facultatif)',
    projet: 'Votre projet, en quelques lignes',
    projetPlaceholder: 'Ce qui existe déjà, ce qui coince, et pour quand.',
    piege: 'Votre site',
    envoyer: 'Envoyer',
    envoiEnCours: 'Envoi en cours',
    envoye: 'Message envoyé.',
    envoyeDetail: 'Je le lis moi-même et je vous réponds dans la journée, à l’adresse que vous avez donnée.',
    tropDeMessages: 'Trop de messages envoyés. Réessayez dans dix minutes.',
    secours: 'L’envoi a échoué. Écrivez-moi directement à contact@nmwstudios.com.',
  },
  carrousel: { agrandir: 'Agrandir', agrandirTitre: 'Agrandir :', vues: 'Vues' },
  legal: {
    h1: 'Mentions légales.',
    editeur: 'Éditeur',
    statut: 'entrepreneur individuel',
    tva: 'TVA non applicable, article 293 B du CGI',
    directeur: 'Directeur de la publication :',
    contact: 'Contact :',
    hebergement: 'Hébergement',
    telephone: 'Téléphone',
    donnees: 'Données personnelles',
    donneesTexte:
      'Le formulaire de contact transmet votre nom, votre email et votre message, uniquement pour vous répondre. Le site compte ses visites (page vue, pays, adresse IP) sans les céder à personne, et pose un seul cookie, celui de la langue, seulement si vous changez de langue. Pour faire modifier ou supprimer ces données, écrivez à l’adresse ci-dessus.',
  },
  introuvable: {
    h1: ['Cette page', 'n’existe pas.'],
    lead: 'Ou elle n’existe plus. Les cinq écrans du site sont dans le menu.',
    bouton: 'Retour à l’accueil',
  },
  donnees: {
    description: 'Sites, applications et outils métier. Je construis, je reprends l’existant, et j’assure la suite si vous le souhaitez.',
    jobTitle: 'Développeur web indépendant',
    catalogue: 'Prestations',
  },
}
