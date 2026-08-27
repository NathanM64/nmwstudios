import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Verre } from '@/components/ui/Verre'
import { Logo } from '@/components/ui/Logo'
import { Entete } from '@/components/shell/Entete'
import { Pied } from '@/components/shell/Pied'
import { Contact } from '@/components/blocs/Contact'
import { Releve } from '@/components/blocs/Releve'
import { OFFRES } from '@/content/offres'
import { ENGAGEMENTS } from '@/content/engagements'
import { TRAVAUX } from '@/content/travaux'
import { LEGAL, TJM } from '@/lib/legal'

export default function Page() {
  return (
    <>
      <Entete />
      <main>
        <Hero />
        <Modes />
        <MarqueBlanche />
        <AucunNom />
        <Verifiable />
        <Tarif />
        <Contact />
      </main>
      <Pied />
    </>
  )
}

function Hero() {
  return (
    <section className="pb-14 pt-14 sm:pb-20 sm:pt-20">
      <Container>
        <div className="grid items-center gap-x-16 gap-y-14 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div>
            <h1 className="entre max-w-[16ch] font-display text-[clamp(2rem,4.6vw,3.4rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-balance">
              Le développeur des agences qui n’ont pas d’équipe technique.
            </h1>
            <p
              className="entre mt-8 max-w-[40rem] text-lg leading-relaxed text-encre-douce sm:text-xl"
              style={{ '--rang': 1 } as React.CSSProperties}
            >
              Je prends en charge vos projets web en marque blanche, de la reprise d’un existant
              à la mise en production.
            </p>
            <a
              href={`mailto:${LEGAL.email}`}
              className="lien-souligne entre mt-10 inline-block font-display text-xl font-bold tracking-[-0.02em]"
              style={{ '--rang': 2 } as React.CSSProperties}
            >
              Écrire un message
            </a>
          </div>

          <Cartouche />
        </div>
      </Container>
    </section>
  )
}

// La signature d'un contrat, laissée au nom de l'agence. Ce site ne met pas mon nom au
// centre : il le pose en filigrane, sous la dalle qui porte celui de l'agence.
function Cartouche() {
  return (
    <div
      className="entre relative mx-auto aspect-[6/5] w-full max-w-[21rem] lg:mx-0"
      style={{ '--rang': 1 } as React.CSSProperties}
    >
      {/* Le seul endroit du site où ma marque est grande, et elle est sous la dalle qui porte
          le nom de l'agence. C'est aussi ce que la tranche du verre a à plier. */}
      <span aria-hidden="true">
        <Logo className="absolute left-1/2 top-1/2 h-[122%] w-auto -translate-x-1/2 -translate-y-1/2 text-encre opacity-[0.09] blur-[1.5px] [mask-image:radial-gradient(closest-side,black_48%,transparent_96%)]" />
      </span>
      <div data-verre className="verre absolute bottom-0 left-10 right-0 top-14" />
      <Verre
        epais
        reflet
        className="absolute bottom-14 left-0 right-10 top-0 flex flex-col justify-between px-6 py-6"
      >
        <p className="max-w-[15ch] text-sm leading-snug text-encre-douce">
          Le travail est livré sous le nom de
        </p>
        <p className="font-display text-[clamp(1.6rem,4.4vw,2.1rem)] font-extrabold leading-[0.95] tracking-[-0.04em]">
          votre
          <br />
          agence
        </p>
      </Verre>
    </div>
  )
}

