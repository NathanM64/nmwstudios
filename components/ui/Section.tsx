import { Container } from '@/components/ui/Container'

// Breathing follows weight: a transition section does not weigh as much as an argument.
const DENSITIES = {
  low: 'py-16 sm:py-20',
  normal: 'py-24 sm:py-32',
} as const

// No label above a heading: the heading carries its own weight.
export function Section({
  id,
  title,
  intro,
  width = 'normal',
  background,
  density = 'normal',
  children,
}: {
  id?: string
  title?: React.ReactNode
  intro?: React.ReactNode
  width?: 'normal' | 'narrow' | 'full'
  background?: 'sunken'
  density?: keyof typeof DENSITIES
  children?: React.ReactNode
}) {
  return (
    <section
      id={id}
      className={`${DENSITIES[density]} ${background === 'sunken' ? 'bg-paper-sunken/70' : ''}`}
    >
      {title || intro ? (
        <Container width={width === 'full' ? 'normal' : width}>
          {title ? (
            <h2 className="rise max-w-[22ch] font-display text-[clamp(1.9rem,4.2vw,3rem)] font-extrabold leading-[1.03] tracking-[-0.03em] text-balance">
              {title}
            </h2>
          ) : null}
          {intro ? (
            <div className="rise mt-7 max-w-[40rem] text-lg leading-relaxed text-ink-soft">
              {intro}
            </div>
          ) : null}
        </Container>
      ) : null}
      {/* Full width: the block crosses the page instead of sitting inside the container. */}
      {width === 'full' ? children : <Container width={width}>{children}</Container>}
    </section>
  )
}
