# Direction visuelle nmwstudios

Arrêtée le 2026-09-09. Elle **remplace intégralement** la direction précédente, bâtie autour
d'un personnage qui se réparait au fil du scroll. Cette direction et tous ses fichiers ont
été détruits le même jour. Ne rien en réintroduire.

## Le principe : un cadre fixe, un menu nommé

La page fait exactement la hauteur de l'écran et ne défile jamais. Cinq écrans, atteints par
un menu toujours visible en haut à droite : Accueil, Ce que je fais, Comment je travaille,
Qui je suis, Contact. On clique, l'écran se transforme sur place. Le visiteur choisit où il
va, il ne fait rien défiler.

Forme validée sur maquette le 2026-09-11, après deux formes rejetées le même jour :
l'enchaînement de huit écrans à la molette, jugé « pas pratique comme moyen de navigation »,
et la carte en deux dimensions. La molette et les flèches restent, en secondaire. Référence
citée par Nathan : usts.ai, cadre fixe, menu nommé, gros titre à gauche, image plein cadre.

Un cadre fixe est composé au pixel près, donc une image générée n'est jamais recadrée au
hasard par la fenêtre du visiteur. C'est le meilleur contenant possible pour de l'imagerie
produite par IA, et c'est exactement ce qui avait échoué avant, où chaque plan perdait son
sujet selon la taille d'écran.

Conséquence directe : **les images et les transitions portent toute la qualité perçue.** Il
n'y a plus de long document pour diluer un plan raté.

## Composition des écrans

Revue le 2026-09-12 après le diagnostic : un gabarit par écran, plus un seul répété.

| Écran | Composition |
|---|---|
| Accueil | titre à l'échelle du cadre, « Vous décidez jusqu'où » en accent, ligne d'identité (nom, métier, ville, l'agence), bouton et email ; en bas du cadre, quatre situations qui sont des portes vers l'offre qui y répond |
| Ce que je fais | titre en phrase et intro, puis cinq cartes visibles : la carte ouverte occupe deux rangées à gauche, les quatre fermées à droite ; une carte fermée devient la carte ouverte (transition partagée). La reprise ouvre par défaut. L'offre applications montre une capture de mon outil de suivi du temps |
| Comment je travaille | la preuve en titre (l'agence, datée), la marque blanche au « vous », les engagements de discrétion ; les trois missions en panneaux à droite ; en bas, la frise des cinq étapes, chacune terminée par ce que le client a en main |
| Qui je suis | nom, parcours daté, phrases de relation, ville et renvoi au SIRET ; FAQ dépliable à droite, un signe « + », une question ouverte à la fois |
| Contact | titre, email en gros, faits d'identité ; formulaire à quatre champs (dont l'adresse du site, facultative), confirmation à la place des champs |

Tous les écrans s'ancrent sur la même ligne haute : le titre et le panneau ne bougent pas
d'un écran à l'autre, et un panneau qui change de hauteur ne fait pas sauter le reste.
Le bouton « Parler de votre projet » est dans la barre sur les cinq écrans, à la même place.

Le texte de chaque écran tient dans le cadre à 1440 × 900 sans rien couper. Sous 720 px de
haut ou de large, l'écran défile à l'intérieur de lui même et la molette lui revient.

## Une matière et une lumière par écran

Cinq photographies plein cadre, très sombres, générées le 2026-09-12 (`tools/gen.mjs`,
sources et essais dans `docs/maquettes/2026-09-12-matiere/`, hors git), converties en WebP
dans `public/fonds/` en 2048 et 1200 px. Pas de métaphore du métier : de la matière.

| Écran | Matière |
|---|---|
| Accueil | l'eau noire, un seul reflet de lune à droite (choisie par Nathan) |
| Ce que je fais | la soie anthracite |
| Comment je travaille | le verre dépoli rétroéclairé |
| Qui je suis | l'ardoise mouillée |
| Contact | la vitre de pluie, lumières en bokeh |

L'image est voilée à gauche pour le titre et en haut pour la barre. Les panneaux de verre
posent une base sombre (`rgba(10,10,15,.42)`) sous la surface blanche, sinon un panneau sur
une zone claire devient illisible. Une bande de cellules (situations, étapes) porte un seul
flou pour tout le conteneur, jamais un flou par cellule : sinon la marche de luminosité entre
deux cellules se lit comme un espace. Les cinq fonds sont préchargés dès le premier écran.

