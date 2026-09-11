import type { ReactNode } from 'react'

// Un écran du cadre : deux colonnes centrées verticalement, qui s'empilent sous 720 px.
export function Ecran({ classe, children }: { classe?: string; children: ReactNode }) {
  return (
    <section className="ecran">
      <div className="inner">
        <div className={classe ? `colonnes ${classe}` : 'colonnes'}>{children}</div>
      </div>
    </section>
  )
}
