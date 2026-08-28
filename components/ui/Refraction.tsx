'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

// La carte se calcule à la taille de chaque dalle. Étirée depuis une carte unique, le biseau
// serait large d'un côté et étroit de l'autre, et la trame se dédoublerait au lieu de se
// comprimer. 360px de côté suffisent : la carte est ensuite étirée sans que le pli bouge.
const RESOLUTION_MAX = 360

type Marques = { brands?: { brand: string }[] }

// Chromium est le seul à accepter un filtre SVG dans backdrop-filter. Ailleurs, la classe
// garde son verre dépoli plutôt qu'un rectangle transparent sans matière.
function accepteLeFiltre() {
  const marques = (navigator as Navigator & { userAgentData?: Marques }).userAgentData
  return Boolean(marques?.brands?.some((m) => m.brand === 'Chromium'))
}

// Distance signée au bord d'un rectangle arrondi : négative dedans, nulle sur l'arête.
function champDistances(l: number, h: number, r: number) {
  const champ = new Float32Array(l * h)
  const demiL = l / 2
  const demiH = h / 2
  for (let y = 0; y < h; y++) {
    const py = Math.abs(y + 0.5 - demiH) - (demiH - r)
    for (let x = 0; x < l; x++) {
      const px = Math.abs(x + 0.5 - demiL) - (demiL - r)
      champ[y * l + x] =
        Math.min(Math.max(px, py), 0) + Math.hypot(Math.max(px, 0), Math.max(py, 0)) - r
    }
  }
  return champ
}

// Le rouge encode le décalage horizontal, le vert le vertical, 128 veut dire « ne bouge pas ».
function carteDeplacement(largeur: number, hauteur: number, rayonCss: number, biseauCss: number) {
  const facteur = Math.min(1, RESOLUTION_MAX / Math.max(largeur, hauteur))
  const l = Math.max(8, Math.round(largeur * facteur))
  const h = Math.max(8, Math.round(hauteur * facteur))
  const r = Math.min(rayonCss * facteur, Math.min(l, h) / 2)
  const biseau = Math.max(1, biseauCss * facteur)

  const toile = document.createElement('canvas')
  toile.width = l
  toile.height = h
  const contexte = toile.getContext('2d')
  if (!contexte) return null

  const champ = champDistances(l, h, r)
  const image = contexte.createImageData(l, h)
  const octets = image.data

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < l; x++) {
      const i = y * l + x
      const d = champ[i]
      let rouge = 128
      let vert = 128
      const u = (d + biseau) / biseau
      if (d < 0 && u > 0) {
        // La normale sortante se lit sur le champ lui-même : dans ce sens la tranche aspire
        // le dehors et le comprime contre le bord, dans l'autre elle creuse un vide.
        const gx = champ[y * l + Math.min(l - 1, x + 1)] - champ[y * l + Math.max(0, x - 1)]
        const gy = champ[Math.min(h - 1, y + 1) * l + x] - champ[Math.max(0, y - 1) * l + x]
        const norme = Math.hypot(gx, gy)
        if (norme > 1e-6) {
          const force = Math.pow(Math.min(1, u), 1.7)
          rouge = 128 + 127 * (gx / norme) * force
          vert = 128 + 127 * (gy / norme) * force
        }
      }
      const j = i * 4
      octets[j] = Math.round(rouge)
      octets[j + 1] = Math.round(vert)
      octets[j + 2] = 255
      octets[j + 3] = 255
    }
  }

  contexte.putImageData(image, 0, 0)
  return toile.toDataURL('image/png')
}

