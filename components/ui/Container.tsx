export function Container({
  children,
  className = '',
  largeur = 'normale',
}: {
  children: React.ReactNode
  className?: string
  largeur?: 'normale' | 'serree'
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-6 sm:px-10 ${className}`}>
      {/* Le serré se resserre par la droite : le bord gauche du document ne bouge jamais. */}
      {largeur === 'serree' ? <div className="max-w-[40rem]">{children}</div> : children}
    </div>
  )
}
