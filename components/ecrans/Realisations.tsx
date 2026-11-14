import type { Dictionnaire } from '@/content/types'
import { Ecran } from '@/components/Ecran'
import { Carrousel } from '@/components/Carrousel'
import { Donnees } from '@/components/Donnees'
import { filAriane, realisations } from '@/lib/donnees'

export function Realisations({ t }: { t: Dictionnaire }) {
  const r = t.realisations
  const titre = t.ecrans.find((e) => e.cle === 'realisations')?.titre ?? ''
  return (
    <Ecran classe="realisations">
      <Donnees objet={filAriane([[t.ecrans[0].titre, t.routes.accueil], [titre, null]])} />
      <Donnees objet={realisations(t)} />
      <div className="preuve">
        <h1>
          {r.h1[0]} <span className="client">{r.h1[1]}</span>
        </h1>
        <p className="lead">{r.lead}</p>
      </div>
      <ul className="ouvrages">
        {r.liste.map((o) => (
          <li key={o.nom} className="panel">
            {/* Deux carrousels côte à côte ne défilent pas seuls : la première vue porte le logo. */}
            <Carrousel vues={o.vues} legende={r.legende} textes={t.carrousel} defile={false} />
            <div className="texte">
              <h2>
                {o.nom} <span>{o.nature}</span>
              </h2>
              <p>{o.besoin}</p>
              <ul>
                {o.faits.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <a href={o.href} target="_blank" rel="noopener">
                {o.lien}
              </a>
            </div>
          </li>
        ))}
      </ul>
    </Ecran>
  )
}
