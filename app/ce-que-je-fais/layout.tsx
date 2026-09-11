import { Ecran } from '@/components/Ecran'
import { ListeOffres } from './ListeOffres'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Ecran classe="offres">
      <div className="entete">
        <h2>Je crée, je reprends, j’automatise, j’héberge. Vous choisissez où je commence.</h2>
        <p className="lead">
          Cinq façons de travailler ensemble. La plus fréquente chez moi : reprendre ce qui existe déjà,
          parce que tout le marché vend du neuf.
        </p>
      </div>
      <nav className="cartes" aria-label="Offres">
        {children}
        <ListeOffres />
      </nav>
    </Ecran>
  )
}
