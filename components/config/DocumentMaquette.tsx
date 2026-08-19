'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { Configuration } from '@/lib/config/devis'
import type { DomaineId } from '@/lib/config/domaines'
import { SCENES, type AncreId } from '@/lib/config/scenes'
import { positionCible, type Cible, type Mesures } from '@/lib/config/defilement'
import { SceneSite } from '@/components/config/scenes/SceneSite'
import { ScenePreuve } from '@/components/config/scenes/ScenePreuve'
import { SceneDeroule } from '@/components/config/scenes/SceneDeroule'

// Mesurer avant la peinture évite un saut ; `useLayoutEffect` n'existe pas au rendu serveur.
const useEffetDeMiseEnPage = typeof window === 'undefined' ? useEffect : useLayoutEffect

const VIDE: Mesures = { offsets: {}, hauteurDocument: 0, hauteurFenetre: 0 }

export function DocumentMaquette({
  config,
  domaine,
  cible,
}: {
  config: Configuration
  domaine: DomaineId
  cible: Cible
}) {
  const rouleauRef = useRef<HTMLDivElement>(null)
  const [mesures, setMesures] = useState<Mesures>(VIDE)

  useEffetDeMiseEnPage(() => {
    const rouleau = rouleauRef.current
    if (!rouleau) return

    const mesurer = () => {
      const fenetre = rouleau.closest('.cadre-maquette') as HTMLElement | null
      const page = rouleau.parentElement!
      const echelle = parseFloat(getComputedStyle(page).scale) || 1
      // Différence de rectangles divisée par l'échelle, et non `offsetTop` : le parent de
      // positionnement d'une ancre n'est pas garanti être le rouleau.
      const haut = rouleau.getBoundingClientRect().top
      const offsets: Mesures['offsets'] = {}
      for (const el of rouleau.querySelectorAll<HTMLElement>('[data-ancre]')) {
        offsets[el.dataset.ancre as AncreId] = (el.getBoundingClientRect().top - haut) / echelle
      }
      setMesures({
        offsets,
        hauteurDocument: rouleau.offsetHeight,
        hauteurFenetre: fenetre ? fenetre.clientHeight / echelle : 0,
      })
    }

    mesurer()
    const observateur = new ResizeObserver(mesurer)
    observateur.observe(rouleau)
    // Une ancre se déplace sans que le rouleau change de taille : chaque partie est épinglée à
    // la hauteur de la fenêtre, et c'est un bloc élastique en son sein qui absorbe l'écart.
    // Changer de direction de style ou de langue passe ainsi par la taille d'un porteur d'ancre,
    // jamais par une prop de ce composant.
    for (const el of rouleau.querySelectorAll('[data-ancre]')) observateur.observe(el)
    // Une animation d'entrée translate son bloc : un rectangle lu pendant qu'elle court situe
    // l'ancre là où elle passe, pas là où elle se pose. `animationend` remonte jusqu'ici, y
    // compris pour les blocs qui se remontent sans que ce composant se rende, comme la langue.
    rouleau.addEventListener('animationend', mesurer)
    // La fenêtre change de hauteur avec sa colonne, pas seulement avec le contenu.
    window.addEventListener('resize', mesurer)
    return () => {
      observateur.disconnect()
      rouleau.removeEventListener('animationend', mesurer)
      window.removeEventListener('resize', mesurer)
    }
  }, [config, domaine])

  const position = positionCible(cible, mesures)
  // Décalages publiés : tant qu'aucun repère ne vise une ancre interne, une mesure périmée ne
  // se verrait nulle part, et rien ne dirait que la Task 4 part d'un relevé faux.
  const releve = Object.fromEntries(Object.entries(mesures.offsets).map(([a, o]) => [a, Math.round(o!)]))

  return (
    <div
      ref={rouleauRef}
      data-testid="rouleau"
      data-mesures={JSON.stringify(releve)}
      className="maquette-rouleau"
      style={{ translate: `0 ${-position}px` }}
    >
      <div data-testid="partie-site" data-ancre="site-haut" className="maquette-partie">
        <SceneSite config={config} domaine={domaine} />
      </div>

      {SCENES.slice(1).map((partie, i) => (
        <div
          key={partie.id}
          data-testid={`partie-${partie.id}`}
          data-ancre={`${partie.id}-haut`}
          className="maquette-partie"
        >
          <div className="m-marge flex shrink-0 items-baseline gap-3">
            <p className="m-surtitre">{partie.libelle}</p>
            <span className="m-filet h-px flex-1" />
          </div>
          {i === 0 ? <ScenePreuve config={config} domaine={domaine} /> : <SceneDeroule config={config} />}
        </div>
      ))}
    </div>
  )
}
