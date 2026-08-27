import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Section, Surtitre } from '@/components/ui/Section'
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
    >
      <div className="mt-14 grid gap-px bg-filet sm:grid-cols-2 lg:grid-cols-3">
        {OFFRES.map((offre) => (
          <article
            key={offre.id}
            className={
              offre.dominante
                ? 'flex flex-col bg-encre p-8 text-papier sm:col-span-2 lg:col-span-1 lg:row-span-1'
                : 'flex flex-col bg-papier p-8'
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
    <Section
      surtitre="Marque blanche"
      titre="Je ne suis jamais devant votre client."
      chapeau={
        <p>
          C’est la question que vous vous posez en premier, et vous avez raison de vous la poser.
          Voici ce que je fais, et en face, ce que je ne ferai pas.
        </p>
      }
    >
      <ul className="mt-14 space-y-10">
        {ENGAGEMENTS.map((engagement) => (
          <li key={engagement.fait} className="grid gap-x-10 gap-y-4 md:grid-cols-2">
            <p className="font-display text-xl font-semibold leading-snug tracking-[-0.015em]">
              {engagement.fait}
            </p>
            <p className="calque pl-5 text-lg leading-snug">{engagement.pasFait}</p>
          </li>
        ))}
      </ul>
      <p className="mt-14 max-w-2xl text-encre-sourde">
        Ces trois lignes sont reprises dans mes conditions de vente. Si votre agence a son propre
        accord de confidentialité, je signe le vôtre.
      </p>
    </Section>
  )
}

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
    >
      <div className="mt-14 grid gap-10 sm:grid-cols-3">
        <VerifiableItem
          titre="Ce que je reprends"
          corps="Trois conditions décident d’une reprise, et aucune ne porte sur le langage. Avec les cas les plus fréquents, et ce que je refuse."
          lien={{ href: '/reprise-et-maintenance/#technos', texte: 'Voir la liste' }}
        />
        <VerifiableItem
          titre="Les deux premières semaines"
          corps="Ce que je fais quand je prends la main sur un projet que je n’ai pas écrit, étape par étape."
          lien={{ href: '/reprise-et-maintenance/#semaines', texte: 'Voir le déroulé' }}
        />
        <VerifiableItem
          titre="Comment je rends la main"
          corps="Ce que vous récupérez le jour où vous arrêtez, et ce que je ne garde pas."
          lien={{ href: '/reprise-et-maintenance/#depart', texte: 'Voir la sortie' }}
        />
      </div>
    </Section>
  )
}

function VerifiableItem({
  titre,
  corps,
  lien,
}: {
  titre: string
  corps: string
  lien: { href: string; texte: string }
}) {
  return (
    <div className="border-t border-filet-fort pt-5">
      <h3 className="font-display text-lg font-bold tracking-[-0.015em]">{titre}</h3>
      <p className="mt-3 text-encre-sourde">{corps}</p>
      <Link
        href={lien.href}
        className="mt-5 inline-block font-mono text-xs uppercase tracking-[0.14em] text-carbone hover:underline"
      >
        {lien.texte}
      </Link>
    </div>
  )
}

function Tarif() {
  return (
    <section className="regle py-16 sm:py-24">
      <Container>
        <Surtitre>Tarif</Surtitre>
        <div className="mt-8 flex flex-wrap items-end gap-x-8 gap-y-4">
          <p className="font-display text-[clamp(3.5rem,12vw,8rem)] font-extrabold leading-[0.82] tracking-[-0.05em]">
            {TJM} €
          </p>
          <p className="font-display text-2xl font-bold tracking-[-0.02em] text-encre-sourde">
            la journée
          </p>
        </div>
        <div className="mt-10 grid gap-x-10 gap-y-6 md:grid-cols-2">
          <p className="text-lg text-encre-sourde">
            Renfort, projet complet, reprise et maintenance : c’est le même chiffre. Ce que vous
            achetez est un nombre de jours, écrit et validé avant de commencer.
          </p>
          <p className="calque pl-5 text-lg leading-snug">
            Pas de forfait opaque, pas de surprise en fin de mois, pas de facturation à
            l’estimation dépassée.
          </p>
        </div>
        <p className="mt-10 font-mono text-xs text-encre-sourde">{LEGAL.tva}</p>
      </Container>
    </section>
  )
}
