// A slab of glass. It stays a server component: GlassWall, mounted once in the document, is
// what draws the data-glass elements in its canvas.
export function Glass({
  children,
  className = '',
  thick = false,
  dense = false,
  onInk = false,
  sheen = false,
  blur = 0,
  noFold = false,
  as: Tag = 'div',
}: {
  children: React.ReactNode
  className?: string
  thick?: boolean
  dense?: boolean
  onInk?: boolean
  sheen?: boolean
  blur?: number
  noFold?: boolean
  as?: 'div' | 'article' | 'li' | 'aside' | 'section'
}) {
  const classNames = [
    thick ? 'glass-thick' : 'glass',
    dense ? 'glass-dense' : '',
    onInk ? 'on-ink' : '',
    sheen ? 'sheen' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Tag
      // Le canvas vit sous le contenu : une dalle qui passe dessus, donc qui porte un flou,
      // ne peut pas être dessinée par lui et reste en CSS.
      data-glass={noFold || blur > 0 ? undefined : ''}
      className={classNames}
    >
      {/* The band of light is a positioned child: it slides in pure transform. */}
      {sheen ? <span aria-hidden="true" className="sheen-band" /> : null}
      {children}
    </Tag>
  )
}
