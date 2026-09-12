import { Ecran } from '@/components/Ecran'
import { ListeOffres } from './ListeOffres'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Ecran classe="offres">
      <div className="entete">
        <h2>
          Je crée, je reprends, j’automatise, j’héberge. <span className="client">Vous choisissez où je commence.</span>
        </h2>
        <p className="lead">
          Cinq façons de travailler ensemble. Celle que peu de gens proposent : reprendre ce qui existe
          déjà, au lieu de refaire.
        </p>
      </div>
      <nav className="cartes" aria-label="Offres">
        {children}
        <ListeOffres />
      </nav>
    </Ecran>
  )
}
