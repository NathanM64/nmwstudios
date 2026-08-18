'use client'

export function BoutonsAction({
  copie,
  onCopier,
}: {
  copie: 'succes' | 'echec' | null
  onCopier: () => void
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <button type="button" popoverTarget="recapitulatif"
              className="rounded-md border border-border px-3 py-1.5 text-sm">
        Recevoir le récapitulatif
      </button>
      <button
        type="button"
        onClick={onCopier}
        aria-live="polite"
        className="rounded-md border border-border px-3 py-1.5 text-sm"
      >
        {copie === 'succes' ? 'Lien copié' : copie === 'echec' ? 'Échec de la copie' : 'Copier le lien'}
      </button>
    </div>
  )
}
