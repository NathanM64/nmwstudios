'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { Configuration } from '@/lib/config/devis'
import type { DomaineId } from '@/lib/config/domaines'
import type { Geste } from '@/lib/config/styles'
import { ANCRE_DE_TETE, SCENES, type AncreId, type SceneId } from '@/lib/config/scenes'
import { partiesActives, positionCible, type Bornes, type Cible, type Mesures } from '@/lib/config/defilement'
import { SceneSite } from '@/components/config/scenes/SceneSite'
import { ScenePreuve } from '@/components/config/scenes/ScenePreuve'
import { SceneDeroule } from '@/components/config/scenes/SceneDeroule'

// Mesurer avant la peinture évite un saut ; `useLayoutEffect` n'existe pas au rendu serveur.
const useEffetDeMiseEnPage = typeof window === 'undefined' ? useEffect : useLayoutEffect

const VIDE: Mesures = { offsets: {}, hauteurDocument: 0, hauteurFenetre: 0 }

const PREFIXE_PARTIE = 'partie-'

export function DocumentMaquette({
  config,
  domaine,
  geste,
  cible,
}: {
  config: Configuration
  domaine: DomaineId
  cible: Cible
  geste: Geste
}) {
  const rouleauRef = useRef<HTMLDivElement>(null)
  const [mesures, setMesures] = useState<Mesures>(VIDE)
  const [bornes, setBornes] = useState<Bornes>({})

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
      // Les parties se repèrent par leur `data-testid`, seul marqueur qu'elles portent.
      const prises: Bornes = {}
      for (const el of rouleau.querySelectorAll<HTMLElement>(`[data-testid^="${PREFIXE_PARTIE}"]`)) {
        const rect = el.getBoundingClientRect()
        prises[el.dataset.testid!.slice(PREFIXE_PARTIE.length) as SceneId] = {
          haut: (rect.top - haut) / echelle,
          bas: (rect.bottom - haut) / echelle,
        }
      }
      setBornes(prises)
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

  const position = positionCible(cible, mesures, bornes)
  // Avant la première mesure la fenêtre est haute de zéro et aucune partie ne la croise :
  // sans ce repli, le premier rendu serait intégralement inerte.
  const actives = new Set(
    mesures.hauteurFenetre > 0 ? partiesActives(bornes, position, mesures.hauteurFenetre) : SCENES.map((s) => s.id)
  )
  // Décalages publiés : la position posée ne dit pas quelle ancre elle vise, et c'est le seul
  // relevé sur lequel un filet peut juger qu'une mesure a vieilli.
  const releve = Object.fromEntries(Object.entries(mesures.offsets).map(([a, o]) => [a, Math.round(o!)]))

  return (
    <div
      ref={rouleauRef}
      data-testid="rouleau"
      data-mesures={JSON.stringify(releve)}
      className="maquette-rouleau"
      style={{ translate: `0 ${-position}px` }}
    >
      <div
        data-testid="partie-site"
        data-ancre={ANCRE_DE_TETE.site}
        inert={!actives.has('site')}
        className="maquette-partie"
      >
        <SceneSite config={config} domaine={domaine} geste={geste} />
      </div>

      {SCENES.slice(1).map((partie, i) => (
        <div
          key={partie.id}
          data-testid={`partie-${partie.id}`}
          data-ancre={ANCRE_DE_TETE[partie.id]}
          inert={!actives.has(partie.id)}
          className="maquette-partie"
        >
          <div className="m-marge m-contenu flex shrink-0 items-baseline gap-3">
            <p className="m-surtitre">{partie.libelle}</p>
            <span className="m-filet h-px flex-1" />
          </div>
          {i === 0 ? <ScenePreuve config={config} domaine={domaine} /> : <SceneDeroule config={config} />}
        </div>
      ))}
    </div>
  )
}
