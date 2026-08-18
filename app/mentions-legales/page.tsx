import { Container } from '@/components/ui/Container'
import { Footer } from '@/components/shell/Footer'
import { LEGAL } from '@/lib/legal'

export const metadata = { title: 'Mentions légales' }

export default function Page() {
  return (
    <>
      <main className="py-24">
        <Container className="space-y-8">
          <h1 className="text-3xl font-bold">Mentions légales</h1>

          <section className="space-y-1">
            <h2 className="font-mono text-xs uppercase tracking-[0.08em] text-accent">Éditeur</h2>
            <p>{LEGAL.denomination} — {LEGAL.formeJuridique}</p>
            <p>{LEGAL.adresse}</p>
            <p>SIRET : {LEGAL.siret}</p>
            <p>TVA : {LEGAL.tva}</p>
            <p>Directeur de la publication : {LEGAL.directeurPublication}</p>
            <p>Contact : <a href={`mailto:${LEGAL.email}`} className="hover:text-foreground">{LEGAL.email}</a></p>
            <p>Téléphone : <a href="tel:+33689801589" className="hover:text-foreground">{LEGAL.telephone}</a></p>
          </section>

          <section className="space-y-1">
            <h2 className="font-mono text-xs uppercase tracking-[0.08em] text-accent">Hébergeur</h2>
            <p>{LEGAL.hebergeur.nom}</p>
            <p>{LEGAL.hebergeur.adresse}</p>
            <p>Téléphone : {LEGAL.hebergeur.telephone}</p>
          </section>
        </Container>
      </main>
      <Footer />
    </>
  )
}
