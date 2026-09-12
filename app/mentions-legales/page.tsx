import type { Metadata } from 'next'
import { LEGAL } from '@/lib/legal'

export const metadata: Metadata = {
  alternates: { canonical: '/mentions-legales/' },
  openGraph: { url: '/mentions-legales/' }, title: 'Mentions légales, NMW Studios',
  description: 'Éditeur, hébergeur et données personnelles du site nmwstudios.com.',
  robots: { index: false } }

export default function Page() {
  return (
    <section className="document">
      <h1>Mentions légales.</h1>
      <h2>Éditeur</h2>
      <p>
        {LEGAL.legalName}, {LEGAL.legalForm.toLowerCase()}. SIRET {LEGAL.siret}. {LEGAL.address}.{' '}
        {LEGAL.vatNotice}.
      </p>
      <p>
        Directeur de la publication : {LEGAL.publisher}. Contact :{' '}
        <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>.
      </p>
      <h2>Hébergement</h2>
      <p>
        {LEGAL.host.name}, {LEGAL.host.address}. Téléphone {LEGAL.host.phone}.
      </p>
      <h2>Données personnelles</h2>
      <p>
        Le formulaire de contact transmet votre nom, votre email et votre message, uniquement pour
        vous répondre. Rien d’autre n’est collecté : pas de cookie, pas de mesure d’audience. Pour
        faire modifier ou supprimer ces données, écrivez à l’adresse ci-dessus.
      </p>
    </section>
  )
}
