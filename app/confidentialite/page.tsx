import { Container } from '@/components/ui/Container'
import { Footer } from '@/components/shell/Footer'
import { LEGAL } from '@/lib/legal'

export const metadata = { title: 'Politique de confidentialité' }

export default function Page() {
  return (
    <>
      <main className="py-24">
        <Container className="space-y-8">
          <h1 className="text-3xl font-bold">Politique de confidentialité</h1>

          <section className="space-y-2">
            <h2 className="font-mono text-xs uppercase tracking-[0.08em] text-accent">Données personnelles</h2>
            <p>
              Ce site ne collecte aucune donnée personnelle à ce jour. Il ne comporte ni
              formulaire, ni compte utilisateur, ni mesure d’audience.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-mono text-xs uppercase tracking-[0.08em] text-accent">Cookies</h2>
            <p>
              Deux cookies sont déposés, tous deux strictement nécessaires au fonctionnement du
              site : <code>nmw-theme</code> mémorise le thème choisi (sombre ou clair) pendant un
              an, et <code>nmw-audience</code> mémorise la porte choisie (entreprise ou agence)
              pendant 90 jours.
            </p>
            <p>
              Étant strictement nécessaires au service demandé, ils sont exemptés de consentement
              au sens de la recommandation de la CNIL sur les cookies et autres traceurs. Vous
              pouvez les supprimer à tout moment depuis les réglages de votre navigateur.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-mono text-xs uppercase tracking-[0.08em] text-accent">Évolution</h2>
            <p>
              Un formulaire de contact est prévu. Cette politique sera mise à jour avant sa mise
              en ligne pour décrire les données alors collectées.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-mono text-xs uppercase tracking-[0.08em] text-accent">Vos droits</h2>
            <p>
              Vous disposez d’un droit d’accès, de rectification, d’effacement et d’opposition, à
              exercer à l’adresse {LEGAL.email}. Vous pouvez introduire une réclamation auprès de
              la CNIL.
            </p>
          </section>
        </Container>
      </main>
      <Footer />
    </>
  )
}
