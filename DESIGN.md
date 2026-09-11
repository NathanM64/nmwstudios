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

Deux colonnes sur bureau, texte à gauche, la colonne de droite change de nature selon
l'écran.

| Écran | Gauche | Droite |
|---|---|---|
| Accueil | accroche, sous-titre, bouton | les trois situations |
| Ce que je fais | liste des cinq offres | détail de l'offre choisie, une URL par offre |
| Comment je travaille | les cinq étapes | la marque blanche et les trois missions |
| Qui je suis | nom, paragraphe, la question « vous êtes seul » | FAQ dépliable, une question à la fois |
| Contact | titre, phrase | formulaire à trois champs |

Le texte de chaque écran tient dans le cadre à 1440 × 900 sans rien couper. Sous 720 px,
les colonnes s'empilent et l'écran défile à l'intérieur de lui même.

## Ce que le principe impose

- **Une route par écran et par offre, générée statiquement** : `/`, `/ce-que-je-fais`,
  `/ce-que-je-fais/<offre>`, `/comment-je-travaille`, `/qui-je-suis`, `/contact`, et
  `/mentions-legales` en document classique. Le texte est dans le HTML de sa route, jamais
  injecté après coup. Voir §15 de la spec.
- **Les transitions passent par l'API View Transitions**, via `<ViewTransition>` de React
  dans Next 16. Sans support navigateur, l'écran change sans animation et tout fonctionne.
  L'historique et le partage d'URL sont natifs, puisque chaque écran est une route.
- **Aucun écran ne déborde en silence.** Un contenu qui ne tient pas se raccourcit, ou son
  écran défile à l'intérieur de lui même. Jamais de débordement caché.
- **Le cadre fixe ne vaut que pour ces cinq écrans.** Les mentions légales et, plus tard,
  les pages prestation restent des documents classiques qui défilent.

## Jetons

| Jeton | Valeur | Origine |
|---|---|---|
| `--bg` | `#0A0C0F` | fond de page |
| `--ink` | `#14161C` | noir du logo |
| `--paper` | `#EDE9E0` | blanc os du logo |
| `--graphite` | `#2A2E35` | séparateurs, surfaces secondaires |
| `--amber` | `#F0A93B` | accent d'action, **provisoire** |

Les deux premières couleurs viennent du logo et ne bougeront pas. **L'accent est provisoire** :
il avait été dérivé du personnage supprimé et devra être rechoisi avec le monde visuel de la
nouvelle direction. Un seul accent, réservé à ce qui appelle une action.

## Typographie

- **Titres : Space Grotesk.** Technique et caractérisée, tient les grandes tailles.
- **Corps : Inter.** Neutre, très lisible en français.
- Les classes next/font vont sur `<html>`, jamais sur `<body>`, sinon les variables sont
  vides en silence.

## Mouvement

- **La transition entre écrans et le changement de détail sont les seuls moments animés.**
  Rien d'autre ne bouge de soi même.
- **`transform` et `opacity` uniquement.** Jamais `top`, `left` ni `width` animés.
- Sous `prefers-reduced-motion`, les transitions deviennent des changements immédiats et le
  défilement amorti est désactivé.
- Sur mobile, la hauteur se mesure en `svh`, jamais en `vh`, à cause de la barre du
  navigateur.
