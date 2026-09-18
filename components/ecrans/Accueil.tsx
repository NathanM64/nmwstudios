import Link from 'next/link'
import type { Dictionnaire } from '@/content/types'
import { Ecran } from '@/components/Ecran'

export function Accueil({ t }: { t: Dictionnaire }) {
  const a = t.accueil
  return (
    <Ecran classe="accueil">
      <div>
        <h1 className="accroche">
          {a.accroche[0]}{' '}
          <br />
          {a.accroche[1]}{' '}
          <br />
          <span className="client">{a.accroche[2]}</span>
        </h1>
        <p className="identite">
          <strong>Nathan Marimbordes</strong>
          {a.identite}
        </p>
        <p className="lead">{a.lead}</p>
        <p className="actions">
          <Link className="bouton" href={t.routes.contact}>
            {t.chrome.appel}
          </Link>
          <span className="secondaire">
            {a.ouParEmail} <a href="mailto:contact@nmwstudios.com">contact@nmwstudios.com</a>. {a.reponds}
          </span>
        </p>
      </div>
      <nav className="pied" aria-label="Situations">
        <p className="eyebrow">{a.eyebrow}</p>
        <ul className="situations">
          {a.situations.map(([situation, reponse, cle]) => (
            <li key={situation}>
              <Link href={t.routes[cle]}>
                <span>{situation}</span>
                <span className="reponse">{reponse}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Ecran>
  )
}
