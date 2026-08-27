import { Container } from '@/components/ui/Container'

// La respiration suit le poids : une section de transition ne pèse pas autant qu'un argument.
const DENSITES = {
  basse: 'py-16 sm:py-20',
  normale: 'py-24 sm:py-32',
} as const

// Aucune étiquette au-dessus d'un titre : le titre porte son propre poids.
export function Section({
  id,
  titre,
  chapeau,
  largeur = 'normale',
  fond,
  densite = 'normale',
  children,
}: {
  id?: string
  titre?: React.ReactNode
  chapeau?: React.ReactNode
  largeur?: 'normale' | 'serree' | 'pleine'
  fond?: 'creux'
  densite?: keyof typeof DENSITES
  children?: React.ReactNode
}) {
  return (
    <section
      id={id}
      className={`${DENSITES[densite]} ${fond === 'creux' ? 'bg-papier-creux/70' : ''}`}
    >
      {titre || chapeau ? (
        <Container largeur={largeur === 'pleine' ? 'normale' : largeur}>
          {titre ? (
            <h2 className="monte max-w-[22ch] font-display text-[clamp(1.9rem,4.2vw,3rem)] font-extrabold leading-[1.03] tracking-[-0.03em] text-balance">
              {titre}
            </h2>
          ) : null}
          {chapeau ? (
            <div className="monte mt-7 max-w-[40rem] text-lg leading-relaxed text-encre-douce">
              {chapeau}
            </div>
          ) : null}
        </Container>
      ) : null}
      {/* Pleine largeur : le bloc traverse la page au lieu d'être posé dans le conteneur. */}
      {largeur === 'pleine' ? children : <Container largeur={largeur}>{children}</Container>}
    </section>
  )
}
