import type { Metadata } from 'next'
import Link from 'next/link'
import { Ecran } from '@/components/Ecran'
import { FormulaireContact } from '@/components/FormulaireContact'

export const metadata: Metadata = {
  title: 'Contact, NMW Studios',
  description: 'Parlons de votre projet. Un message suffit, je le lis moi-même et je réponds dans la journée.',
}

export default function Page() {
  return (
    <Ecran classe="contact-ecran">
      <div>
        <h2>
          Parlons de <span className="client">votre projet.</span>
        </h2>
        <p className="lead">Un message suffit. Je le lis moi-même et je réponds dans la journée.</p>
        <p>Des maquettes ou un cahier des charges à joindre ? Par email, en pièce jointe.</p>
        <p className="email">
          <a href="mailto:contact@nmwstudios.com">contact@nmwstudios.com</a>
        </p>
        <p className="faits">
          <strong>Nathan Marimbordes</strong>, développeur web indépendant.
          <br />
          Bègles, près de Bordeaux. À distance pour toute la France.
          <br />
          Entrepreneur individuel, <Link href="/mentions-legales">SIRET et mentions légales</Link>.
        </p>
      </div>
      <FormulaireContact />
    </Ecran>
  )
}
