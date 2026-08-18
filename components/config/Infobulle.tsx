'use client'

export function Infobulle({
  id,
  libelle,
  texte,
  onOuvrir,
}: {
  id: string
  libelle: string
  texte: string
  onOuvrir?: () => void
}) {
  const popoverId = `explication-${id}`
  const ancre = `--ancre-${id}`

  return (
    <>
      <button
        type="button"
        popoverTarget={popoverId}
        onClick={onOuvrir}
        aria-label={`Que comprend : ${libelle}`}
        style={{ anchorName: ancre } as React.CSSProperties}
        className="h-4 w-4 shrink-0 rounded-full border border-border text-[0.625rem] leading-none text-muted-foreground transition-colors duration-(--dur-micro) hover:text-foreground"
      >
        ?
      </button>
      <div
        id={popoverId}
        popover="auto"
        data-ancre=""
        style={{ positionAnchor: ancre } as React.CSSProperties}
        className="max-w-xs rounded-md border border-border bg-canvas p-3 text-sm text-foreground shadow-(--shadow-elevated)"
      >
        {texte}
      </div>
    </>
  )
}
