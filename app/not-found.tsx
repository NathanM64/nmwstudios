import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Entete } from '@/components/shell/Entete'
import { Pied } from '@/components/shell/Pied'

export default function NotFound() {
  return (
    <>
      <Entete />
      <main className="regle py-28">
        <Container>
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-carbone">
            Erreur 404
          </p>
          <h1 className="mt-8 max-w-[16ch] font-display text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-[1] tracking-[-0.035em]">
            Cette page n’existe pas.
          </h1>
          <p className="mt-8 max-w-xl text-lg text-encre-sourde">
            Le lien est peut-être ancien. Les deux pages du site sont l’accueil et la reprise de
            site existant.
          </p>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 font-mono text-xs uppercase tracking-[0.14em]">
            <Link href="/" className="text-carbone hover:underline">
              Accueil
            </Link>
            <Link href="/reprise-et-maintenance/" className="text-carbone hover:underline">
              Reprise et maintenance
            </Link>
          </div>
        </Container>
      </main>
      <Pied />
    </>
  )
}
