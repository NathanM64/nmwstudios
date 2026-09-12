import type { Metadata } from 'next'
import Link from 'next/link'
import { Ecran } from '@/components/Ecran'

export const metadata: Metadata = {
  title: 'Page introuvable, NMW Studios',
  description: 'Cette page n’existe pas ou n’existe plus.',
  robots: { index: false },
}

export default function NotFound() {
  return (
    <Ecran classe="introuvable">
      <div>
        <h1>
          Cette page <span className="client">n’existe pas.</span>
        </h1>
        <p className="lead">Ou elle n’existe plus. Les cinq écrans du site sont dans le menu.</p>
        <p className="actions">
          <Link className="bouton" href="/">
            Retour à l’accueil
          </Link>
        </p>
      </div>
    </Ecran>
  )
}
