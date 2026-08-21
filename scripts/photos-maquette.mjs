import { mkdir, writeFile } from 'node:fs/promises'
import sharp from 'sharp'

// Plusieurs requêtes par métier, en anglais : Openverse indexe surtout des titres anglais, et
// le fonds libre est trop mince pour qu'une seule formulation suffise à chaque fois.
const REQUETES = {
  vtc: ['car interior night', 'car interior', 'taxi interior'],
  sante: ['doctor office interior', 'medical office room', 'therapy room chair'],
  restaurant: ['bistro interior table', 'restaurant interior', 'cafe interior'],
  architecte: ['architectural model', 'architecture blueprint desk', 'drawing table architect'],
  etudes: ['technical drawing tools', 'engineering blueprint', 'construction plans desk'],
  formation: ['seminar room', 'training classroom', 'workshop people table'],
  autre: ['office desk minimal', 'workspace laptop desk', 'desk sunlight'],
}
// 20 est le plafond d'une requête anonyme : au delà, l'API rend 401.
const PAGE = 20
const DOSSIER = 'public/maquette'
const LARGEUR_CIBLE = 1400
const LARGEUR_MINIMALE = 1000
// Plafond par image, aligné sur `tests/unit/photos-maquette.test.ts`.
const PLAFOND = 78_000

await mkdir(DOSSIER, { recursive: true })
const lignes = [
  '# Provenance des images de la maquette',
  '',
  'Récupérées par `scripts/photos-maquette.mjs` depuis Openverse, en CC0 ou domaine public',
  'uniquement, donc sans attribution obligatoire. La colonne auteur est de courtoisie.',
  '',
  '| fichier | licence | source | auteur |',
  '|---|---|---|---|',
]

for (const [metier, requetes] of Object.entries(REQUETES)) {
  let choix
  for (const requete of requetes) {
    const url = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(requete)}&license=cc0,pdm&page_size=${PAGE}`
    const reponse = await fetch(url)
    if (!reponse.ok) throw new Error(`${metier} : Openverse rend ${reponse.status}`)
    const { results = [] } = await reponse.json()
    // Licence relue et non supposée, puis la plus large : une image remontée à l'échelle se voit.
    choix = results
      .filter((r) => ['cc0', 'pdm'].includes(r.license) && r.width >= LARGEUR_MINIMALE)
      .sort((a, b) => b.width - a.width)[0]
    if (choix) break
  }
  if (!choix) throw new Error(`${metier} : aucun résultat libre d'au moins ${LARGEUR_MINIMALE} px`)

  const image = await fetch(choix.url)
  if (!image.ok) throw new Error(`${metier} : téléchargement ${image.status}`)
  const brut = Buffer.from(await image.arrayBuffer())
  // Qualité dégressive jusqu'au plafond : une photo dense sort à plus du double d'une photo
  // calme à qualité égale, et c'est le poids servi qui compte, pas le réglage.
  let poids = 0
  for (const qualite of [55, 45, 38, 32, 26]) {
    const { size } = await sharp(brut)
      .resize({ width: Math.min(choix.width, LARGEUR_CIBLE) })
      .avif({ quality: qualite })
      .toFile(`${DOSSIER}/${metier}.avif`)
    poids = size
    if (size <= PLAFOND) break
  }
  if (poids > PLAFOND) throw new Error(`${metier} : ${Math.round(poids / 1024)} ko, au dessus du plafond`)

  lignes.push(
    `| ${metier}.avif | ${choix.license.toUpperCase()} ${choix.license_version ?? ''} | ${choix.foreign_landing_url} | ${choix.creator ?? 'inconnu'} |`
  )
  console.log(`${metier.padEnd(11)} ${String(choix.width).padStart(5)}px  ${String(Math.round(poids / 1024)).padStart(3)} ko  ${choix.license}  ${choix.title?.slice(0, 40)}`)
}

await writeFile(`${DOSSIER}/LICENCES.md`, lignes.join('\n') + '\n')
console.log(`\n${Object.keys(REQUETES).length} images dans ${DOSSIER}, provenance dans LICENCES.md`)
