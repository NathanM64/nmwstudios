import type { Dictionnaire } from '@/content/types'
import { Ecran } from '@/components/Ecran'
import { Donnees } from '@/components/Donnees'
import { filAriane } from '@/lib/donnees'

export function Refus({ t }: { t: Dictionnaire }) {
  const r = t.refus
  return (
    <Ecran classe="methode refus-ecran">
      <Donnees objet={filAriane([[t.ecrans[0].titre, t.routes.accueil], [t.methode.onglets[0], t.routes.methode], [t.methode.onglets[1], null]])} />
      <div className="preuve">
        <div>
          <h1>
            {r.h1[0]} <span className="client">{r.h1[1]}</span>
          </h1>
          <p className="lead">{r.lead}</p>
        </div>
      </div>
      <ul className="refus">
        {r.liste.map(([titre, texte]) => (
          <li key={titre} className="panel">
            <h3>{titre}</h3>
            <p>{texte}</p>
          </li>
        ))}
      </ul>
    </Ecran>
  )
}
