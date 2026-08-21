'use client'

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export type OptionListe = { valeur: string; libelle: string }

/** Remise à zéro de la saisie au clavier : un délai d'interaction, pas un jeton de mouvement. */
const REPRISE_SAISIE_MS = 500
const HAUTEUR_MAX = 320
const ECART = 6

type Position = { gauche: number; largeur: number; haut?: number; bas?: number; hauteurMax: number }

// Positionner avant la peinture évite un saut ; `useLayoutEffect` n'existe pas au rendu serveur.
const useEffetDeMiseEnPage = typeof window === 'undefined' ? useEffect : useLayoutEffect

/**
 * Liste déroulante maison.
 *
 * Les `<option>` d'un `<select>` natif sont dessinées par le système : hors `background-color`
 * et `color`, aucune règle CSS ne les atteint, et le volet reste un widget du système au milieu
 * d'une interface en verre. Le déclencheur est donc un bouton `combobox` et le volet un
 * `listbox` rendu dans un portail.
 *
 * ⚠️ Le `<select>` natif reste dans le DOM, invisible : il porte la valeur, l'événement
 * `change` et le repère de test, ce qui garde `selectOption` de Playwright opérant.
 * ⚠️ Portail obligatoire : la colonne d'options écrête son débordement pour défiler, un volet
 * posé en flux y serait rogné sans que rien ne le signale.
 */