// Un seul composant client pour tout le site : les dalles restent des composants serveur et
// se signalent par data-verre.
export function Refraction() {
  // Le layout survit au changement de page, pas les dalles : sans cette dépendance, les
  // filtres restent accrochés au DOM de la page précédente et le verre perd son pli.
  const chemin = usePathname()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-transparency: reduce)').matches) return
    if (!accepteLeFiltre()) return

    const NS = 'http://www.w3.org/2000/svg'
    const hote = document.createElementNS(NS, 'svg')
    hote.setAttribute('aria-hidden', 'true')
    hote.setAttribute('width', '0')
    hote.setAttribute('height', '0')
    hote.style.position = 'fixed'
    hote.style.pointerEvents = 'none'
    document.body.appendChild(hote)

    const dalles = Array.from(document.querySelectorAll<HTMLElement>('[data-verre]'))
    const observateurs: ResizeObserver[] = []

    dalles.forEach((dalle, rang) => {
      const identifiant = `pli-${rang}`
      const filtre = document.createElementNS(NS, 'filter')
      filtre.setAttribute('id', identifiant)
      filtre.setAttribute('filterUnits', 'userSpaceOnUse')
      filtre.setAttribute('primitiveUnits', 'userSpaceOnUse')
      filtre.setAttribute('color-interpolation-filters', 'sRGB')

      const carte = document.createElementNS(NS, 'feImage')
      carte.setAttribute('result', 'carte')
      carte.setAttribute('preserveAspectRatio', 'none')

      // Une surface qui passe sur du texte doit le brouiller avant de le plier, sinon les
      // deux lectures se superposent. Le flou entre dans la chaîne, pas dans la déclaration.
      const flou = Number(dalle.dataset.verreFlou ?? 0)
      const brouillage = document.createElementNS(NS, 'feGaussianBlur')
      brouillage.setAttribute('in', 'SourceGraphic')
      brouillage.setAttribute('stdDeviation', String(flou))
      brouillage.setAttribute('result', 'fond')

      const deplacement = document.createElementNS(NS, 'feDisplacementMap')
      deplacement.setAttribute('in', flou > 0 ? 'fond' : 'SourceGraphic')
      deplacement.setAttribute('in2', 'carte')
      deplacement.setAttribute('xChannelSelector', 'R')
      deplacement.setAttribute('yChannelSelector', 'G')

      filtre.append(carte)
      if (flou > 0) filtre.appendChild(brouillage)
      filtre.appendChild(deplacement)
      hote.appendChild(filtre)

      let derniereTaille = ''
      const mesurer = () => {
        const rect = dalle.getBoundingClientRect()
        const largeur = Math.round(rect.width)
        const hauteur = Math.round(rect.height)
        if (largeur < 32 || hauteur < 32) return
        const taille = `${largeur}x${hauteur}`
        if (taille === derniereTaille) return
        derniereTaille = taille

        const rayon = parseFloat(getComputedStyle(dalle).borderTopLeftRadius) || 0
        // Le biseau vaut 16% du petit côté, borné à 34px. Le déplacement ne prend que 18%
        // de ce biseau : au-delà il dépasse la largeur d'un trait fin passant derrière la
        // dalle, et le trait se coupe net au lieu de plier. Mesuré à 34px de déplacement,
        // le sigle du cartouche se déchirait ; à 6px il plie.
        const biseau = Math.min(34, Math.min(largeur, hauteur) * 0.16)
        const maximum = biseau * 0.18
        const donnees = carteDeplacement(largeur, hauteur, rayon, biseau)
        if (!donnees) return

        // La région déborde la dalle : sans cette marge, la tranche ramène du vide et laisse
        // une bande grise le long du bord.
        const marge = Math.ceil(maximum * 2 + 8)
        filtre.setAttribute('x', String(-marge))
        filtre.setAttribute('y', String(-marge))
        filtre.setAttribute('width', String(largeur + marge * 2))
        filtre.setAttribute('height', String(hauteur + marge * 2))
        carte.setAttribute('x', '0')
        carte.setAttribute('y', '0')
        carte.setAttribute('width', String(largeur))
        carte.setAttribute('height', String(hauteur))
        carte.setAttribute('href', donnees)
        // 128 sur 255 ne vaut pas exactement la moitié : l'échelle reprend le pas réel.
        deplacement.setAttribute('scale', String((maximum * 255) / 127))
        dalle.style.backdropFilter = `url(#${identifiant})`
      }

      mesurer()
      const observateur = new ResizeObserver(mesurer)
      observateur.observe(dalle)
      observateurs.push(observateur)
    })

    return () => {
      observateurs.forEach((observateur) => observateur.disconnect())
      dalles.forEach((dalle) => {
        dalle.style.backdropFilter = ''
      })
      hote.remove()
    }
  }, [chemin])

  return null
}
