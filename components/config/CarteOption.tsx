'use client'

import type { Option } from '@/lib/config/catalogue'
import { formaterEuros, suffixePrix } from '@/lib/config/devis'
import { SOCLE_ID } from '@/lib/config/catalogue'

// Aplat translucide, jamais `.panel` (le verre pose `backdrop-filter`).
// `isolate` confine la teinte et l'input à cette carte, pas aux voisines.
const CARTE = 'relative isolate flex min-h-11 w-full items-start justify-between gap-4 rounded-md border bg-surface p-3 text-left transition-colors duration-(--dur-micro)'
const REPOS = 'border-border hover:border-border-strong'
const RETENU = 'border-accent'
// Par-dessus `bg-surface`, jamais à sa place : Tailwind n'empile pas deux fonds.
// Accent à 4 %, pas 10 % : au-delà, le contraste passe sous 4,5:1 en sombre.
const TEINTE = 'pointer-events-none absolute inset-0 -z-10 rounded-md bg-accent/4'

export function CarteOption({
  option,
  quantite,
  exclusif,
  onPoser,
  onChoisirExclusif,
}: {
  option: Option
  quantite: number
  exclusif: boolean
  onPoser: (id: string, n: number) => void
  onChoisirExclusif: (groupe: string, id: string) => void
}) {
  const retenu = quantite > 0
  const titreId = `titre-${option.id}`
  const descId = `desc-${option.id}`
  const teinte = retenu ? <span aria-hidden="true" className={TEINTE} /> : null

  const corps = (
    <>
      <span className="flex flex-col gap-1">
        <span id={titreId} className="text-sm">
          {option.libelle}
          {/* lib/config/url.ts ramène toute option non quantifiable à un : le multiplicateur ne concerne que les quantifiables. */}
          {option.quantifiable && quantite > 1 && ` × ${quantite}`}
        </span>
        <span id={descId} className="text-xs text-muted-foreground">
          {option.explication}
        </span>
      </span>
      {/* Trois poids de prix : le socle porte le chiffre plein, les options un delta discret. */}
      <span
        className={`shrink-0 font-mono ${
          option.id === SOCLE_ID ? 'text-sm text-foreground' : 'text-xs text-muted-foreground'
        }`}
      >
        {option.id === SOCLE_ID ? formaterEuros(option.prix) : suffixePrix(option, Math.max(quantite, 1))}
      </span>
    </>
  )

  // Le socle ne se décoche pas : carte inerte, sans contrôle.
  if (option.id === SOCLE_ID) {
    return (
      <div data-testid={`carte-${option.id}`} className={`${CARTE} ${RETENU}`}>
        {teinte}
        {corps}
      </div>
    )
  }

  if (option.quantifiable) {
    return (
      <div data-testid={`carte-${option.id}`} className={`${CARTE} ${retenu ? RETENU : REPOS}`}>
        {teinte}
        <span className="flex flex-col gap-1">
          <span className="text-sm">{option.libelle}</span>
          <span className="text-xs text-muted-foreground">{option.explication}</span>
        </span>
        <span className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            aria-label={`Retirer : ${option.libelle}`}
            onClick={() => onPoser(option.id, Math.max(0, quantite - 1))}
            // 45px = 32 (légende) + 1 (bordure carte) + 12 (padding carte) : le bouton est en flux normal, pas absolu comme l'input des cases.
            className="h-11 w-11 scroll-mt-[45px] rounded-md border border-border text-base leading-none"
          >
            &minus;
          </button>
          <span className="flex items-baseline gap-1 text-sm">
            <span data-testid={`quantite-${option.id}`} aria-live="polite" className="w-4 text-right font-mono">
              {quantite}
            </span>
            <span data-testid={`unite-${option.id}`} className="w-14 text-muted-foreground">
              {option.quantifiable.suffixe}
              {quantite > 1 ? 's' : ''}
            </span>
          </span>
          <button
            type="button"
            aria-label={`Ajouter : ${option.libelle}`}
            onClick={() => onPoser(option.id, Math.min(option.quantifiable!.max, quantite + 1))}
            className="h-11 w-11 scroll-mt-[45px] rounded-md border border-border text-base leading-none"
          >
            +
          </button>
          <span className="w-20 shrink-0 text-right font-mono text-xs text-muted-foreground">
            {suffixePrix(option)}
          </span>
        </span>
      </div>
    )
  }

  return (
    <label
      data-testid={`carte-${option.id}`}
      className={`${CARTE} ${retenu ? RETENU : REPOS} cursor-pointer has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent`}
    >
      {teinte}
      <input
        type={exclusif ? 'radio' : 'checkbox'}
        name={exclusif ? option.groupe : undefined}
        checked={retenu}
        aria-labelledby={titreId}
        aria-describedby={descId}
        onChange={(e) =>
          exclusif
            ? onChoisirExclusif(option.groupe, option.id)
            : onPoser(option.id, e.target.checked ? 1 : 0)
        }
        // `sr-only` viderait la zone cliquable (clip-path) : l'input doit
        // couvrir toute la carte pour rester la vraie cible du clic direct.
        // 33px = 32 (légende) + 1 (bordure carte) : l'input absolu est calé sur la boîte de padding, pas la bordure.
        className="absolute inset-0 z-10 scroll-mt-[33px] cursor-pointer opacity-0"
      />
      {corps}
    </label>
  )
}
