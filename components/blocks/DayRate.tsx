import { Glass } from '@/components/ui/Glass'
import { Section } from '@/components/ui/Section'
import { LEGAL, DAY_RATE } from '@/lib/legal'

// Le chiffre ne vivait que sur l'accueil : une page d'offre atteinte depuis une recherche
// laissait repartir son lecteur sans le prix. Un seul composant pour les trois, sinon les
// trois formulations divergent au premier changement de tarif.
export function DayRate() {
  return (
    <Section id="tarif" title="Le tarif, identique pour les trois modes." density="low">
      <Glass thick className="rise mt-10 grid gap-x-14 gap-y-8 px-7 py-9 sm:px-10 sm:py-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:items-center">
        <p className="flex flex-wrap items-baseline gap-x-4">
          <span className="figures font-display text-[clamp(2.8rem,7vw,4rem)] font-extrabold leading-[0.85] tracking-[-0.05em]">
            {DAY_RATE} €
          </span>
          <span className="font-display text-xl font-bold tracking-[-0.02em] text-ink-soft">
            la journée
          </span>
        </p>
        <div className="max-w-[36rem] leading-relaxed text-ink-soft">
          <p>
            Renfort, projet complet, reprise et maintenance : c’est le même chiffre. Une journée
            de travail vaut 7 h 30, et ce que vous achetez est un nombre de jours, écrit et validé
            avant de commencer.
          </p>
          <p className="mt-5 border-t border-ink/10 pt-5 text-sm">{LEGAL.vatNotice}</p>
        </div>
      </Glass>
    </Section>
  )
}
