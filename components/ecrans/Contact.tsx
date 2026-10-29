import Link from 'next/link'
import type { Dictionnaire } from '@/content/types'
import { Ecran } from '@/components/Ecran'
import { FormulaireContact } from '@/components/FormulaireContact'
import { BEGLES, LINKEDIN } from '@/lib/meta'

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
          {c.local ? (
            <>
              {c.local[0]}
              <Link href={BEGLES}>{c.local[1]}</Link>
              {c.local[2]}
            </>
          ) : (
            c.lieu
          )}
          <br />
          {c.statut}
          <Link href={t.routes.legal}>{c.lienLegal}</Link>.
          <br />
          {c.surLinkedin}
          <a href={LINKEDIN} target="_blank" rel="noopener" aria-label={t.chrome.linkedin}>
            LinkedIn
          </a>
          .
        </p>
      </div>
      <FormulaireContact t={t.formulaire} />
    </Ecran>
  )
}
