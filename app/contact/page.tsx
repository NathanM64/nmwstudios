import type { Metadata } from 'next'
import Link from 'next/link'
import { Ecran } from '@/components/Ecran'
import { FormulaireContact } from '@/components/FormulaireContact'

export const metadata: Metadata = {
  alternates: { canonical: '/contact/' },
  openGraph: { url: '/contact/' },
  title: 'Contact, parlons de votre projet, NMW Studios à Bordeaux',
  description:
    'Un message suffit, je le lis moi-même et je réponds dans la journée. Nathan Marimbordes, développeur web indépendant, à Bordeaux.',
}

export default function Page() {
  return (
    <Ecran classe="contact-ecran">
      <div>
        <h1>
          Parlons de <span className="client">votre projet.</span>
        </h1>
        <p className="lead">Un message suffit. Je le lis moi-même et je réponds dans la journée.</p>
        <p>Des maquettes ou un cahier des charges à joindre ? Par email, en pièce jointe.</p>
        <p className="email">
          <a href="mailto:contact@nmwstudios.com">contact@nmwstudios.com</a>
        </p>
        <p className="faits">
          <strong>Nathan Marimbordes</strong>, développeur web indépendant.
          <br />
          Bordeaux. À distance pour toute la France.
          <br />
          Entrepreneur individuel, <Link href="/mentions-legales">SIRET et mentions légales</Link>.
        </p>
      </div>
      <FormulaireContact />
    </Ecran>
  )
}
