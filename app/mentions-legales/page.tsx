import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { Verre } from '@/components/ui/Verre'
import { Entete } from '@/components/shell/Entete'
import { Pied } from '@/components/shell/Pied'
import { LEGAL } from '@/lib/legal'

export const metadata: Metadata = {
  title: 'Mentions légales',
  // L'adresse postale est obligatoire ici, pas dans les moteurs de recherche.
  robots: { index: false, follow: true },
}

function Bloc({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <Verre className="px-7 py-8 sm:px-9">
      <h2 className="font-display text-xl font-extrabold tracking-[-0.025em]">{titre}</h2>
      <div className="mt-5 space-y-1.5 leading-relaxed text-encre-douce">{children}</div>
    </Verre>
  )
}

export default function Page() {
  return (
    <>
      <Entete />
      <main className="py-20 sm:py-24">
        <Container>
          <h1 className="entre max-w-[14ch] font-display text-[clamp(2rem,4.6vw,3rem)] font-extrabold leading-[1] tracking-[-0.035em]">
            Mentions légales
          </h1>

          <div
            className="entre mt-14 grid gap-5 lg:grid-cols-2"
            style={{ '--rang': 1 } as React.CSSProperties}
          >
            <Bloc titre="Éditeur">
              <p className="text-encre">
                {LEGAL.denomination}, {LEGAL.formeJuridique}
              </p>
              <p>{LEGAL.adresse}</p>
              <p className="chiffres">SIRET : {LEGAL.siret}</p>
              <p>{LEGAL.tva}</p>
              <p>Directeur de la publication : {LEGAL.directeurPublication}</p>
              <p className="pt-2">
                <a href={`mailto:${LEGAL.email}`} className="lien-souligne text-encre">
                  {LEGAL.email}
                </a>
              </p>
              <p>
                <a href={`tel:${LEGAL.telephoneLien}`} className="chiffres lien-souligne text-encre">
                  {LEGAL.telephone}
                </a>
              </p>
            </Bloc>

            <Bloc titre="Hébergeur">
              <p className="text-encre">{LEGAL.hebergeur.nom}</p>
              <p>{LEGAL.hebergeur.adresse}</p>
              <p className="chiffres">Téléphone : {LEGAL.hebergeur.telephone}</p>
            </Bloc>

            <Verre className="px-7 py-8 sm:px-9 lg:col-span-2">
              <h2 className="font-display text-xl font-extrabold tracking-[-0.025em]">
                Données personnelles
              </h2>
              <div className="mt-5 grid max-w-[76rem] gap-x-14 gap-y-4 leading-relaxed text-encre-douce md:grid-cols-2">
                <p>
                  Ce site est statique. Il ne dépose aucun cookie, ne charge aucune ressource
                  depuis un service tiers et ne mesure pas la fréquentation. Aucune donnée n’est
                  collectée lors de la consultation.
                </p>
                <p>
                  Les messages envoyés à l’adresse de contact sont conservés le temps de la
                  relation commerciale. Vous pouvez en demander la suppression à cette même
                  adresse.
                </p>
              </div>
            </Verre>
          </div>
        </Container>
      </main>
      <Pied />
    </>
  )
}
