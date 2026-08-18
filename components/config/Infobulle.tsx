'use client'

export function Infobulle({ id, libelle, texte }: { id: string; libelle: string; texte: string }) {
  const popoverId = `explication-${id}`

  return (
    <>
      <button
        type="button"
        popoverTarget={popoverId}
        aria-label={`Que comprend : ${libelle}`}
        className="h-4 w-4 shrink-0 rounded-full border border-border text-[0.625rem] leading-none text-muted-foreground transition-colors duration-(--dur-micro) hover:text-foreground"
      >
        ?
      </button>
      <div
        id={popoverId}
        popover="auto"
        className="max-w-xs rounded-md border border-border bg-canvas p-3 text-sm text-foreground shadow-panel"
      >
        {texte}
      </div>
    </>
  )
}
