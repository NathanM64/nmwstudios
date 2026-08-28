// Une dalle de verre. Elle reste un composant serveur : c'est Refraction, monté une fois
// dans le document, qui vient poser le filtre de déplacement sur les éléments data-verre.
export function Verre({
  children,
  className = '',
  epais = false,
  dense = false,
  surEncre = false,
  reflet = false,
  flou = 0,
  sansPli = false,
  as: Balise = 'div',
}: {
  children: React.ReactNode
  className?: string
  epais?: boolean
  dense?: boolean
  surEncre?: boolean
  reflet?: boolean
  flou?: number
  sansPli?: boolean
  as?: 'div' | 'article' | 'li' | 'aside' | 'section'
}) {
  const classes = [
    epais ? 'verre-epais' : 'verre',
    dense ? 'verre-dense' : '',
    surEncre ? 'sur-encre' : '',
    reflet ? 'reflet' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Balise
      data-verre={sansPli ? undefined : ''}
      data-verre-flou={flou || undefined}
      className={classes}
    >
      {/* La bande de lumière est un enfant positionné : elle glisse en transform pur. */}
      {reflet ? <span aria-hidden="true" className="reflet-bande" /> : null}
      {children}
    </Balise>
  )
}
