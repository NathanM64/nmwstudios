'use client'

import { usePathname } from 'next/navigation'
import { dico, langueDuChemin, sansBarre } from '@/content'

// Le même titre sur les cinq routes des offres : un h1 sur l'index, un simple paragraphe sur les sous-routes,
// où c'est la carte ouverte qui porte le h1.
export function TitreOffres({ children }: { children: React.ReactNode }) {
  const chemin = sansBarre(usePathname())
  const index = chemin === dico(langueDuChemin(chemin)).routes.offres
  return index ? <h1>{children}</h1> : <p className="comme-titre">{children}</p>
}
