'use client'

import { memo, useEffect, useRef } from 'react'
import { CarteOption } from '@/components/config/CarteOption'
import { GROUPES, OPTIONS, type GroupeId } from '@/lib/config/catalogue'
import type { Configuration } from '@/lib/config/devis'
import { sceneDeOption, type SceneId } from '@/lib/config/scenes'

/** Ligne de lecture, en part de la hauteur de fenêtre : le groupe qui la franchit est celui
 *  qu'on est en train de lire, et c'est aussi là que se cale son en-tête collant. */
const LIGNE_DE_LECTURE = 0.3

/** Un choix délibéré gagne pendant ce délai. Cocher une option amène sa scène, mais fait aussi
 *  défiler le panneau jusqu'à la carte, jusqu'à trois fois : mise en vue, focus, puis
 *  réancrage du navigateur après le rendu. Sans cette suspension, ce défilement subi
 *  reprendrait la main sur le choix qui vient de l'émettre. */
const SUSPENSION_MS = 500

export const PanneauOptions = memo(function PanneauOptions({
  config,
  onChange,
  onScene,
  onLecture,
}: {
  config: Configuration
  onChange: (config: Configuration) => void
  onScene: (scene: SceneId) => void
  onLecture: (lecture: { groupe: GroupeId; progression: number }) => void
}) {
  const racineRef = useRef<HTMLDivElement>(null)
  const dernierGroupe = useRef<GroupeId | null>(null)
  const derniereProgression = useRef<number | null>(null)
  const releve = useRef<() => void>(() => {})
  const suspenduJusqua = useRef(0)
  const rattrapage = useRef(0)

  // Le rattrapage resynchronise la référence à la fin de la fenêtre : cocher une option
  // quantifiable change la hauteur du groupe sans qu'aucun défilement ne soit émis, et l'écart
  // passerait sinon pour une lecture du visiteur au premier défilement suivant.
  const suspendreLeReleve = () => {
    suspenduJusqua.current = Date.now() + SUSPENSION_MS
    clearTimeout(rattrapage.current)
    rattrapage.current = window.setTimeout(() => releve.current(), SUSPENSION_MS + 16)
  }

  // Cocher une option, c'est déclarer qu'on lit ce groupe : le relevé de défilement en prend
  // acte, sans quoi le défilement provoqué par le clic lui-même reprendrait la main aussitôt.
  const poser = (id: string, n: number) => {
    onChange({ ...config, [id]: n })
    suspendreLeReleve()
    onScene(sceneDeOption(id))
  }

  // L'aperçu suit la lecture : parcourir le formulaire fait défiler les scènes, sans rien cocher.
  useEffect(() => {
    const racine = racineRef.current
    if (!racine) return

    const relever = () => {
      const ligne = window.innerHeight * LIGNE_DE_LECTURE
      let courant: HTMLElement | null = null
      for (const section of racine.querySelectorAll<HTMLElement>('[data-groupe]')) {
        if (section.getBoundingClientRect().top <= ligne) courant = section
      }
      if (!courant) return

      const boite = courant.getBoundingClientRect()
      // Avancement dans le groupe lu, quantifié au cinquantième : à chaque image, ce serait un
      // rendu de React par image de défilement.
      const brut = boite.height > 0 ? (ligne - boite.top) / boite.height : 0
      const progression = Math.round(Math.min(Math.max(brut, 0), 1) * 50) / 50
      const groupe = courant.dataset.groupe as GroupeId

      if (groupe === dernierGroupe.current && progression === derniereProgression.current) return
      // La référence s'écrit toujours, l'émission non. Au montage le premier groupe a déjà franchi
      // la ligne, et émettre ferait glisser la page avant le premier geste. Pendant la suspension
      // c'est le clic qui a fait défiler le panneau : sortir sans écrire laisserait ce défilement
      // subi passer pour une lecture, et reprendre la main sur le choix une demi-seconde plus tard.
      const muet = dernierGroupe.current === null || Date.now() < suspenduJusqua.current
      dernierGroupe.current = groupe
      derniereProgression.current = progression
      if (!muet) onLecture({ groupe, progression })
    }

    releve.current = relever
    relever()

    let attente = 0
    const auDefilement = () => {
      if (attente) return
      attente = requestAnimationFrame(() => {
        attente = 0
        relever()
      })
    }

    // `capture` : au-dessus de `lg` le panneau a son propre défilement, qui ne remonte pas à `window`.
    window.addEventListener('scroll', auDefilement, true)
    window.addEventListener('resize', auDefilement)
    return () => {
      window.removeEventListener('scroll', auDefilement, true)
      window.removeEventListener('resize', auDefilement)
      if (attente) cancelAnimationFrame(attente)
      clearTimeout(rattrapage.current)
    }
  }, [onLecture])

  const choisirExclusif = (groupe: string, id: string) => {
    const suivant = { ...config }
    for (const o of OPTIONS) if (o.groupe === groupe) delete suivant[o.id]
    suivant[id] = 1
    onChange(suivant)
    suspendreLeReleve()
    onScene(sceneDeOption(id))
  }

  return (
    <div ref={racineRef} className="flex flex-col gap-12">
      {GROUPES.map((groupe) => (
        <fieldset
          key={groupe.id}
          data-groupe={groupe.id}
          className="border-0 p-0"
          aria-labelledby={`legende-${groupe.id}`}
        >
          <div
            id={`legende-${groupe.id}`}
            data-testid={`legende-${groupe.id}`}
            className="entete-groupe sticky top-0 z-10 py-2 font-mono text-xs uppercase tracking-[0.08em] text-accent"
          >
            {groupe.titre}
          </div>
          <p className="mt-2 max-w-prose text-sm text-muted-foreground">{groupe.intro}</p>

          <div className="mt-4 flex flex-col gap-2">
            {OPTIONS.filter((o) => o.groupe === groupe.id).map((option) => (
              <CarteOption
                key={option.id}
                option={option}
                quantite={config[option.id] ?? 0}
                exclusif={groupe.exclusif === true}
                onPoser={poser}
                onChoisirExclusif={choisirExclusif}
              />
            ))}
          </div>
        </fieldset>
      ))}
    </div>
  )
})