function Modes() {
  const petites = OFFRES.filter((offre) => !offre.dominante)
  const dominante = OFFRES.find((offre) => offre.dominante)

  return (
    <Section
      titre="Vous choisissez le niveau d’engagement, pas le tarif."
      chapeau={
        <p>
          Le tarif est le même dans les trois cas. Ce qui change, c’est ce que vous signez et
          pour combien de temps.
        </p>
      }
    >
      {/* Deux dalles côte à côte, puis une troisième qui traverse : la reprise prend la
          largeur entière parce que c'est elle qui dure. */}
      <div className="mt-14 grid gap-5 sm:grid-cols-2">
        {petites.map((offre) => (
          <Verre key={offre.id} as="article" className="monte flex flex-col px-7 py-8 sm:px-9">
            <h3 className="font-display text-2xl font-extrabold leading-[1.1] tracking-[-0.03em]">
              {offre.titre}
            </h3>
            <p className="mt-4 font-display text-lg font-bold leading-snug tracking-[-0.02em]">
              {offre.declencheur}
            </p>
            <p className="mt-4 leading-relaxed text-encre-douce">{offre.corps}</p>
            <p className="mt-auto pt-8 text-sm text-encre-douce">
              <span className="block border-t border-encre/10 pt-5">{offre.engagement}</span>
            </p>
          </Verre>
        ))}
      </div>

      {dominante ? (
        <Verre
          as="article"
          epais
          reflet
          className="monte mt-5 grid gap-x-14 gap-y-8 px-7 py-10 sm:px-11 sm:py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end"
        >
          <div>
            <h3 className="font-display text-[clamp(1.9rem,4vw,2.8rem)] font-extrabold leading-[1] tracking-[-0.04em]">
              {dominante.titre}
            </h3>
            <p className="mt-5 max-w-[20ch] font-display text-xl font-bold leading-snug tracking-[-0.025em] sm:text-2xl">
              {dominante.declencheur}
            </p>
          </div>
          <div>
            <p className="max-w-[38rem] text-lg leading-relaxed text-encre-douce">
              {dominante.corps}
            </p>
            <p className="mt-7 border-t border-encre/10 pt-5 text-sm text-encre-douce">
              {dominante.engagement}
            </p>
            {dominante.lien ? (
              <Link
                href={dominante.lien.href}
                className="lien-souligne mt-4 inline-block font-display font-bold tracking-[-0.01em]"
              >
                {dominante.lien.texte}
              </Link>
            ) : null}
          </div>
        </Verre>
      ) : null}
    </Section>
  )
}

// La contrepartie passe devant : ce qu'un prestataire ne fera pas est l'information que le
// lecteur cherche en premier, donc c'est elle qui porte la graisse.
function MarqueBlanche() {
  return (
    <Section titre="Je ne suis jamais devant votre client.">
      <ol className="mt-14">
        {ENGAGEMENTS.map((engagement, rang) => (
          <li
            key={engagement.fait}
            className="monte grid gap-x-14 gap-y-4 border-t border-encre/12 py-9 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:py-11"
          >
            <p className="font-display text-[clamp(1.25rem,2.6vw,1.7rem)] font-extrabold leading-[1.15] tracking-[-0.025em] text-balance">
              {engagement.pasFait}
            </p>
            <p
              className="decale self-start leading-relaxed text-encre-douce"
              style={{ '--rang': rang } as React.CSSProperties}
            >
              {engagement.fait}
            </p>
          </li>
        ))}
      </ol>
      <p className="mt-12 max-w-[40rem] leading-relaxed text-encre-douce">
        Ces trois lignes sont reprises dans mes conditions de vente. Si votre agence a son propre
        accord de confidentialité, je signe le vôtre.
      </p>
    </Section>
  )
}

const VERIFIABLES = [
  {
    titre: 'Ce que je reprends',
    corps:
      'Trois conditions décident d’une reprise, et aucune ne porte sur le langage. Avec les cas les plus fréquents, et ce que je refuse.',
    href: '/reprise-et-maintenance/#technos',
  },
  {
    titre: 'Les deux premières semaines',
    corps:
      'Ce que je fais quand je prends la main sur un projet que je n’ai pas écrit, étape par étape.',
    href: '/reprise-et-maintenance/#semaines',
  },
  {
    titre: 'Comment je rends la main',
    corps: 'Ce que vous récupérez le jour où vous arrêtez, et ce que je ne garde pas.',
    href: '/reprise-et-maintenance/#depart',
  },
]

