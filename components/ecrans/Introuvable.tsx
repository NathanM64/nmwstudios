import Link from 'next/link'
import { Ecran } from '@/components/Ecran'
import { FR } from '@/content/fr'

// Une seule 404 pour tout le site.
export function Introuvable() {
  return (
    <Ecran classe="introuvable">
      <div>
        <h1>
          {FR.introuvable.h1[0]} <span className="client">{FR.introuvable.h1[1]}</span>
        </h1>
        <p className="lead">{FR.introuvable.lead}</p>
        <p className="actions">
          <Link className="bouton" href={FR.routes.accueil}>
            {FR.introuvable.bouton}
          </Link>
        </p>
      </div>
    </Ecran>
  )
}
