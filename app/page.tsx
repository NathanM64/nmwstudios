import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Glass } from '@/components/ui/Glass'
import { Logo } from '@/components/ui/Logo'
import { Header } from '@/components/shell/Header'
import { Footer } from '@/components/shell/Footer'
import { Contact } from '@/components/blocks/Contact'
import { OFFERS, type Offer } from '@/content/offers'
import { COMMITMENTS } from '@/content/commitments'
import { WORK } from '@/content/work'
import { LEGAL, DAY_RATE } from '@/lib/legal'
import { og } from '@/lib/meta'

export const metadata = { openGraph: og('/') }

export default function Page() {
  return (
    <>
      <Header />
      <main id="contenu">
        <Hero />
        <Modes />
        <WhiteLabel />
        <NoNames />
        <Rate />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

function Hero() {
  return (
    <section className="pb-14 pt-14 sm:pb-20 sm:pt-20">
      <Container>
        <div className="grid items-center gap-x-16 gap-y-14 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div>
            <h1 className="enter max-w-[16ch] font-display text-[clamp(2rem,4.6vw,3.4rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-balance">
              Le développeur des agences qui n’ont pas d’équipe technique.
            </h1>
            <p
              className="enter mt-8 max-w-[40rem] text-lg leading-relaxed text-ink-soft sm:text-xl"
              style={{ '--rank': 1 } as React.CSSProperties}
            >
              Je prends en charge vos projets web en marque blanche, de la reprise d’un existant
              à la mise en production.
            </p>
            <a
              href={`mailto:${LEGAL.email}`}
              className="link-underline enter mt-10 inline-block font-display text-xl font-bold tracking-[-0.02em]"
              style={{ '--rank': 2 } as React.CSSProperties}
            >
              Écrire un message
            </a>
          </div>

          <Plate />
        </div>
      </Container>
    </section>
  )
}

// A contract signature, left in the agency's name.
//
// The only place on the site without refraction, and the watermark is what forces it: a hairline
// running under an edge jumps all at once along the slab outline instead of folding. Frosted
// glass blurs it evenly, with no step. The fold stays everywhere else.
function Plate() {
  return (
    <div
      className="enter relative mx-auto aspect-[6/5] w-full max-w-[21rem] lg:mx-0"
      style={{ '--rank': 1 } as React.CSSProperties}
    >
      <span aria-hidden="true">
        <Logo className="absolute left-1/2 top-1/2 h-[104%] w-auto -translate-x-1/2 -translate-y-1/2 text-ink opacity-[0.08] blur-[1px]" />
      </span>
      <div className="glass absolute bottom-0 left-10 right-0 top-14" />
      <Glass
        thick
        sheen
        noFold
        className="absolute bottom-14 left-0 right-10 top-0 flex flex-col justify-between px-6 py-6"
      >
        <p className="max-w-[15ch] text-sm leading-snug text-ink-soft">
          Le travail est livré sous le nom de
        </p>
        <p className="font-display text-[clamp(1.6rem,4.4vw,2.1rem)] font-extrabold leading-[0.95] tracking-[-0.04em]">
          votre
          <br />
          agence
        </p>
      </Glass>
    </div>
  )
}

function Purpose({ offer }: { offer: Offer }) {
  return <span className="sr-only"> : {offer.title.toLowerCase()}</span>
}

function Modes() {
  const secondary = OFFERS.filter((offer) => !offer.primary)
  const primary = OFFERS.find((offer) => offer.primary)

  return (
    <Section
      title="Vous choisissez le niveau d’engagement, pas le tarif."
      intro={
        <p>
          Le tarif de la sous-traitance est le même dans les trois cas. Ce qui change, c’est ce que vous signez et
          pour combien de temps.
        </p>
      }
    >
      {/* Two slabs side by side, then a third that crosses: takeover gets the full width
          because it is the one that lasts. */}
      <div className="mt-14 grid gap-5 sm:grid-cols-2">
        {secondary.map((offer) => (
          <Glass key={offer.id} as="article" className="rise flex flex-col px-7 py-8 sm:px-9">
            <h3 className="font-display text-2xl font-extrabold leading-[1.1] tracking-[-0.03em]">
              {offer.title}
            </h3>
            <p className="mt-4 font-display text-lg font-bold leading-snug tracking-[-0.02em]">
              {offer.trigger}
            </p>
            <p className="mt-4 leading-relaxed text-ink-soft">{offer.body}</p>
            <p className="mt-auto pt-8 text-sm text-ink-soft">
              <span className="block border-t border-ink/10 pt-5">{offer.commitment}</span>
            </p>
            {offer.link ? (
              <Link
                href={offer.link.href}
                className="link-underline mt-5 inline-block self-start font-display font-bold tracking-[-0.01em]"
              >
                {offer.link.label}
                <Purpose offer={offer} />
              </Link>
            ) : null}
          </Glass>
        ))}
      </div>

      {primary ? (
        <Glass
          as="article"
          thick
          sheen
          className="rise mt-5 grid gap-x-14 gap-y-8 px-7 py-10 sm:px-11 sm:py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end"
        >
          <div>
            <h3 className="font-display text-[clamp(1.9rem,4vw,2.8rem)] font-extrabold leading-[1] tracking-[-0.04em]">
              {primary.title}
            </h3>
            <p className="mt-5 max-w-[20ch] font-display text-xl font-bold leading-snug tracking-[-0.025em] sm:text-2xl">
              {primary.trigger}
            </p>
          </div>
          <div>
            <p className="max-w-[38rem] text-lg leading-relaxed text-ink-soft">
              {primary.body}
            </p>
            <p className="mt-7 border-t border-ink/10 pt-5 text-sm text-ink-soft">
              {primary.commitment}
            </p>
            {primary.link ? (
              <Link
                href={primary.link.href}
                className="link-underline mt-4 inline-block font-display font-bold tracking-[-0.01em]"
              >
                {primary.link.label}
                <Purpose offer={primary} />
              </Link>
            ) : null}
          </div>
        </Glass>
      ) : null}
    </Section>
  )
}

// La contrepartie passe devant : ce qu'un prestataire ne fera pas est l'information que le
// lecteur cherche en premier, donc c'est elle qui porte la graisse.
function WhiteLabel() {
  return (
    <Section title="Je ne suis jamais devant votre client.">
      <ol className="mt-14">
        {COMMITMENTS.map((commitment, rank) => (
          <li
            key={commitment.fait}
            className="rise grid gap-x-14 gap-y-4 border-t border-ink/12 py-9 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:py-11"
          >
            <p className="font-display text-[clamp(1.25rem,2.6vw,1.7rem)] font-extrabold leading-[1.15] tracking-[-0.025em] text-balance">
              {commitment.pasFait}
            </p>
            <p
              className="stagger self-start leading-relaxed text-ink-soft"
              style={{ '--rank': rank } as React.CSSProperties}
            >
              {commitment.fait}
            </p>
          </li>
        ))}
      </ol>
      <p className="mt-12 max-w-[40rem] leading-relaxed text-ink-soft">
        Ces trois lignes sont reprises dans mes conditions de vente. Si votre agence a son propre
        accord de confidentialité, je signe le vôtre.
      </p>
      <p className="mt-5 max-w-[40rem] leading-relaxed text-ink-soft">
        Si vous êtes un studio, une ESN ou un indépendant qui sous-traite, le cadre est le même.
      </p>
    </Section>
  )
}

const PROOF_LINKS = [
  {
    title: 'Ce que je reprends',
    body:
      'Trois conditions décident d’une reprise, et aucune ne porte sur le langage. Avec les cas les plus fréquents, et ce que je refuse.',
    href: '/reprise-et-maintenance/#technos',
  },
  {
    title: 'L’état des lieux',
    body:
      'Ce que je fais quand je prends la main sur un projet que je n’ai pas écrit, dans l’ordre.',
    href: '/reprise-et-maintenance/#etat-des-lieux',
  },
  {
    title: 'Comment je rends la main',
    body: 'Ce que vous récupérez le jour où vous arrêtez, et ce que je ne garde pas.',
    href: '/reprise-et-maintenance/#depart',
  },
]

function NoNames() {
  return (
    <section className="bg-paper-sunken/70 py-24 sm:py-32">
      <Container>
        {/* The heading and the way out hold one column, the substance holds the other: the page
            says "no names" and shows what is behind it on the same screen. */}
        <div className="grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div>
            <h2 className="rise max-w-[16ch] font-display text-[clamp(1.9rem,4.2vw,3rem)] font-extrabold leading-[1.03] tracking-[-0.03em] text-balance">
              Vous ne verrez aucun nom de client sur ce site.
            </h2>
            <div className="rise mt-7 max-w-[40rem] text-lg leading-relaxed text-ink-soft">
              <p>
                C’est le principe, pas un manque. Les agences avec qui je travaille ont signé un
                accord de confidentialité, et la vôtre en signera un. Un prestataire qui étale ses
                références finira par étaler la vôtre.
              </p>
              <p className="mt-5">À la place, voilà ce qui tourne.</p>
            </div>

            <ul className="rise mt-10">
              {PROOF_LINKS.map((item) => (
                <li key={item.title} className="mt-6 first:mt-0">
                  <Link href={item.href} className="group block max-w-[34rem] rounded-[4px]">
                    <span className="link-underline font-display text-xl font-extrabold tracking-[-0.03em] group-hover:decoration-ink">
                      {item.title}
                    </span>
                    <span className="mt-2 block leading-relaxed text-ink-soft">
                      {item.body}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* La description reste basse, la preuve porte la graisse : c'est elle que le
              lecteur cherche, bien avant la pile technique. */}
          <div className="rise lg:pt-2">
            <h3 className="font-display text-xl font-extrabold leading-snug tracking-[-0.03em]">
              Le secteur et la technique, jamais le nom.
            </h3>
            <ol className="mt-8">
              {WORK.map((item, rank) => (
                <li
                  key={item.body}
                  className={rank > 0 ? 'mt-8 border-t border-ink/12 pt-8' : ''}
                >
                  <p className="max-w-[46ch] leading-relaxed text-ink-soft">{item.body}</p>
                  {item.proof ? (
                    <p className="mt-3 font-display text-[clamp(1.1rem,2.2vw,1.4rem)] font-extrabold leading-snug tracking-[-0.03em]">
                      {item.proof}
                    </p>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  )
}

// La rupture de rythme de la page : la seule surface pleine et pleine largeur, et le seul
// figure on the site. The number opens on scroll, once.
function Rate() {
  return (
    <section className="band py-24 sm:py-32">
      <Container>
        <h2 className="max-w-[16ch] font-display text-[clamp(1.9rem,4.2vw,3rem)] font-extrabold leading-[1.03] tracking-[-0.03em]">
          Un seul chiffre, et il ne bouge pas.
        </h2>

        <div className="mt-12 grid items-center gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
          <div>
            <p className="reveal flex flex-wrap items-baseline gap-x-5">
              <span className="figures font-display text-[clamp(3.5rem,11vw,6rem)] font-extrabold leading-[0.85] tracking-[-0.05em]">
                {DAY_RATE} €
              </span>
              <span className="font-display text-2xl font-bold tracking-[-0.02em] text-white-bright/65">
                la journée
              </span>
            </p>
            <p className="mt-10 max-w-[40rem] text-lg leading-relaxed text-white-bright/80">
              Renfort, projet complet, reprise et maintenance : c’est le même chiffre. Ce que vous
              achetez est un nombre de jours, écrit et validé avant de commencer.
            </p>
            <p className="mt-8 text-sm text-white-bright/50">{LEGAL.vatNotice}</p>
          </div>

          <Glass onInk className="px-7 py-7 text-white-bright">
            <p className="font-display text-lg font-bold leading-snug tracking-[-0.015em] sm:text-xl">
              Une journée en plus se valide par écrit avant d’être travaillée. Une journée en
              moins, vous ne la payez pas.
            </p>
          </Glass>
        </div>
      </Container>
    </section>
  )
}
