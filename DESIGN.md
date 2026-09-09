# Direction visuelle nmwstudios

Arrêtée le 2026-09-09. Elle **remplace intégralement** la direction précédente, bâtie autour
d'un personnage qui se réparait au fil du scroll. Cette direction et tous ses fichiers ont
été détruits le même jour. Ne rien en réintroduire.

## Le principe : un viewport verrouillé

La page fait exactement la hauteur de l'écran et ne défile jamais. La molette, le clic et les
flèches ne font pas glisser un document : ils traversent un espace dont le contenu se
transforme sur place. Le visiteur parcourt cet espace, il ne le fait pas défiler.

Un cadre fixe est composé au pixel près, donc une image générée n'est jamais recadrée au
hasard par la fenêtre du visiteur. C'est le meilleur contenant possible pour de l'imagerie
produite par IA, et c'est exactement ce qui avait échoué avant, où chaque plan perdait son
sujet selon la taille d'écran.

Conséquence directe : **les animations et les images portent toute la qualité perçue.** Il
n'y a plus de long document pour diluer un plan raté.

## Ce que le principe impose

- **Une route par écran, générée statiquement.** Le viewport verrouillé est une couche de
  présentation, pas une architecture de contenu. Le texte est dans le HTML de sa route,
  jamais injecté après coup. Voir §15 de la spec.
- **L'historique du navigateur est piloté** à chaque transition : le bouton retour marche,
  et un écran se partage par son URL.
- **Aucun écran ne déborde en silence.** Un contenu qui ne tient pas se raccourcit, ou son
  écran défile à l'intérieur de lui même. Jamais de débordement caché.
- **Le viewport verrouillé ne vaut que pour l'accueil.** Les pages prestation restent des
  documents classiques qui défilent, ce sont elles qui portent l'acquisition.

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

- **La transition entre écrans est le seul moment animé.** Rien d'autre ne bouge de soi même.
- **`transform` et `opacity` uniquement.** Jamais `top`, `left` ni `width` animés.
- Sous `prefers-reduced-motion`, les transitions deviennent des changements immédiats et le
  défilement amorti est désactivé.
- Sur mobile, le balayage remplace la molette, et la hauteur se mesure en `svh`, jamais en
  `vh`, à cause de la barre du navigateur.

## Question ouverte

L'espace est-il **linéaire**, la molette avançant d'un écran au suivant, ou **en deux
dimensions**, le visiteur se déplaçant dans une carte ? À trancher avant de coder la coque
de navigation.
