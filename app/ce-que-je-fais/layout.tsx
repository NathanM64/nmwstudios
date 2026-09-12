import { Ecran } from '@/components/Ecran'
import { ListeOffres } from './ListeOffres'
import { TitreOffres } from './TitreOffres'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Ecran classe="offres">
      <div className="entete">
        <TitreOffres>
          Cinq façons de travailler ensemble. <span className="client">Une que peu de gens proposent.</span>
        </TitreOffres>
        <p className="lead">
          Créer, reprendre, automatiser, héberger. Et reprendre ce qui existe déjà, au lieu de refaire :
          c’est la plus rare.
        </p>
      </div>
      <nav className="cartes" aria-label="Offres">
        {children}
        <ListeOffres />
      </nav>
    </Ecran>
  )
}
