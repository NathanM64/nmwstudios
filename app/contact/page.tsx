import type { Metadata } from 'next'
import { Ecran } from '@/components/Ecran'
import { FormulaireContact } from '@/components/FormulaireContact'

export const metadata: Metadata = {
  title: 'Contact, NMW Studios',
  description: 'Parlons de votre projet. Trois champs suffisent, c’est moi qui vous réponds.',
}

export default function Page() {
  return (
    <Ecran>
      <div>
        <h2>Parlons de votre projet.</h2>
        <p className="lead">Trois champs suffisent. C’est moi qui vous réponds.</p>
        <p>
          Ou par email : <a href="mailto:contact@nmwstudios.com">contact@nmwstudios.com</a>
        </p>
      </div>
      <FormulaireContact />
    </Ecran>
  )
}
