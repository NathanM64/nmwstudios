export function Container({
  children,
  className = '',
  width = 'normal',
}: {
  children: React.ReactNode
  className?: string
  width?: 'normal' | 'narrow'
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-6 sm:px-10 ${className}`}>
      {/* Narrow tightens from the right: the document's left edge never moves. */}
      {width === 'narrow' ? <div className="max-w-[40rem]">{children}</div> : children}
    </div>
  )
}
