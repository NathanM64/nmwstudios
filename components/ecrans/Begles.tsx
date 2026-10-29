import Link from 'next/link'
import type { Dictionnaire } from '@/content/types'
import { Ecran } from '@/components/Ecran'

// La page locale, hors menu : un écran du cadre comme les autres, la liste des offres dans un panneau.
export function Begles({ t }: { t: Dictionnaire }) {
  const b = t.begles
  if (!b) return null
  return (
    <Ecran classe="local">
      <div>
        <h1>{b.h1}</h1>
        <p className="lead">{b.lead}</p>
        <p>{b.paragraphe}</p>
        <p className="actions">
          <Link className="bouton" href={t.routes.contact}>
            {t.chrome.appel}
          </Link>
          <span className="secondaire">
            {t.accueil.ouParEmail} <a href="mailto:contact@nmwstudios.com">contact@nmwstudios.com</a>
          </span>
        </p>
      </div>
      <div className="panel">
        <h2>{b.sousTitre}</h2>
        <ul>
          {b.liste.map(([nom, suite, cle]) => (
            <li key={nom}>
              <Link href={t.routes[cle]}>{nom}</Link>
              {suite}
            </li>
          ))}
        </ul>
        <h2>{b.sousTitre2}</h2>
        <p>{b.paragraphe2}</p>
      </div>
    </Ecran>
  )
}
