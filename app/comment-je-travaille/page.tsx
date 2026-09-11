import type { Metadata } from 'next'
import { Ecran } from '@/components/Ecran'

export const metadata: Metadata = {
  title: 'Comment je travaille, nmwstudios',
  description:
    'Cadrage, conception, développement, mise en production, suivi. En marque blanche pour une agence parisienne.',
}

export default function Page() {
  return (
    <Ecran>
      <div>
        <h2>Comment je travaille.</h2>
        <ol className="etapes">
          <li>
            <h3>Cadrage</h3>
            <p>On écrit ce que le projet doit faire, et ce qu’il ne fera pas.</p>
          </li>
          <li>
            <h3>Conception</h3>
            <p>Vos maquettes ou les miennes, des choix techniques expliqués en français.</p>
          </li>
          <li>
            <h3>Développement</h3>
            <p>Des versions visibles au fil du chantier.</p>
          </li>
          <li>
            <h3>Mise en production</h3>
            <p>Sur votre hébergement ou sur le mien, transférable.</p>
          </li>
          <li>
            <h3>Suivi</h3>
            <p>Si vous le souhaitez. Sinon, vous repartez avec le code et la documentation.</p>
          </li>
        </ol>
      </div>
      <div>
        <p className="lead">
          Une agence parisienne m’a confié l’ensemble de son parc applicatif et ses nouveaux projets. Je
          travaille pour elle en marque blanche : ses maquettes, ses délais, son nom devant le client.
        </p>
        <p>Je ne cite aucun client, ni les siens, ni les miens. Ce que je peux décrire :</p>
        <ul className="missions">
          <li>une application de saisie sur tablette pour les équipes terrain d’un grand groupe ;</li>
          <li>
            un backoffice de jeu concours à forte audience, avec tirage, notifications automatiques et
            suivi de performance ;
          </li>
          <li>la reprise et la maintenance d’un parc d’applications existantes.</li>
        </ul>
      </div>
    </Ecran>
  )
}
