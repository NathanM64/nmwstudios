import Link from 'next/link'
import type { Offre } from '@/content/offres'

export function Detail({ offre }: { offre: Offre }) {
  return (
    <div className="detail panel">
      <h3>{offre.titre}</h3>
      {offre.paragraphes.map((p) => (
        <p key={p}>{p}</p>
      ))}
      <p>
        <Link href="/contact">{offre.appel}</Link>
      </p>
    </div>
  )
}
