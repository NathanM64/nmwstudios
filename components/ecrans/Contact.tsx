import Link from 'next/link'
import type { Dictionnaire } from '@/content/types'
import { Ecran } from '@/components/Ecran'
import { FormulaireContact } from '@/components/FormulaireContact'

export function Contact({ t }: { t: Dictionnaire }) {
  const c = t.contact
  return (
    <Ecran classe="contact-ecran">
      <div>
        <h1>
          {c.h1[0]} <span className="client">{c.h1[1]}</span>
        </h1>
        <p className="lead">{c.lead}</p>
        <p>{c.pieces}</p>
        <p className="email">
          <a href="mailto:contact@nmwstudios.com">contact@nmwstudios.com</a>
        </p>
        <p className="faits">
          <strong>Nathan Marimbordes</strong>
          {c.role}
          <br />
          {c.lieu}
          <br />
          {c.statut}
          <Link href={t.routes.legal}>{c.lienLegal}</Link>.
        </p>
      </div>
      <FormulaireContact t={t.formulaire} />
    </Ecran>
  )
}
