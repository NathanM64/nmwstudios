'use client'

import { Fragment } from 'react'

export function Redirections() {
  return (
    // Une vraie table : deux colonnes et un code de réponse, pas deux lignes de texte.
    <div data-testid="preuve-redirections" className="m-table font-mono">
      {[
        ['/ancien-site/accueil', '/'],
        ['/ancien-site/contact', '/#contact'],
      ].map(([avant, apres]) => (
        <Fragment key={avant}>
          <span className="m-legende">{avant}</span>
          <span className="m-legende m-accent">{apres}</span>
          <span className="m-jeton m-legende justify-self-start px-1">301</span>
        </Fragment>
      ))}
    </div>
  )
}
