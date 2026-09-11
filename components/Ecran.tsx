import type { ReactNode } from 'react'

// Un écran du cadre : deux colonnes centrées verticalement, qui s'empilent sous 720 px.
export function Ecran({ classe, children }: { classe?: string; children: ReactNode }) {
  const suffixe = classe ? ` ${classe}` : ''
  return (
    <section className={`ecran${suffixe}`}>
      <div className="inner">
        <div className={`colonnes${suffixe}`}>{children}</div>
      </div>
    </section>
  )
}
