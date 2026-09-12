import type { Metadata } from 'next'
import Link from 'next/link'
import { Ecran } from '@/components/Ecran'
import { hrefOffre, offreParSlug } from '@/content/offres'

const SITUATIONS = [
  ['Votre site a cinq ans et plus personne ne veut y toucher.', 'Je le reprends, sans repartir de zéro.', hrefOffre(offreParSlug('reprise')!)],
  ['Votre agence a une maquette validée et personne pour l’intégrer avant la date.', 'Je l’intègre avant la date, sous votre nom.', '/comment-je-travaille'],
  ['Votre équipe recopie des données à la main tous les jours.', 'Je fais disparaître la tâche.', hrefOffre(offreParSlug('automatisation')!)],
  ['Votre prestataire ne répond plus.', 'Je prends la suite, et je réponds.', hrefOffre(offreParSlug('reprise')!)],
] as const

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: { url: '/' },
}

export default function Accueil() {
  return (
    <Ecran classe="accueil">
      <div>
        <h1 className="accroche">
          Je conçois, je développe,{' '}
          <br />
          je reprends et j’accompagne.{' '}
          <br />
          <span className="client">Vous décidez jusqu’où.</span>
        </h1>
        <p className="identite">
          <strong>Nathan Marimbordes</strong>, développeur web indépendant à Bordeaux. Pour les entreprises
          en direct, et pour les agences en marque blanche.
        </p>
        <p className="lead">
          Sites vitrines, applications et outils métier. Je construis, je reprends l’existant, et j’assure la
          suite si vous le souhaitez. Le code est à vous.
        </p>
        <p className="actions">
          <Link className="bouton" href="/contact">
            Parler de votre projet
          </Link>
          <span className="secondaire">
            ou par email : <a href="mailto:contact@nmwstudios.com">contact@nmwstudios.com</a>. Je réponds
            dans la journée.
          </span>
        </p>
      </div>
      <nav className="pied" aria-label="Situations">
        <p className="eyebrow">Quatre situations que je connais bien</p>
        <ul className="situations">
          {SITUATIONS.map(([situation, reponse, href]) => (
            <li key={situation}>
              <Link href={href}>
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
