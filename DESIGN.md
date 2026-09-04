---
name: NMW Studios
description: Un mur de lumière grise et grenue, des dalles de verre presque incolores qui compriment ce mur sur leur tranche, et deux surfaces noires par page.
colors:
  # Les seuls jetons déclarés dans @theme, donc les seuls qui produisent une classe Tailwind.
  paper: "#e4e7ec"
  paper-sunken: "#d9dde4"
  ink: "#12151a"
  ink-soft: "#545c67"
  white-bright: "#f2f5f8"
literals:
  # Valeurs écrites en dur dans globals.css. Aucune n'est un jeton : `bg-light-high` ne
  # produirait rien, Tailwind laisse tomber la classe sans erreur.
  light-high: "#f8fafc"
  light-mid: "#eef1f5"
  light-low: "#d3d9e1"
  pill-top: "#2b323d"
  pill-bottom: "#05070a"
  band-top: "#1a1f27"
  band-bottom: "#080a0e"
typography:
  display:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4.6vw, 3.4rem)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "clamp(1.9rem, 4.2vw, 3rem)"
    fontWeight: 800
    lineHeight: 1.03
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.62
    letterSpacing: "normal"
  navigation:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "normal"
  label:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  mesure:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.03em"
  numeral:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "2.6rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.04em"
rounded:
  glass: "26px"          # --radius-glass
  glass-thick: "30px"    # --radius-glass-thick
  pill: "999px"          # littéral
  focus: "4px"           # littéral
easing:
  glass: "cubic-bezier(0.16, 1, 0.3, 1)"   # --ease-glass
spacing:
  serre: "1.25rem"
  bloc: "2.75rem"
  section: "6rem"
  section-large: "8rem"
components:
  pill:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white-bright}"
    rounded: "{rounded.pill}"
    padding: "0.625rem 1.5rem"
    typography: "{typography.navigation}"
  glass:
    textColor: "{colors.ink}"
    rounded: "{rounded.glass}"
    padding: "2rem 1.75rem"
  glass-thick:
    textColor: "{colors.ink}"
    rounded: "{rounded.glass-thick}"
    padding: "3rem 2.75rem"
  glass-dense:
    textColor: "{colors.ink}"
    rounded: "{rounded.glass}"
    padding: "0.625rem 1.5rem"
  band:
    backgroundColor: "{literals.band-bottom}"
    textColor: "{colors.white-bright}"
    padding: "6rem 0"
  link-underline:
    textColor: "{colors.ink}"
    typography: "{typography.title}"
---

# Design System: NMW Studios

## Overview

**Creative North Star: « Le pli »**

Le verre ne floute pas, il plie. Toute la page est un mur de lumière grise et grenue, et
chaque dalle posée dessus comprime ce mur sur sa tranche : c'est à ce pli, et à rien
d'autre, qu'on reconnaît le matériau. Le site refuse l'arrangement par défaut de sa
catégorie, des cartes bordées de gris posées sur un aplat lisse, chacune de la même taille
que sa voisine.

Le monde est sobre par construction : il n'y a aucune couleur. Du gris, du blanc, de l'encre
noire, et deux seules surfaces pleines par page, l'action et le chiffre. Tout le reste est
de la lumière sur du verre. La densité est celle d'un écran de produit, pas d'une plaquette :
une idée par bloc, et de longs intervalles vides entre eux.

Une dalle ne remplace jamais le mur, elle le laisse voir. Une plaque trop opaque efface le
grain, et sans grain il n'y a plus de pli, donc plus de verre : juste une carte blanche.

**Key Characteristics:**

- Un mur continu, dégradé et grenu, jamais un aplat lisse ni un quadrillage.
- Le verre est un matériau qui déforme, pas une décoration floutée.
- Aucune couleur : deux surfaces noires par page, tout le reste en gris et blanc.
- Aucune bordure de carte : la profondeur et l'arête remplacent le trait.
- Le mur est rendu en temps réel : une lumière le balaie une fois à l'arrivée, puis dérive.

## Colors

Aucune teinte. Un gris froid très légèrement bleuté, du blanc pour la lumière, et un noir
d'encre pour ce qui décide.

### Primary

