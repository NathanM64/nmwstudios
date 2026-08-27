# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Le directeur d'une agence de communication ou de web sans équipe technique, en France.
Il a vendu un projet ou hérité d'un existant, il n'a personne pour le porter, et il arrive
sur le site avec deux peurs : que le prestataire se montre devant son client, et qu'on lui
annonce que tout est à refaire. Il lit souvent sur mobile, en fin de journée, entre deux
dossiers. Aucune autre audience n'est visée : ni client final, ni recruteur, ni pair
technique.

## Product Purpose

Vendre de la sous-traitance en marque blanche à des agences, sous trois formes : renfort à
la journée, projet complet, reprise et maintenance d'un existant. La troisième porte le
poids commercial, c'est celle qui dure.

Le site réussit quand un directeur d'agence écrit à `contact@nmwstudios.com`. L'email est
le chemin principal et assumé comme tel ; le téléphone existe en second. Aucun formulaire,
qui exigerait un service tiers, donc un script et un cookie.

## Positioning

La marque blanche est vérifiable, pas seulement promise. Chaque engagement porte sa
contrepartie négative écrite (`content/engagements.ts`), la discrétion est prouvée par
l'absence totale de nom de client sur le site, et les conditions de vente portent ce que
d'autres disent au téléphone. Un seul chiffre est affiché, 500 € la journée, identique
pour les trois modes : ce que l'agence achète est un nombre de jours, jamais un forfait
déguisé.

La promesse technique se vérifie dans le navigateur : site statique, aucun domaine tiers,
aucun cookie, hébergement sur serveur propre. Un concurrent peut copier la phrase, pas la
CSP qui la verrouille.

## Operating Context

L'agence garde la relation client, ses outils et sa méthode ; le travail se fait dedans,
sous son nom. L'entrée en relation passe par un accord de confidentialité signé avant
ouverture du projet. Les missions de reprise commencent par un état des lieux écrit :
démarrage du projet sur une machine neuve, reprise des accès et de l'historique au nom de
l'agence, tri entre ce qui casse, ce qui est risqué et ce qui est seulement laid, puis
restitution ordonnée avec une estimation en jours par ligne (`content/semaines.ts`).

Trois critères décident d'un oui : code source accessible en entier, projet capable de
redémarrer sur une machine neuve, hébergement et nom de domaine transférables au nom de
l'agence.

## Capabilities and Constraints

- Deux pages portent le message : l'accueil et « Reprise et maintenance ». Les mentions
  légales et la 404 complètent. Pas de blog, pas de formulaire, aucun service tiers.
- Next 16 en `output: 'export'` : pas de route dynamique, pas de middleware, pas de lecture
  de requête. Toute page ajoutée est rendue à la construction et servie par Caddy depuis une
  image sans Node.
- La CSP du `Caddyfile` interdit tout domaine tiers. Une police distante, une analytique ou
  une carte casserait à la fois la règle et l'argument central.
- Les technologies citées (Symfony, PHP sans framework, React ancien, WordPress sur mesure)
  sont des exemples de reconnaissance, jamais une borne de compétence.
- TJM de 500 €, dans `lib/legal.ts`. Le mensuel est décrit comme une enveloppe de jours
  convenue à l'avance, résiliable ; toute journée supplémentaire est validée par écrit,
  jamais absorbée.

Décisions produit encore ouvertes, à ne pas inventer :

- Le TJM s'affiche-t-il seul ou avec une mention « à partir de ».
- Le délai de réponse réellement tenable, retiré du bloc contact faute de pouvoir être
  vérifié.
- La preuve manquante du quatrième travail, la plateforme d'impression 3D.
- L'hébergeur des mentions légales, à confirmer quand le serveur `infra` sera en service.
- La liste des technologies reprises, à compléter si Laravel, Vue, Drupal ou Node doivent y
  figurer.
- `RENDEZ_VOUS` reste vide : la prise de rendez-vous en ligne n'est pas retenue comme
  chemin principal. Le bouton ne s'affiche pas tant que la chaîne est vide.

Surfaces prévues, dans cet ordre, quand les deux pages actuelles conviennent : une page
Contact, puis une page de travaux anonymisés développant `content/travaux.ts`. La page
« Comment je travaille » n'est pas retenue.

## Brand Commitments

NMW Studios, exploité par Marimbordes Nathan Julien, entrepreneur individuel (SIRET
99316693300016, Bègles). Le logo signe l'en-tête, le pied de page et l'icône d'onglet
(`components/ui/Logo.tsx`, `app/icon.svg`).

Voix : première personne, phrases courtes, vocabulaire de contrat plutôt que de plaquette.
Le site dit ce qu'il ne fait pas avant de dire ce qu'il fait. Jamais de tiret cadratin dans
le texte affiché. Tout le contenu est en français.

Interdits permanents : aucun nom de client, aucun logo client, aucun témoignage nommé, ni
sur le site ni en rendez-vous. Aucune affirmation de performance à maintenir à la main,
type score Lighthouse.

## Evidence on Hand

- Quatre travaux réels, anonymisés au secteur et à la technique (`content/travaux.ts`).
  Trois portent une preuve, affichée en gras sous la description : reprise d'un jeu concours
  écrit en PHP par un autre, sans base de données, avec base et backoffice complet ajoutés,
  plus de 100 000 joueurs en un mois ; application iPad hors ligne pour un émetteur
  international de cartes de paiement, en production et maintenue depuis deux ans ;
  backoffice de création de campagnes de jeux pour une agence marketing, toujours en service
  et enrichi au fil des campagnes. Le quatrième, la plateforme industrielle de pilotage de
  l'impression 3D, n'a pas de preuve datée et n'en reçoit pas d'inventée.

  L'événement de la campagne de jeu concours n'est pas cité : le volume convainc, l'événement
  identifierait le client.
- Preuves vérifiables par le visiteur : absence de requête tierce, absence de cookie,
  hébergement sur serveur propre.
- Mentions légales complètes dans `lib/legal.ts`.

Il n'existe aucun témoignage, aucune étude de cas, aucune référence nommée, aucun chiffre
d'audience et aucun logo client. Rien de tout cela ne doit être fabriqué, y compris sous
forme de silhouette ou de placeholder.

## Product Principles

1. **La contrepartie avant la promesse.** Ce qu'un prestataire ne fera pas est l'information
   que le lecteur cherche en premier ; elle est écrite, jamais sous-entendue.
2. **Un seul chiffre.** L'agence achète des jours. Toute construction tarifaire qui brouille
   ce compte est refusée, même si elle rassure à la lecture.
3. **Prouvable dans le navigateur.** Une affirmation technique n'est publiée que si la page
   elle-même la démontre ou qu'un test la protège.
4. **La discrétion est de la matière, pas du vide.** L'anonymat s'accompagne toujours d'assez
   de substance pour qu'on ne lise pas « il débute ».
5. **Le harnais ne pèse pas plus que le site.** Ce dépôt a été rasé une fois pour
   sur-ingénierie ; toute addition doit prévenir une casse silencieuse réelle.

## Accessibility & Inclusion

Objectif WCAG 2.2 AA, tenu par le code : contrastes, focus visible, navigation clavier,
sémantique et libellés de lien explicites. Aucune obligation contractuelle ni audit formel
n'est en jeu, aucun client public n'est visé ; la norme sert de niveau de référence, pas de
livrable à certifier.

Lecture réelle attendue sur mobile, en conditions pressées : longueur de ligne, taille de
corps et cibles tactiles sont traitées comme des exigences produit.
