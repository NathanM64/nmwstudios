import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Entete } from '@/components/shell/Entete'
import { Pied } from '@/components/shell/Pied'
import { Contact } from '@/components/blocs/Contact'
import { OFFRES } from '@/content/offres'
import { ENGAGEMENTS } from '@/content/engagements'
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
        <Tarif />
        <Contact />
      </main>
      <Pied />
    </>
  )
}

function Hero() {
  return (
    <section className="regle py-20 sm:py-28">
      <Container>
        <p className="entre font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-carbone">
          Sous-traitance technique · Marque blanche · Bordeaux
        </p>
        <h1
          className="entre mt-8 max-w-[19ch] font-display text-[clamp(2.4rem,6.4vw,4.6rem)] font-extrabold leading-[0.98] tracking-[-0.035em]"
          style={{ '--rang': 1 } as React.CSSProperties}
        >
          Le développeur des agences qui n’ont pas d’équipe technique.
        </h1>
        <p
          className="entre mt-8 max-w-2xl text-xl leading-relaxed text-encre-sourde"
          style={{ '--rang': 2 } as React.CSSProperties}
        >
          Je prends en charge vos projets web en marque blanche, de la reprise d’un existant à
          la mise en production. Bordeaux, à distance partout en France.
        </p>

        <div
          className="entre mt-14 flex flex-wrap items-end justify-between gap-x-10 gap-y-10"
          style={{ '--rang': 3 } as React.CSSProperties}
        >
          <div className="flex flex-wrap items-baseline gap-x-8 gap-y-3">
            <a
              href={`mailto:${LEGAL.email}`}
              className="font-display text-lg font-bold tracking-[-0.01em] text-carbone underline decoration-2 underline-offset-[6px] hover:decoration-encre"
            >
              Parler d’un projet
            </a>
            <Link
              href="/reprise-et-maintenance/"
              className="font-mono text-xs uppercase tracking-[0.14em] text-encre-sourde hover:text-carbone"
            >
              Reprendre un site existant
            </Link>
          </div>

          {/* La signature d'un contrat, laissée au nom de l'agence : ce site ne met pas mon
              nom au centre, il met le leur. */}
          <div className="cartouche px-6 py-4">
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.2em] opacity-70">
              Le travail est livré sous le nom de
            </p>
            <p className="mt-2 font-display text-2xl font-bold tracking-[-0.02em]">votre agence</p>
          </div>
        </div>
      </Container>
    </section>
  )
}

function Modes() {
  return (
    <Section
      surtitre="Trois manières de travailler ensemble"
      titre="Vous choisissez le niveau d’engagement, pas le tarif."
      chapeau={
        <p>
          Le tarif est le même dans les trois cas. Ce qui change, c’est ce que vous signez et
          pour combien de temps.
        </p>
      }
      largeur="pleine"
    >
      {/* Bord à bord : la grille traverse la page comme un tableau, au lieu d'être une carte
          posée dedans. */}
      <div className="mx-auto mt-14 grid max-w-[110rem] gap-px border-y border-filet bg-filet sm:grid-cols-2 lg:grid-cols-3">
        {OFFRES.map((offre) => (
          <article
            key={offre.id}
            className={
              offre.dominante
                ? 'flex flex-col bg-encre p-6 text-papier sm:col-span-2 sm:p-10 lg:col-span-1'
                : 'flex flex-col bg-papier p-6 sm:p-10'
            }
          >
            <p
              className={`font-mono text-[0.6875rem] uppercase tracking-[0.18em] ${
                offre.dominante ? 'text-papier/70' : 'text-carbone'
              }`}
            >
              {offre.titre}
            </p>
            <h3
              className={`mt-5 font-display text-2xl font-bold leading-[1.12] tracking-[-0.02em] ${
                offre.dominante ? 'text-papier' : ''
              }`}
            >
              {offre.declencheur}
            </h3>
            <p
              className={`mt-4 flex-1 ${offre.dominante ? 'text-papier/80' : 'text-encre-sourde'}`}
            >
              {offre.corps}
            </p>
            <p
              className={`mt-8 font-mono text-xs ${
                offre.dominante ? 'text-papier' : 'text-encre'
              }`}
            >
              {offre.engagement}
            </p>
            {offre.lien ? (
              <Link
                href={offre.lien.href}
                className="mt-3 font-mono text-xs uppercase tracking-[0.14em] text-papier underline decoration-1 underline-offset-4 hover:decoration-2"
              >
                {offre.lien.texte}
              </Link>
            ) : null}
          </article>
        ))}
      </div>
    </Section>
  )
}