- **`ink`** (#12151a) : le texte, la pastille d'action et la bande du tarif. C'est la seule
  valeur pleine du système, et elle n'apparaît que deux fois par page.
- **`ink-soft`** (#545c67) : le texte secondaire, les notes et les mentions. Un gris froid,
  jamais un gris pur.

### Neutral

- **`paper`** (#e4e7ec) : la base du mur, posée sur `html` et reprise par la barre du
  navigateur mobile.
- **`paper-sunken`** (#d9dde4) : les sections en retrait, appliquées à 70%.
- **`white-bright`** (#f2f5f8) : le texte posé sur les surfaces noires.

Le blanc pur (#ffffff) n'est pas un jeton : il n'est que de la lumière, écrit en `rgb(255 255
255 / …)` dans les dégradés et les arêtes des dalles. Aucun bloc n'est peint en blanc plein.

Les sept valeurs de `literals:` ne sont pas des jetons non plus. #f8fafc, #eef1f5 et #d3d9e1
sont les trois arrêts du champ de lumière du mur ; #2b323d et #05070a les extrémités de la
pastille, #1a1f27 et #080a0e celles de la bande. Elles n'existent qu'à l'intérieur de leurs
dégradés, et écrire `bg-light-high` ne produirait rien.

### Named Rules

**La règle des deux noirs.** Deux surfaces pleines par page au maximum : l'action et le
chiffre. Une troisième, et le noir cesse de vouloir dire « ici ça se décide ».

**La règle du nom réel.** Tout identifiant cité ici, jeton, classe, composant ou attribut,
s'écrit exactement comme dans le code, donc en anglais. La prose reste en français. Tailwind
laisse tomber sans un mot une classe dont le jeton n'existe pas : un document qui nomme
`encre` là où le code dit `ink` produit des classes mortes que la construction ne voit pas.
C'est arrivé trois fois. Le filet `aucune classe utilitaire ne vise un jeton inexistant` les
attrape désormais, mais c'est ici que ça se joue.

**La règle du sans-couleur.** Aucune teinte n'entre dans ce système. Ce qui distingue une
surface d'une autre est sa transparence, son arête et son ombre, jamais son ton.

## Typography

**Display Font :** Schibsted Grotesk (repli system-ui, sans-serif)
**Body Font :** Hanken Grotesk (repli system-ui, sans-serif)

**Character :** un grotesque serré et anguleux pour les titres, posé sur un grotesque
humaniste ouvert pour le corps. Le contraste ne vient pas d'un changement de famille
visible, mais de la graisse et de l'échelle : les titres sont extrêmement gras et très
serrés, le corps est régulier et respirant.

Aucune police monospace. Les chiffres passent par `font-variant-numeric: tabular-nums`
(classe `.figures`) sur le corps de texte : ce sont des mesures, pas un costume technique.

### Hierarchy

- **Display** : le titre de page, un par page.
- **Headline** : les titres de section.
- **Title** (1,5rem) : les titres de plaque.
- **Body** (1,0625rem) : la prose. Mesure tenue à 40rem, soit 70 à 75 signes.
- **Navigation** (0,95rem) : les liens de la barre et le libellé de la capsule.
- **Label** (0,875rem) : les mentions, les notes de bas de bloc et les légendes de dalle.
- **Mesure** (2rem) : les chiffres du relevé, alignés en tabulaire.
- **Numeral** (2,6rem, en `ink-soft/55`) : les numéros d'une séquence, posés hors de la
  plaque qu'ils numérotent. Réservé aux suites où l'ordre porte une information.

### Named Rules

**La règle du sans-surtitre.** Aucune étiquette au-dessus d'un titre. Le titre porte son
propre poids ; une ligne en petites capitales au-dessus est un aveu qu'il ne le porte pas.

**La règle des 6rem.** Aucun texte ne dépasse 6rem, chiffre du tarif compris. La taille
vient du vide autour, pas de la graisse ajoutée.

## Layout

Un conteneur unique de 72rem (`max-w-6xl`), marges de 1,5rem sur téléphone et 2,5rem
au-delà. La prose se resserre à 40rem à l'intérieur de ce conteneur, toujours par la
droite : le bord gauche du document ne bouge jamais.

Le rythme vertical alterne délibérément : une section ouverte sans plaque, une section de
plaques, la bande noire pleine largeur. Deux sections voisines ne partagent jamais la même
famille de composition ; sur les six sections de l'accueil, aucune ne se répète.

Sur les listes appariées (contrepartie et promesse, étapes numérotées), la colonne de
droite se décale de 1,75rem de plus à chaque ligne (`.stagger`), et ce décalage disparaît
sous 768px : sur téléphone, tout revient au bord gauche.

Plus d'espace au-dessus d'un titre qu'en dessous.

## Elevation & Depth

Le système est entièrement fondé sur la déformation et la profondeur : aucune bordure de
carte, aucun filet gris, aucun séparateur plein. Une surface existe parce qu'elle comprime
le mur derrière elle et qu'elle porte une ombre lointaine, pas parce qu'un trait l'entoure.

Le mur est une texture en niveaux de gris, échantillonnée par un shader WebGL dans un canvas
fixe et plein cadre, inséré entre le mur de repli et le contenu (`components/ui/GlassWall.tsx`).
La texture porte des arêtes franches et du détail à haute fréquence : sans elles, la réfraction
n'a rien à plier et le matériau disparaît.

Les deux couches CSS d'origine, le champ de lumière en `body::before` et le grain en
`body::after`, sont conservées. Elles ne sont plus visibles quand le canvas est monté, et
redeviennent le mur du site dès que WebGL est indisponible ou que
`prefers-reduced-transparency` est demandé.

Le déplacement est le matériau, pas un effet. Le shader calcule la distance signée au
rectangle arrondi le plus proche parmi les dalles visibles, lit la normale dans ce champ par
différences finies, et déplace l'échantillon du fond le long de cette normale. Le déplacement
se fait sur deux lobes : le premier pour la face d'entrée, le second plus profond et plus doux
pour la face de sortie. C'est ce second lobe qui fait lire une paroi de matière plutôt qu'une
bordure peinte.

| Réglage | Valeur | Rôle |
| --- | --- | --- |
| `uThick` | 100 | seconde surface, absorption, bande interne, paroi sombre |
| `uAmp` | 15 | amplitude du déplacement, en px |
| `uBevel` | 19 | largeur du biseau, en px |
| `uSpec` | 74 | intensité du liseré spéculaire |
| `uBlur` | 29 | flou derrière la dalle |
| `uVeil` | 5 | voile blanc, lisibilité du texte |
| `uShadow` | 0 | ombre portée, désactivée |

Le bord n'est pas une coupe binaire : la couverture est lissée sur un pixel par
`smoothstep(1.0, -1.0, d)`, sinon les grands rayons se crénellent visiblement.

Aucune dispersion chromatique. Échantillonner les trois canaux à des positions différentes
fabrique de la couleur à partir d'un fond gris, ce que la règle du sans-couleur interdit, et
la mesure la donnait à 1 sur 255 aux réglages retenus. La retirer fait passer le shader de 27
à 9 lectures de texture par pixel.

Le rendu marche sur tous les moteurs. C'est un changement de fond par rapport au filtre SVG
dans `backdrop-filter`, que seul Chromium acceptait : le lecteur sur iPhone ne voyait aucun
pli.

### Shadow Vocabulary

- **Glass** (`inset 0 1.5px 0 white/95, inset 0 -1.5px 0 white/60, inset 0 0 0 1px ink/8, 0 24px 50px -28px ink/50`) :
  arête haute allumée, sous-face qui reprend la lumière, ombre portée basse et très diffuse.
- **Glass thick** (`inset 0 2px 0 white, inset 0 -2px 0 white/70, inset 0 0 0 1px ink/10, 0 40px 80px -34px ink/60`) :
  même grammaire, arête pleine et ombre deux fois plus longue.
- **Pill** (`inset 0 1px 0 white/22, 0 16px 34px -16px ink/60`) : une pastille noire
  posée sur le mur, éclairée sur le dessus.

### Named Rules

**La règle du grain.** Le verre ne se voit que sur ce qu'il déforme. Toute zone qui porte du
verre garde derrière elle le grain du mur ou une arête de contenu ; un aplat lisse sous une
dalle rend le matériau invisible et la dalle redevient une carte.

**La règle de la transparence.** Une dalle laisse voir le grain. Au-delà d'environ 35% de
blanc dans son dégradé, elle l'efface et le pli disparaît. L'exception est la barre de
navigation (`glass-dense`, 74% à 58%), qui doit rester lisible par-dessus du texte.

**La règle du champ partagé.** Il n'existe plus de carte de déplacement par dalle. Le shader
évalue un champ de distance unique sur les dalles visibles, ce qui rend le biseau identique
partout sans dépendre de la taille de chaque surface. Le plafond est de huit dalles
simultanées à l'écran ; au delà, les huit plus grandes sont retenues.

**La règle du centre net.** Aucun flou dans la déclaration finale d'une dalle de contenu.
Un verre flou en son centre est un calque dépoli ; toute la matière est dans la tranche.

**La règle de l'amplitude.** Le déplacement reste sous la largeur du plus fin trait qui passe
derrière une dalle. Au-delà, le trait ne plie pas : il se décale d'un coup sur le contour, et
la zone où deux dalles se recouvrent le décale deux fois. Ni l'opacité, ni le flou, ni un
masque ne rattrapent une amplitude trop forte, ce sont des adoucissements posés sur un défaut
géométrique. La valeur tenue est 15px pour un biseau de 19px.

**La règle de la sortie.** Quand un dessin fin est inévitable derrière une dalle, la dalle
renonce au pli plutôt que de le déchirer (`noFold` sur `<Glass>`), et garde le verre dépoli qui
le floute uniformément. Une seule surface du site en use, le cartouche du premier écran.

**La règle du sans-trait.** Aucune bordure pour délimiter une surface. Les seuls traits du
site sont des filets à 1px en `ink/10` qui séparent des lignes de liste, et une arête en
dégradé qui s'éteint sur ses deux bords, au-dessus du pied de page.

## Shapes

Des rectangles à grands rayons (26px, 30px pour le verre épais) et des capsules parfaitement
rondes pour l'action. L'anneau de focus arrondit son propre tracé à 4px, la seule petite
valeur du système, parce qu'il épouse du texte et non une surface. Rien d'anguleux, rien de
carré. Les rayons imbriqués restent concentriques.

## Components

### Buttons

- **Shape :** capsule pleinement ronde (999px).
- **Primary :** dégradé noir de #2b323d à #05070a, texte #f2f5f8.
- **Hover / Focus :** remontée de 2px en 240ms sur `cubic-bezier(0.16, 1, 0.3, 1)` et ombre
  renforcée. À l'appui, la capsule redescend et se comprime à 98,5%.
- **Secondary :** un lien souligné en encre, filet à 35% à 6px sous la ligne de base, qui
  passe à l'encre pleine au survol. Aucune deuxième capsule sur un même écran : la barre de
  navigation porte la seule capsule de la page, le reste passe par le lien souligné.

### Cards / Containers

- **Corner Style :** 26px, 30px pour le verre épais.
- **Background :** un dégradé à 158° de blanc à 17% vers blanc à 5%, jamais une couleur
  pleine. Le verre épais monte à 28% et 9%.
- **Border :** aucune. Le liseré est un `inset box-shadow`, doublé d'une arête spéculaire
  dessinée en `::after` masqué.

### Navigation

Une barre de verre flottante, collée en haut (`sticky top-0`), détachée des bords par le
conteneur. Le sigle à gauche, les liens en encre douce, la capsule noire à droite. Sous
640px, le nom écrit et le lien secondaire disparaissent : il reste le sigle et l'action, sur
une seule ligne, et elle ne quitte jamais le pouce.

C'est la seule surface du site à porter un flou (`blur={18}`) : elle passe sur du texte.

### La bande (composant signature)

La seule surface pleine et pleine largeur du site, un dégradé noir à 168° doublé d'une
lumière rasante en haut à gauche. Le verre posé dessus change de peau : il descend à blanc
22% puis 7%, parce qu'une dalle prend la lumière de ce qu'elle touche. C'est la rupture de
rythme obligatoire de chaque page.

### Le filigrane du cartouche

Le sigle NMW, en `ink/8`, flouté d'un pixel, posé sous les deux dalles du premier écran de
l'accueil. C'est le seul endroit du site où la marque est grande, et elle est sous la plaque qui
porte le nom de l'agence. C'est aussi ce que la tranche du verre a à plier, en plus du grain.

Ses deux dalles sont les seules du site à renoncer à la réfraction : sous une tranche, les traits
du sigle se décalaient d'un bloc sur le contour au lieu de plier, et ça se voyait à toutes les
densités d'écran. Le verre dépoli les floute uniformément, sans marche. Voir la règle de la
sortie.

## Motion

Trois gestes, et rien d'autre. Tout passe par `transform`, `opacity` et `clip-path`, et tout
est gardé derrière `prefers-reduced-motion`, `scroll-behavior: smooth` compris : une ancre est
un mouvement comme un autre.

Deux registres de durée, à ne pas confondre. Un retour d'interaction reste sous 240ms, sinon il
traîne derrière le curseur : c'est le cas de `.pill`, `.link-underline`, `.field` et
`.skip-link`. Une entrée que personne n'a déclenchée peut durer, et `.enter` prend 620ms. La
courbe est toujours `--ease-glass`, `cubic-bezier(0.16, 1, 0.3, 1)`, jamais `ease-in-out`.

- **`.enter`** : l'entrée au chargement, 620ms, cascade de 110ms par `--rank`. Réservée au
  premier écran.
- **`.rise`** : la montée au défilement, en `animation-timeline: view()`, sans écouteur de
  défilement. Sous un moteur qui ne connaît pas les lignes de temps de défilement, la règle
  n'est jamais appliquée et le contenu est simplement visible.
- **`.fill`** et **`.reveal`** : le rail d'une séquence qui se remplit sur sa traversée,
  et le chiffre du tarif qui s'ouvre par la gauche. Un seul de chacun par site.

Le `.sheen` est la seule boucle : une bande de lumière très lente sur les dalles épaisses,
en transform pur.

### Named Rules

**La règle du geste motivé.** Une animation dit une hiérarchie, une séquence, un retour ou
un changement d'état. Si elle ne dit rien de cela, elle ne se pose pas.

**La règle de la boucle silencieuse.** Le rendu du mur passe par une boucle
`requestAnimationFrame`, seule façon de nourrir un shader, mais elle ne redessine que si
l'état a changé : une dalle a bougé, la fenêtre a été redimensionnée, ou le pointeur s'est
déplacé. Une image identique à la précédente n'est jamais redessinée. Tout le reste du
mouvement du site continue de passer par les lignes de temps CSS, sans écouteur `scroll` ni
`IntersectionObserver`.

## Do's and Don'ts

### Do:

- **Do** poser toute nouvelle surface en verre : dégradé à 158°, `data-glass` pour que
  `GlassWall` la prenne en compte, liseré interne, ombre portée basse. Le grain du mur doit rester
  visible à travers la dalle, et se comprimer sur sa tranche.
- **Do** tirer tout texte secondaire de l'encre douce, `ink-soft` (#545c67), jamais d'un gris pur.
- **Do** varier la famille de composition d'une section à la suivante, et rompre une fois
  par page avec la bande noire pleine largeur.
- **Do** thématiser les surfaces du navigateur : sélection en encre pleine, anneau de focus
  en encre, barre de défilement en encre à 32%, couleur de barre d'adresse en papier.
- **Do** aligner les chiffres avec `.figures` dès qu'ils se lisent comme des mesures.
- **Do** écrire toute classe du système dans `@layer base` ou `@layer components`. Hors
  couche, elle bat les utilitaires Tailwind et un `absolute` posé sur une dalle est
  silencieusement annulé.

### Don't:

- **Don't** poser une dalle de verre sur un aplat lisse : sans grain ni arête derrière, la
  déformation n'existe pas à l'écran.
- **Don't** opacifier une dalle jusqu'à effacer le grain. Une dalle opaque est une carte.
- **Don't** empiler trois dalles transparentes : les voiles blancs s'additionnent et le tas
  redevient un bloc blanc.
- **Don't** monter le déplacement au-delà de la largeur des traits qui passent derrière une
  dalle. Voir la règle de l'amplitude.
- **Don't** poser une étiquette en petites capitales au-dessus d'un titre.
- **Don't** entourer une plaque d'une bordure, ni séparer deux sections par un trait plein.
- **Don't** introduire une couleur, même en accent. Le système n'en a aucune.
- **Don't** peindre une troisième surface en noir plein sur une même page.
- **Don't** aligner trois plaques de même taille et de même densité pour structurer une
  page : c'est l'arrangement que ce monde refuse.
- **Don't** poser une trame régulière, un quadrillage ou un filet répété en fond. Le mur est
  un champ continu, et sa matière est le grain.
- **Don't** dépasser 6rem de corps typographique, chiffre du tarif compris.
