import { Container } from '@/components/ui/Container'

export function Surtitre({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-carbone">{children}</p>
  )
}

// La respiration suit le poids : une section de transition ne pèse pas autant qu'un argument.
const DENSITES = {
  basse: 'py-12 sm:py-16',
  normale: 'py-16 sm:py-24',
} as const

export function Section({
  id,
  surtitre,
  titre,
  chapeau,
  largeur = 'normale',
  fond,
  densite = 'normale',
  children,
}: {
  id?: string
  surtitre?: string
  titre?: React.ReactNode
  chapeau?: React.ReactNode
  largeur?: 'normale' | 'serree' | 'pleine'
  fond?: 'creux'
  densite?: keyof typeof DENSITES
  children?: React.ReactNode
}) {
  const entete = surtitre ?? titre ?? chapeau
  return (
    <section
      id={id}
      className={`regle ${DENSITES[densite]} ${fond === 'creux' ? 'bg-papier-creux' : ''}`}
    >
      {entete ? (
        <Container largeur={largeur === 'pleine' ? 'normale' : largeur}>
          {surtitre ? <Surtitre>{surtitre}</Surtitre> : null}
          {titre ? (
            <h2 className="mt-5 max-w-3xl font-display text-[clamp(1.7rem,3.6vw,2.6rem)] font-bold leading-[1.06] tracking-[-0.025em]">
              {titre}
            </h2>
          ) : null}
          {chapeau ? (
            <div className="mt-6 max-w-2xl text-lg text-encre-sourde">{chapeau}</div>
          ) : null}
        </Container>
      ) : null}
      {/* Pleine largeur : le bloc traverse la page, au lieu d'être posé dans le conteneur. */}
      {largeur === 'pleine' ? children : <Container largeur={largeur}>{children}</Container>}
    </section>
  )
}