export function SelectListe({
  valeur,
  options,
  onChange,
  etiquette,
  testId,
  className,
}: {
  valeur: string
  options: readonly OptionListe[]
  onChange: (valeur: string) => void
  etiquette: string
  testId: string
  className?: string
}) {
  const racine = useId()
  const idListe = `${racine}-liste`
  const idEtiquette = `${racine}-etiquette`

  const declencheurRef = useRef<HTMLButtonElement | null>(null)
  const listeRef = useRef<HTMLDivElement | null>(null)
  const hauteurVoulue = useRef(HAUTEUR_MAX)
  const saisie = useRef({ texte: '', a: 0 })

  const [ouvert, setOuvert] = useState(false)
  const [actif, setActif] = useState(-1)
  const [position, setPosition] = useState<Position | null>(null)

  const choisi = options.findIndex((option) => option.valeur === valeur)

  const calculerPosition = useCallback(() => {
    const declencheur = declencheurRef.current
    if (!declencheur) return
    const rect = declencheur.getBoundingClientRect()
    const dessous = window.innerHeight - rect.bottom - ECART
    const dessus = rect.top - ECART
    const versLeHaut = dessous < Math.min(hauteurVoulue.current, HAUTEUR_MAX) && dessus > dessous
    setPosition({
      gauche: rect.left,
      largeur: rect.width,
      haut: versLeHaut ? undefined : rect.bottom + ECART,
      bas: versLeHaut ? window.innerHeight - rect.top + ECART : undefined,
      hauteurMax: Math.min(HAUTEUR_MAX, versLeHaut ? dessus : dessous),
    })
  }, [])

  const ouvrir = useCallback(
    (index?: number) => {
      setActif(index ?? (choisi >= 0 ? choisi : 0))
      calculerPosition()
      setOuvert(true)
    },
    [choisi, calculerPosition]
  )

  const fermer = useCallback(() => {
    setOuvert(false)
    declencheurRef.current?.focus()
  }, [])

  const valider = useCallback(
    (index: number) => {
      const option = options[index]
      if (option) onChange(option.valeur)
      fermer()
    },
    [options, onChange, fermer]
  )

  const chercher = useCallback(
    (touche: string, depuis: number) => {
      const maintenant = Date.now()
      const tampon = maintenant - saisie.current.a > REPRISE_SAISIE_MS ? '' : saisie.current.texte
      const requete = (tampon + touche).toLowerCase()
      saisie.current = { texte: requete, a: maintenant }
      // Même lettre répétée : on parcourt les options qui commencent par elle.
      const repetee = requete.length > 1 && [...requete].every((c) => c === requete[0])
      const cible = repetee ? requete[0] : requete
      const depart = repetee || !tampon ? depuis + 1 : depuis
      for (let pas = 0; pas < options.length; pas += 1) {
        const index = (depart + pas + options.length) % options.length
        if (options[index].libelle.toLowerCase().startsWith(cible)) return index
      }
      return -1
    },
    [options]
  )

  const auClavier = (evenement: React.KeyboardEvent<HTMLButtonElement>) => {
    const imprimable = evenement.key.length === 1 && !evenement.metaKey && !evenement.ctrlKey && !evenement.altKey

    if (!ouvert) {
      if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(evenement.key)) {
        evenement.preventDefault()
        ouvrir()
      } else if (imprimable) {
        evenement.preventDefault()
        const trouve = chercher(evenement.key, choisi)
        ouvrir(trouve >= 0 ? trouve : undefined)
      }
      return
    }

    switch (evenement.key) {
      case 'Escape':
        evenement.preventDefault()
        fermer()
        return
      case 'Tab':
        setOuvert(false)
        return
      case 'Enter':
      case ' ':
        evenement.preventDefault()
        if (actif >= 0) valider(actif)
        else fermer()
        return
      case 'ArrowDown':
        evenement.preventDefault()
        setActif((i) => Math.min(i + 1, options.length - 1))
        return
      case 'ArrowUp':
        evenement.preventDefault()
        setActif((i) => Math.max(i - 1, 0))
        return
      case 'Home':
        evenement.preventDefault()
        setActif(0)
        return
      case 'End':
        evenement.preventDefault()
        setActif(options.length - 1)
        return
      default:
        if (imprimable) {
          evenement.preventDefault()
          const trouve = chercher(evenement.key, actif)
          if (trouve >= 0) setActif(trouve)
        }
    }
  }

  // Le volet reste collé au déclencheur tant qu'il est ouvert.
  useEffect(() => {
    if (!ouvert) return
    const suivre = () => calculerPosition()
    // `capture` : le défilement d'un conteneur interne ne remonte pas jusqu'à `window`.
    window.addEventListener('scroll', suivre, true)
    window.addEventListener('resize', suivre)
    return () => {
      window.removeEventListener('scroll', suivre, true)
      window.removeEventListener('resize', suivre)
    }
  }, [ouvert, calculerPosition])

  // La hauteur réelle du contenu n'est connue qu'une fois le volet rendu, et elle peut
  // inverser le sens d'ouverture. Avant peinture, donc invisible.
  useEffetDeMiseEnPage(() => {
    const liste = listeRef.current
    if (!ouvert || !liste) return
    if (Math.abs(liste.scrollHeight - hauteurVoulue.current) < 1) return
    hauteurVoulue.current = liste.scrollHeight
    calculerPosition()
  }, [ouvert, calculerPosition])

  // L'option active reste visible, sans jamais faire défiler la page.
  useEffetDeMiseEnPage(() => {
    if (!ouvert || actif < 0) return
    const liste = listeRef.current
    const element = liste?.querySelector<HTMLElement>(`[data-index="${actif}"]`)
    if (!liste || !element) return
    if (element.offsetTop < liste.scrollTop) liste.scrollTop = element.offsetTop
    else if (element.offsetTop + element.offsetHeight > liste.scrollTop + liste.clientHeight) {
      liste.scrollTop = element.offsetTop + element.offsetHeight - liste.clientHeight
    }
  }, [ouvert, actif])

  const volet = ouvert && position && (
    <div
      ref={listeRef}
      id={idListe}
      role="listbox"
      data-testid={`${testId}-volet`}
      aria-labelledby={idEtiquette}
      // Le clic ne doit pas retirer le focus du déclencheur.
      onMouseDown={(evenement) => evenement.preventDefault()}
      style={{
        left: position.gauche,
        // `minWidth` plutôt que `width` : un libellé plus long que le déclencheur serait tronqué.
        minWidth: position.largeur,
        maxWidth: 'min(22rem, calc(100vw - 1rem))',
        top: position.haut,
        bottom: position.bas,
        maxHeight: position.hauteurMax,
      }}
      className="panel-menu fixed z-50 overflow-y-auto overscroll-contain p-1"
    >
      {options.map((option, index) => {
        const estChoisie = index === choisi
        return (
          <div
            key={option.valeur}
            data-index={index}
            data-testid={`${testId}-option`}
            role="option"
            aria-selected={estChoisie}
            onMouseMove={() => setActif(index)}
            onClick={() => valider(index)}
            className={`flex cursor-pointer items-center justify-between gap-2 rounded-sm px-3 py-1.5 text-sm transition-colors duration-(--dur-micro) ${
              index === actif ? 'bg-surface-raised' : ''
            } ${estChoisie ? 'font-medium text-accent' : 'text-foreground'}`}
          >
            <span className="truncate">{option.libelle}</span>
            {estChoisie && (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
                <path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        )
      })}
    </div>
  )

  return (
    <span className="inline-flex items-center gap-1.5">
      <span id={idEtiquette}>{etiquette}</span>

      <span className="relative inline-block">
        {/* `<select>` natif conservé, invisible : il porte la valeur, l'événement `change` et
            le repère de test. Il couvre exactement le déclencheur plutôt que de se replier
            sur un carré d'un pixel, pour rester à la bonne place s'il reçoit le focus. */}
        <select
          data-testid={testId}
          aria-hidden="true"
          tabIndex={-1}
          value={valeur}
          onChange={(evenement) => onChange(evenement.target.value)}
          className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
        >
          {options.map((option) => (
            <option key={option.valeur} value={option.valeur}>
              {option.libelle}
            </option>
          ))}
        </select>

        <button
          ref={declencheurRef}
          type="button"
          data-testid={`${testId}-declencheur`}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={ouvert}
          aria-controls={ouvert ? idListe : undefined}
          aria-labelledby={idEtiquette}
          onClick={() => (ouvert ? fermer() : ouvrir())}
          onKeyDown={auClavier}
          onBlur={() => setOuvert(false)}
          className={`flex min-h-7 items-center gap-1.5 rounded-sm border border-border bg-transparent px-1.5 py-0.5 text-left text-xs text-foreground transition-colors duration-(--dur-micro) hover:border-border-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${className ?? ''}`}
        >
          <span className="truncate">{options[choisi]?.libelle ?? ''}</span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            className={`shrink-0 text-muted-foreground transition-transform duration-(--dur-micro) motion-reduce:transition-none${ouvert ? ' rotate-180' : ''}`}
          >
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </span>

      {volet && createPortal(volet, document.body)}
    </span>
  )
}
