import type { Metadata } from 'next'
import { Ecran } from '@/components/Ecran'
import { Donnees } from '@/components/Donnees'
import { filAriane } from '@/lib/donnees'

export const metadata: Metadata = {
  alternates: { canonical: '/comment-je-travaille/ce-que-je-ne-fais-pas/' },
  openGraph: { url: '/comment-je-travaille/ce-que-je-ne-fais-pas/' },
  title: 'Ce que je ne fais pas : les limites que je pose. NMW Studios',
  description:
    'Les sites sans code source, les projets qui demandent une équipe, les applications mobiles natives, un prix de maintenance avant d’avoir construit le projet.',
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
      <Donnees objet={filAriane([['Accueil', '/'], ['Comment je travaille', '/comment-je-travaille/'], ['Ce que je ne fais pas', null]])} />
      <div className="preuve">
        <div>
          <h1>
            Ce que je <span className="client">ne fais pas.</span>
          </h1>
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
