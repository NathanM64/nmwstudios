import type { Dictionnaire } from '@/content/types'
import { Ecran } from '@/components/Ecran'

export function Methode({ t }: { t: Dictionnaire }) {
  const m = t.methode
  return (
    <Ecran classe="methode">
      <div className="preuve">
        <div>
          <h1>
            <span className="client">{m.h1[0]}</span> {m.h1[1]}
          </h1>
          <p className="lead">{m.lead}</p>
          <p>{m.paragraphe}</p>
        </div>
        <ul className="missions">
          {m.missions.map(([mission, detail]) => (
            <li key={mission} className="panel">
              {mission}
              {detail && <span>{detail}</span>}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="eyebrow">{m.eyebrow}</p>
        <ol className="etapes">
          {m.etapes.map(([titre, livrable, comment]) => (
            <li key={titre}>
              <h3>{titre}</h3>
              <p>
                <strong>{livrable}</strong>
                <span>{comment}</span>
              </p>
            </li>
          ))}
        </ol>
      </div>
    </Ecran>
  )
}
