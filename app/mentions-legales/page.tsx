import type { Metadata } from 'next'
import { og } from '@/lib/meta'
import { Container } from '@/components/ui/Container'
import { Glass } from '@/components/ui/Glass'
import { Header } from '@/components/shell/Header'
import { Footer } from '@/components/shell/Footer'
import { LEGAL } from '@/lib/legal'

export const metadata: Metadata = {
  title: 'Mentions légales',
  // L'adresse postale est obligatoire ici, pas dans les moteurs de recherche.
  robots: { index: false, follow: true },
  alternates: { canonical: '/mentions-legales/' },
  openGraph: og('/mentions-legales/'),
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Glass className="px-7 py-8 sm:px-9">
      <h2 className="font-display text-xl font-extrabold tracking-[-0.025em]">{title}</h2>
      <div className="mt-5 space-y-1.5 leading-relaxed text-ink-soft">{children}</div>
    </Glass>
  )
}

export default function Page() {
  return (
    <>
      <Header />
      <main id="contenu" className="py-20 sm:py-24">
        <Container>
          <h1 className="enter max-w-[14ch] font-display text-[clamp(2rem,4.6vw,3rem)] font-extrabold leading-[1] tracking-[-0.035em]">
            Mentions légales
          </h1>

          <div
            className="enter mt-14 grid gap-5 lg:grid-cols-2"
            style={{ '--rank': 1 } as React.CSSProperties}
          >
            <Block title="Éditeur">
              <p className="text-ink">
                {LEGAL.legalName}, {LEGAL.legalForm}
              </p>
              <p>{LEGAL.address}</p>
              <p className="figures">SIRET : {LEGAL.siret}</p>
              <p>{LEGAL.vatNotice}</p>
              <p>Directeur de la publication : {LEGAL.publisher}</p>
              <p className="pt-2">
                <a href={`mailto:${LEGAL.email}`} className="link-underline text-ink">
                  {LEGAL.email}
                </a>
              </p>
              <p>
                <a href={`tel:${LEGAL.phoneHref}`} className="figures link-underline text-ink">
                  {LEGAL.phone}
                </a>
              </p>
            </Block>

            <Block title="Hébergeur">
              <p className="text-ink">{LEGAL.host.name}</p>
              <p>{LEGAL.host.address}</p>
              <p className="figures">Téléphone : {LEGAL.host.phone}</p>
            </Block>

            <Glass className="px-7 py-8 sm:px-9 lg:col-span-2">
              <h2 className="font-display text-xl font-extrabold tracking-[-0.025em]">
                Données personnelles
              </h2>
              <div className="mt-5 grid max-w-[76rem] gap-x-14 gap-y-4 leading-relaxed text-ink-soft md:grid-cols-2">
                <div className="space-y-4">
                  <p>
                    Ce site est statique. Il ne dépose aucun cookie et ne charge aucune ressource
                    depuis un service tiers.
                  </p>
                  {/* "À ce jour" is the one sentence to rewrite the day analytics arrive.
                      A test guards it: see tests/e2e/site.spec.ts. */}
                  <p>
                    Aucune mesure d’audience n’est en place à ce jour, et aucune donnée n’est
                    collectée lors de la consultation. Si une mesure est mise en place, elle sera
                    hébergée sur le même serveur, sans cookie, et sans donnée permettant de vous
                    identifier ni de vous suivre d’un site à l’autre.
                  </p>
                </div>
                <div className="space-y-4">
                  <p>
                    Le formulaire de contact transmet le nom, l’adresse électronique et le
                    message que vous y écrivez. Ces informations servent uniquement à vous
                    répondre. Elles transitent par Resend, prestataire d’envoi de courriels, et
                    arrivent dans la boîte de l’adresse de contact.
                  </p>
                  <p>
                    Les messages reçus, par le formulaire comme à l’adresse de contact, sont
                    conservés le temps de la relation commerciale. Vous pouvez en demander la
                    suppression à cette même adresse.
                  </p>
                </div>
              </div>
            </Glass>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  )
}
