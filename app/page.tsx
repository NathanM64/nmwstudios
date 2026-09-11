import Link from 'next/link'
import { Ecran } from '@/components/Ecran'

export default function Accueil() {
  return (
    <Ecran classe="accueil">
      <div>
        <h1>
          Je conçois, je développe,{' '}
          <br />
          je reprends et j’accompagne.{' '}
          <br />
          Vous décidez jusqu’où.
        </h1>
        <p className="lead">
          Sites, applications et outils métier. Je construis, je reprends l’existant, et j’assure la
          suite si vous le souhaitez. Le code est à vous, l’hébergement est transférable.
        </p>
        <p className="actions">
          <Link className="bouton" href="/contact">
            Parler de votre projet
          </Link>
        </p>
      </div>
      <div className="situations-cote panel">
        <p className="intro eyebrow">Trois situations que je connais bien</p>
        <ul className="situations">
          <li>Votre site a cinq ans et plus personne ne veut y toucher.</li>
          <li>Votre équipe recopie des données à la main tous les jours.</li>
          <li>Votre prestataire ne répond plus.</li>
        </ul>
      </div>
    </Ecran>
  )
}
