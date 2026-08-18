'use client'

import type { Option } from '@/lib/config/catalogue'
import { formaterEuros, suffixePrix } from '@/lib/config/devis'
import { SOCLE_ID } from '@/lib/config/catalogue'

// Aplat translucide, jamais `.panel` : le verre pose `backdrop-filter`, et la
// carte porte du texte, ce que la règle du projet interdit sur une surface de verre.
const CARTE = 'flex min-h-11 w-full items-start justify-between gap-4 rounded-md border p-3 text-left transition-colors duration-(--dur-micro)'
const REPOS = 'border-border bg-surface hover:border-border-strong'
// Accent à 4 % seulement : à 10 % sa luminance rejoint celle de muted-foreground
// en thème sombre et le contraste du libellé s'effondre (mesuré dans le test de contraste).
const RETENU = 'border-accent bg-accent/4'

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

  const corps = (
    <>
      <span className="flex flex-col gap-1">
        <span id={titreId} className="text-sm">
          {option.libelle}
          {quantite > 1 && ` × ${quantite}`}
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
        {corps}
      </div>
    )
  }

  if (option.quantifiable) {
    return (
      <div data-testid={`carte-${option.id}`} className={`${CARTE} ${retenu ? RETENU : REPOS}`}>
        <span className="flex flex-col gap-1">
          <span className="text-sm">{option.libelle}</span>
          <span className="text-xs text-muted-foreground">{option.explication}</span>
        </span>
        <span className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            aria-label={`Retirer : ${option.libelle}`}
            onClick={() => onPoser(option.id, Math.max(0, quantite - 1))}
            className="h-11 w-11 rounded-md border border-border text-base leading-none"
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
            className="h-11 w-11 rounded-md border border-border text-base leading-none"
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
    <label data-testid={`carte-${option.id}`} className={`${CARTE} ${retenu ? RETENU : REPOS} relative cursor-pointer`}>
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
        // `sr-only` seul ramène le clic natif à 0 px (clip-path) : la carte entière
        // reste alors cliquable au clic simple, mais un clic direct sur l'input rate
        // sa cible et la suite qui cible getByRole('checkbox'/'radio') échoue.
        className="absolute inset-0 z-10 cursor-pointer opacity-0"
      />
      {corps}
    </label>
  )
}
