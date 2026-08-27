import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { Surtitre } from '@/components/ui/Section'
import { Entete } from '@/components/shell/Entete'
import { Pied } from '@/components/shell/Pied'
import { LEGAL } from '@/lib/legal'

export const metadata: Metadata = { title: 'Mentions légales' }

export default function Page() {
  return (
    <>
      <Entete />
      <main className="regle py-20">
        <Container className="space-y-12">
          <h1 className="font-display text-3xl font-extrabold tracking-[-0.03em]">
            Mentions légales
          </h1>

          <section className="space-y-1">
            <Surtitre>Éditeur</Surtitre>
            <p className="pt-3">
              {LEGAL.denomination}, {LEGAL.formeJuridique}
            </p>
            <p>{LEGAL.adresse}</p>
            <p>SIRET : {LEGAL.siret}</p>
            <p>{LEGAL.tva}</p>
            <p>Directeur de la publication : {LEGAL.directeurPublication}</p>
            <p>
              Contact :{' '}
              <a href={`mailto:${LEGAL.email}`} className="text-carbone hover:underline">
                {LEGAL.email}
              </a>
            </p>
            <p>
              Téléphone :{' '}
              <a href={`tel:${LEGAL.telephoneLien}`} className="text-carbone hover:underline">
                {LEGAL.telephone}
              </a>
            </p>
          </section>

          <section className="space-y-1">
            <Surtitre>Hébergeur</Surtitre>
            <p className="pt-3">{LEGAL.hebergeur.nom}</p>
            <p>{LEGAL.hebergeur.adresse}</p>
            <p>Téléphone : {LEGAL.hebergeur.telephone}</p>
          </section>

          <section className="space-y-3">
            <Surtitre>Données personnelles</Surtitre>
            <p className="max-w-2xl pt-3">
              Ce site est statique. Il ne dépose aucun cookie, ne charge aucune ressource depuis
              un service tiers et ne mesure pas la fréquentation. Aucune donnée n’est collectée
              lors de la consultation.
            </p>
            <p className="max-w-2xl">
              Les messages envoyés à l’adresse de contact sont conservés le temps de la relation
              commerciale. Vous pouvez en demander la suppression à cette même adresse.
            </p>
          </section>
        </Container>
      </main>
      <Pied />
    </>
  )
}
