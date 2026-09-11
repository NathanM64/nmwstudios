import { ViewTransition } from 'react'
import { Ecran } from '@/components/Ecran'
import { ListeOffres } from './ListeOffres'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Ecran>
      <div>
        <h2>Ce que je fais.</h2>
        <ListeOffres />
      </div>
      {/* Seul le détail change d'une offre à l'autre : c'est lui qui fond, pas l'écran. */}
      <ViewTransition name="detail" update="detail">
        <div>{children}</div>
      </ViewTransition>
    </Ecran>
  )
}
