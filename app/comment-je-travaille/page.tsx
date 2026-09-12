import type { Metadata } from 'next'
import { Ecran } from '@/components/Ecran'

export const metadata: Metadata = {
  title: 'Comment je travaille, NMW Studios',
  description:
    'En marque blanche pour une agence parisienne depuis un an. Cinq étapes, et à chacune quelque chose entre vos mains, avec une date.',
}

const MISSIONS = [
  ['Une application de saisie sur tablette pour les équipes terrain d’un grand groupe.'],
  ['Un backoffice de jeu concours à forte audience.', 'Tirage, notifications automatiques, suivi de performance.'],
  ['La reprise et la maintenance d’un parc d’applications existantes.'],
] as const

// Chaque étape finit par ce que vous avez en main.
const ETAPES = [
  ['Cadrage', 'On écrit ce que le projet doit faire, et ce qu’il ne fera pas.', 'Vous repartez avec un périmètre écrit, un prix et une date.'],
  ['Conception', 'Vos maquettes, intégrées telles quelles ; les miennes seulement si vous n’en avez pas. Si un élément ne tient pas techniquement, je le dis avant de commencer.', 'La liste des écrans, avec les points signalés.'],
  ['Développement', 'Des versions visibles au fil du chantier. Si une date glisse, vous le savez avant, pas après.', 'Une adresse où voir l’avancement.'],
  ['Mise en ligne', 'Sur votre hébergement ou sur le mien.', 'Le projet en ligne, transférable.'],
  ['Suivi', 'Si vous le souhaitez.', 'Sinon, le code et la documentation.'],
] as const

export default function Page() {
  return (
    <Ecran classe="methode">
      <div className="preuve">
        <div>
          <h2>
            Depuis un an, une agence parisienne me confie ses applications et ses nouveaux projets.
          </h2>
          <p className="lead">
            Je travaille pour elle en marque blanche : ses maquettes, ses délais, son nom devant son
            client. Si vous êtes une agence, c’est la même chose pour vous : vos maquettes, vos délais,
            votre nom devant votre client.
          </p>
          <p>
            Je ne contacte jamais votre client. Je ne signe pas mon travail. Je ne cite ni votre nom ni
            le sien, et je ne conserve aucun accès une fois le chantier livré. Ce que je peux décrire :
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
          {ETAPES.map(([titre, quoi, livrable]) => (
            <li key={titre}>
              <h3>{titre}</h3>
              <p>
                {quoi} <strong>{livrable}</strong>
              </p>
            </li>
          ))}
        </ol>
      </div>
    </Ecran>
  )
}