function MarqueBlanche() {
  return (
    <Section surtitre="Marque blanche" titre="Je ne suis jamais devant votre client." fond="creux">
      {/* Des articles numérotés, parce que c'est de cela qu'il s'agit : les trois lignes sont
          dans les conditions de vente. */}
      <ol className="mt-12 border-b border-filet-fort">
        {ENGAGEMENTS.map((engagement, index) => (
          <li
            key={engagement.fait}
            className="grid gap-x-10 gap-y-4 border-t border-filet-fort py-8 md:grid-cols-[5rem_1fr_1fr]"
          >
            <span
              className="font-mono text-xs uppercase tracking-[0.16em] text-carbone md:pt-1.5"
              aria-hidden="true"
            >
              Art. {index + 1}
            </span>
            <p className="font-display text-xl font-semibold leading-snug tracking-[-0.015em]">
              {engagement.fait}
            </p>
            <p className="calque pl-5 text-lg leading-snug">{engagement.pasFait}</p>
          </li>
        ))}
      </ol>
      <p className="mt-10 max-w-2xl text-encre-sourde">
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
    lien: 'Voir la liste',
  },
  {
    titre: 'Les deux premières semaines',
    corps:
      'Ce que je fais quand je prends la main sur un projet que je n’ai pas écrit, étape par étape.',
    href: '/reprise-et-maintenance/#semaines',
    lien: 'Voir le déroulé',
  },
  {
    titre: 'Comment je rends la main',
    corps: 'Ce que vous récupérez le jour où vous arrêtez, et ce que je ne garde pas.',
    href: '/reprise-et-maintenance/#depart',
    lien: 'Voir la sortie',
  },
]

function AucunNom() {
  return (
    <Section
      surtitre="Références"
      titre="Vous ne verrez aucun nom de client sur ce site."
      chapeau={
        <>
          <p>
            C’est le principe, pas un manque. Les agences avec qui je travaille ont signé un
            accord de confidentialité, et la vôtre en signera un. Un prestataire qui étale ses
            références finira par étaler la vôtre.
          </p>
          <p className="mt-5">
            À la place, voici ce que vous pouvez vérifier avant de me confier quoi que ce soit.
          </p>
        </>
      }
      largeur="serree"
      densite="basse"
    >
      <ul className="mt-10 border-b border-filet-fort">
        {VERIFIABLES.map((item) => (
          <li key={item.titre} className="border-t border-filet-fort">
            <Link
              href={item.href}
              className="group grid gap-x-6 gap-y-2 py-5 sm:grid-cols-[1fr_auto] sm:items-baseline"
            >
              <span>
                <span className="font-display text-lg font-bold tracking-[-0.015em] group-hover:text-carbone">
                  {item.titre}
                </span>
                <span className="mt-1 block text-encre-sourde">{item.corps}</span>
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-carbone group-hover:underline">
                {item.lien}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  )
}

// Le point d'orgue de la page : le seul chiffre du site prend toute la largeur et passe au
// verso, là où le carbone a fini par imprimer.
function Tarif() {
  return (
    <section className="bg-encre py-20 text-papier sm:py-28">
      <Container>
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-papier/60">
          Tarif
        </p>
        <div className="mt-8 flex flex-wrap items-end gap-x-8 gap-y-4">
          <p className="font-display text-[clamp(4rem,15vw,11rem)] font-extrabold leading-[0.78] tracking-[-0.05em]">
            {TJM} €
          </p>
          <p className="font-display text-2xl font-bold tracking-[-0.02em] text-papier/70">
            la journée
          </p>
        </div>
        <div className="mt-14 grid gap-x-10 gap-y-6 md:grid-cols-2">
          <p className="text-lg text-papier/80">
            Renfort, projet complet, reprise et maintenance : c’est le même chiffre. Ce que vous
            achetez est un nombre de jours, écrit et validé avant de commencer.
          </p>
          <p className="calque sur-encre pl-5 text-lg leading-snug">
            Pas de forfait opaque, pas de surprise en fin de mois, pas de facturation à
            l’estimation dépassée.
          </p>
        </div>
        <p className="mt-12 font-mono text-xs text-papier/50">{LEGAL.tva}</p>
      </Container>
    </section>
  )
}