## Ce que le principe impose

- **Une route par écran et par offre, générée statiquement** : `/`, `/ce-que-je-fais`
  (la reprise), `/ce-que-je-fais/<offre>`, `/comment-je-travaille`, `/qui-je-suis`,
  `/contact`, et `/mentions-legales` en document classique. Le texte est dans le HTML de sa route, jamais
  injecté après coup. Voir §15 de la spec.
- **Les transitions passent par l'API View Transitions**, via `<ViewTransition>` de React
  dans Next 16. Sans support navigateur, l'écran change sans animation et tout fonctionne.
  L'historique et le partage d'URL sont natifs, puisque chaque écran est une route.
  **Toute la page est photographiée d'un bloc** (un seul nom, `page`) : un élément nommé
  seul est photographié sans ce qu'il y a derrière lui, donc un panneau de verre y perd son
  flou et un fond nommé passe au-dessus de l'en-tête. La page qui part s'éteint d'abord,
  celle qui arrive s'allume ensuite : un fondu croisé laisse l'ancienne page transparaître.
  Seules les cartes d'offre ont leur propre nom, pour se transformer l'une en l'autre, et
  elles n'ont pas de flou de fond pour cette raison.
- **Aucun écran ne déborde en silence.** Un contenu qui ne tient pas se raccourcit, ou son
  écran défile à l'intérieur de lui même. Jamais de débordement caché.
- **Le cadre fixe ne vaut que pour ces cinq écrans.** Les mentions légales et, plus tard,
  les pages prestation restent des documents classiques qui défilent.

## Thème : « Verre », repris du dashboard

Décidé le 2026-09-11 : le site porte le thème du dashboard (`nmw-studios-dashboard`,
`app/globals.css`), tel quel. Les couleurs posées le 09/09 (fond bleuté, blanc os, ambre)
n'avaient jamais été choisies sur pièce ; Nathan a tranché en désignant le dashboard.

| Jeton | Valeur | Rôle |
|---|---|---|
| `--color-canvas` | `#0a0a0f` | la pièce, fond de page |
| `--color-surface` | `rgba(255,255,255,.045)` | le panneau de verre |
| `--color-foreground` | `#f4f4f7` | texte |
| `--color-muted-foreground` | `#a3a3ae` | texte secondaire |
| `--color-faint` | `#75757f` | étiquettes, lien légal |
| `--color-accent` | `#7aa2ff` | l'action : bouton, lien, filet du menu |
| `--color-accent-2` | `#a878ff` | seulement dans la lumière d'ambiance |
| `--color-border` | `rgba(255,255,255,.09)` | filets |

Ce qui vient avec : la lumière d'ambiance (`--ambient`, quatre dégradés radiaux fixés
derrière tout), le panneau de verre `.panel` avec son liseré-lentille, son ombre et son
`backdrop-filter`, le bouton à lueur, les champs sur `surface`. Sur le site, le panneau porte
ce qui est structuré (cartes, missions, FAQ, formulaire) ; le titre reste du texte nu sur l'image.

À côté du logo, la marque s'écrit **NMW Studios**, en Manrope 600.

## Typographie

- **Manrope partout**, titres en 700 (h1) et 600 (h2, h3), interlettrage serré.
- Les étiquettes (`.eyebrow`) sont en Manrope 600, petites, sans capitales : en mono
  capitales elles se lisaient comme un libellé de champ, pas comme un titre de bloc. IBM
  Plex Mono ne reste que pour les numéros (étapes, compteur d'écran).
- Les classes next/font vont sur `<html>`, jamais sur `<body>`, sinon les variables sont
  vides en silence.

## Mouvement

- **La transition entre écrans et l'ouverture d'une carte sont les seuls moments animés.**
  Rien d'autre ne bouge de soi même. Le fond apparaît en fondu au premier chargement
  seulement ; une image déjà en cache s'affiche nette.
- **`transform` et `opacity` uniquement.** Jamais `top`, `left` ni `width` animés.
- Sous `prefers-reduced-motion`, les transitions deviennent des changements immédiats et le
  défilement amorti est désactivé.
- Sur mobile, la hauteur se mesure en `svh`, jamais en `vh`, à cause de la barre du
  navigateur. L'en-tête tient sur une ligne avec un bouton Menu, le contenu défile entre
  l'en-tête et le pied du cadre (compteur, écran suivant, mentions légales) avec un fondu
  qui dit que ça continue.
