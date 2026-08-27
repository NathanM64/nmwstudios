import { Container } from '@/components/ui/Container'

export function Surtitre({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-carbone">{children}</p>
  )
}

export function Section({
  id,
  surtitre,
  titre,
  chapeau,
  children,
}: {
  id?: string
  surtitre?: string
  titre?: React.ReactNode
  chapeau?: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <section id={id} className="regle py-16 sm:py-24">
      <Container>
        {surtitre ? <Surtitre>{surtitre}</Surtitre> : null}
        {titre ? (
          <h2 className="mt-5 max-w-3xl font-display text-[clamp(1.7rem,3.6vw,2.6rem)] font-bold leading-[1.06] tracking-[-0.025em]">
            {titre}
          </h2>
        ) : null}
        {chapeau ? <div className="mt-6 max-w-2xl text-lg text-encre-sourde">{chapeau}</div> : null}
        {children}
      </Container>
    </section>
  )
}
