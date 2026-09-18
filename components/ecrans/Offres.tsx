import type { ReactNode } from 'react'
import type { Dictionnaire } from '@/content/types'
import { Ecran } from '@/components/Ecran'
import { ListeOffres } from '@/components/ListeOffres'
import { TitreOffres } from '@/components/TitreOffres'

// Le cadre des offres : le titre partagé, la carte ouverte (children), puis les cartes fermées.
export function Offres({ t, children }: { t: Dictionnaire; children: ReactNode }) {
  return (
    <Ecran classe="offres">
      <div className="entete">
        <TitreOffres>
          {t.offres.titre[0]} <span className="client">{t.offres.titre[1]}</span>
        </TitreOffres>
        <p className="lead">{t.offres.lead}</p>
      </div>
      <nav className="cartes" aria-label={t.ecrans[1].titre}>
        {children}
        <ListeOffres />
      </nav>
    </Ecran>
  )
}
