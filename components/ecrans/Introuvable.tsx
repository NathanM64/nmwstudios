import Link from 'next/link'
import { Ecran } from '@/components/Ecran'
import { FR } from '@/content/fr'
import { EN } from '@/content/en'

// Une seule 404 pour tout le site : le français, et une ligne en anglais qui mène à /en/.
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
        <p lang="en">
          {EN.introuvable.lead} <Link href={EN.routes.accueil}>{EN.introuvable.bouton}</Link>.
        </p>
      </div>
    </Ecran>
  )
}