function AucunNom() {
  return (
    <section className="bg-papier-creux/70 py-24 sm:py-32">
      <Container>
        {/* Le titre tient une colonne, la matière tient l'autre : la page dit « aucun nom »
            et montre ce qu'il y a derrière dans le même écran, pas trois sections plus bas. */}
        <div className="grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div>
            <h2 className="monte max-w-[16ch] font-display text-[clamp(1.9rem,4.2vw,3rem)] font-extrabold leading-[1.03] tracking-[-0.03em] text-balance">
              Vous ne verrez aucun nom de client sur ce site.
            </h2>
            <div className="monte mt-7 max-w-[40rem] text-lg leading-relaxed text-encre-douce">
              <p>
                C’est le principe, pas un manque. Les agences avec qui je travaille ont signé un
                accord de confidentialité, et la vôtre en signera un. Un prestataire qui étale ses
                références finira par étaler la vôtre.
              </p>
              <p className="mt-5">
                À la place, voilà ce qui tourne. Le secteur et la technique, jamais le nom.
              </p>
            </div>
          </div>

          {/* La description reste basse, la preuve porte la graisse : c'est elle que le
              lecteur cherche, bien avant la pile technique. */}
          <ol className="monte lg:pt-2">
            {TRAVAUX.map((travail, rang) => (
              <li
                key={travail.corps}
                className={rang > 0 ? 'mt-8 border-t border-encre/12 pt-8' : ''}
              >
                <p className="max-w-[46ch] leading-relaxed text-encre-douce">{travail.corps}</p>
                {travail.preuve ? (
                  <p className="mt-3 font-display text-[clamp(1.1rem,2.2vw,1.4rem)] font-extrabold leading-snug tracking-[-0.03em]">
                    {travail.preuve}
                  </p>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  )
}

function Verifiable() {
  return (
    <Section
      titre="Ce que vous pouvez vérifier vous-même."
      chapeau={
        <p>
          Trois pages qui détaillent la méthode, et une mesure prise à l’instant dans votre
          navigateur.
        </p>
      }
    >
      <div className="mt-14 grid gap-x-16 gap-y-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,23rem)] lg:items-start">
        <ul className="monte">
          {VERIFIABLES.map((item, rang) => (
            <li
              key={item.titre}
              className="decale py-5 first:pt-0"
              style={{ '--rang': rang } as React.CSSProperties}
            >
              <Link href={item.href} className="group block max-w-[34rem] rounded-[4px]">
                <span className="lien-souligne font-display text-[clamp(1.25rem,2.4vw,1.6rem)] font-extrabold tracking-[-0.03em] group-hover:decoration-encre">
                  {item.titre}
                </span>
                <span className="mt-2.5 block leading-relaxed text-encre-douce">{item.corps}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="monte">
          <Releve />
        </div>
      </div>
    </Section>
  )
}

// La rupture de rythme de la page : la seule surface pleine et pleine largeur, et le seul
// chiffre du site. Le nombre s'ouvre au défilement, une fois.
function Tarif() {
  return (
    <section className="bande py-24 sm:py-32">
      <Container>
        <h2 className="max-w-[16ch] font-display text-[clamp(1.9rem,4.2vw,3rem)] font-extrabold leading-[1.03] tracking-[-0.03em]">
          Un seul chiffre, et il ne bouge pas.
        </h2>

        <div className="mt-12 grid items-center gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
          <div>
            <p className="devoile flex flex-wrap items-baseline gap-x-5">
              <span className="chiffres font-display text-[clamp(3.5rem,11vw,6rem)] font-extrabold leading-[0.85] tracking-[-0.05em]">
                {TJM} €
              </span>
              <span className="font-display text-2xl font-bold tracking-[-0.02em] text-blanc-vif/65">
                la journée
              </span>
            </p>
            <p className="mt-10 max-w-[40rem] text-lg leading-relaxed text-blanc-vif/80">
              Renfort, projet complet, reprise et maintenance : c’est le même chiffre. Ce que vous
              achetez est un nombre de jours, écrit et validé avant de commencer.
            </p>
            <p className="mt-8 text-sm text-blanc-vif/50">{LEGAL.tva}</p>
          </div>

          <Verre surEncre className="px-7 py-7 text-blanc-vif">
            <p className="font-display text-lg font-bold leading-snug tracking-[-0.015em] sm:text-xl">
              Pas de forfait opaque, pas de surprise en fin de mois, pas de facturation à
              l’estimation dépassée.
            </p>
          </Verre>
        </div>
      </Container>
    </section>
  )
}
