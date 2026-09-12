import type { Metadata } from 'next'
import { Ecran } from '@/components/Ecran'

export const metadata: Metadata = {
  title: 'Ce que je ne fais pas, NMW Studios',
  description:
    'Les sites sans code source, les projets qui demandent une équipe, les applications natives, un prix de maintenance avant d’avoir construit.',
}

const REFUS = [
  [
    'Les sites sans code source',
    'Wix, Squarespace ou un éditeur équivalent : les reprendre vous coûterait plus cher que de refaire. Je vous le dis à la première lecture.',
  ],
  [
    'Les projets qui demandent une équipe',
    'Je travaille seul. Si votre projet demande cinq personnes, je vous le dirai et je vous orienterai, au lieu de le prendre et de vous mettre en retard.',
  ],
  [
    'Les applications mobiles natives',
    'Pas d’application iOS ou Android sur mesure. Un besoin simple passe souvent par le web, et je vous dirai si c’est le cas.',
  ],
  [
    'Un prix de maintenance avant d’avoir construit',
    'Le chiffrer avant de connaître le projet n’a pas de sens. Le périmètre de l’hébergement, lui, est écrit noir sur blanc.',
  ],
] as const

export default function Page() {
  return (
    <Ecran classe="methode refus-ecran">
      <div className="preuve">
        <div>
          <h2>
            Ce que je <span className="client">ne fais pas.</span>
          </h2>
          <p className="lead">Rien ne rassure autant qu’un prestataire qui pose ses limites. Voici les miennes.</p>
        </div>
      </div>
      <ul className="refus">
        {REFUS.map(([titre, texte]) => (
          <li key={titre} className="panel">
            <h3>{titre}</h3>
            <p>{texte}</p>
          </li>
        ))}
      </ul>
    </Ecran>
  )
}
