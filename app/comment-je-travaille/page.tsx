import type { Metadata } from 'next'
import { Ecran } from '@/components/Ecran'

export const metadata: Metadata = {
  alternates: { canonical: '/comment-je-travaille/' },
  openGraph: { url: '/comment-je-travaille/' },
  title: 'Comment je travaille, en direct et en marque blanche',
  description:
    'Depuis 2025, une agence parisienne me confie ses applications en marque blanche. Cinq étapes, et à chacune quelque chose entre vos mains, avec une date.',
}

const MISSIONS = [
  ['Une application de saisie sur tablette pour les équipes terrain d’un grand groupe.'],
  ['Un backoffice de jeu concours à forte audience.', 'Tirage, notifications automatiques, suivi de performance.'],
  ['La reprise et la maintenance d’un parc d’applications existantes.'],
] as const

// Chaque étape finit par ce que vous avez en main.
const ETAPES = [
  ['Cadrage', 'Un périmètre écrit, un prix et une date.', 'Ce que le projet fait, et ce qu’il ne fera pas.'],
  ['Conception', 'La liste des écrans, avec les points signalés.', 'Vos maquettes telles quelles ; les miennes si vous n’en avez pas.'],
  ['Développement', 'Une adresse où voir l’avancement.', 'Des versions visibles au fil du chantier. Si une date glisse, vous le savez avant.'],
  ['Mise en ligne', 'Le projet en ligne, transférable.', 'Sur votre hébergement ou sur le mien.'],
  ['Suivi', 'Si vous le souhaitez.', 'Sinon, le code et la documentation.'],
] as const

export default function Page() {
  return (
    <Ecran classe="methode">
      <div className="preuve">
        <div>
          <h1>
            <span className="client">Depuis 2025,</span> une agence parisienne me confie ses applications et
            ses nouveaux projets.
          </h1>
          <p className="lead">
            En marque blanche : vos maquettes, vos délais, votre nom devant votre client.
          </p>
          <p>
            Je ne contacte jamais votre client, je ne signe pas mon travail, je ne conserve aucun accès
            une fois le chantier livré. Ce que je peux décrire :
          </p>
        </div>
        <ul className="missions">
          {MISSIONS.map(([mission, detail]) => (
            <li key={mission} className="panel">
              {mission}
              {detail && <span>{detail}</span>}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="eyebrow">Ce que vous avez en main à chaque étape</p>
        <ol className="etapes">
          {ETAPES.map(([titre, livrable, comment]) => (
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
