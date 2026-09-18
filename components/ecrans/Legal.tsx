import type { Dictionnaire } from '@/content/types'
import { LEGAL } from '@/lib/legal'

export function Legal({ t }: { t: Dictionnaire }) {
  const l = t.legal
  return (
    <section className="document">
      <h1>{l.h1}</h1>
      <h2>{l.editeur}</h2>
      <p>
        {LEGAL.legalName}, {l.statut}. SIRET {LEGAL.siret}. {LEGAL.address}. {l.tva}.
      </p>
      <p>
        {l.directeur} {LEGAL.publisher}. {l.contact} <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>.
      </p>
      <h2>{l.hebergement}</h2>
      <p>
        {LEGAL.host.name}, {LEGAL.host.address}. {l.telephone} {LEGAL.host.phone}.
      </p>
      <h2>{l.donnees}</h2>
      <p>{l.donneesTexte}</p>
    </section>
  )
}
