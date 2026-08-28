import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Verre } from '@/components/ui/Verre'
import { Entete } from '@/components/shell/Entete'
import { Pied } from '@/components/shell/Pied'
import { Contact } from '@/components/blocs/Contact'
import { CRITERES, TECHNOS } from '@/content/technos'
import { ETAT_DES_LIEUX } from '@/content/etat-des-lieux'

export const metadata: Metadata = {
  title: 'Reprise et maintenance de site existant',
  description:
    "Reprise d'un site développé par un autre : Symfony, PHP, React ancien, WordPress. Maintenance au mois pour les agences, en marque blanche.",
  alternates: { canonical: '/reprise-et-maintenance/' },
}

// Les quatre plaques ne font pas la même largeur : la grille alterne large et étroit plutôt
// que d'aligner quatre cartes identiques.
const LARGEURS = ['lg:col-span-3', 'lg:col-span-3', 'lg:col-span-4', 'lg:col-span-2']

export default function Page() {
  return (
    <>
      <Entete />
      <main>
        <Hero />
        <EtatDesLieux />
        <Technos />
        <Depart />
        <Contact />
      </main>
      <Pied />
    </>
  )
}

// Pas de dalle ici : la page s'ouvre sur une phrase, et la phrase est le sujet.
function Hero() {
  return (
    <section className="pb-14 pt-14 sm:pb-20 sm:pt-24">
      <Container>
        <h1 className="entre max-w-[15ch] font-display text-[clamp(2.2rem,5.4vw,4rem)] font-extrabold leading-[0.98] tracking-[-0.04em] text-balance">
          Non, je ne vais pas vous dire que tout est à refaire.
        </h1>
        <div
          className="entre mt-10 max-w-[40rem] space-y-5 text-lg leading-relaxed text-encre-douce"
          style={{ '--rang': 1 } as React.CSSProperties}
        >
          <p>
            C’est la phrase que vous attendez, parce que vous l’avez déjà entendue. Un site qui
            tourne depuis six ans avec du code que personne n’aime reste un site qui tourne depuis
            six ans.
          </p>
          <p>
            Mon travail est de le garder en vie et de le faire avancer. Quand une refonte est
            vraiment la bonne réponse, je vous le dis avec les chiffres qui le montrent, et c’est
            vous qui décidez.
          </p>
        </div>
      </Container>
    </section>
  )
}

function EtatDesLieux() {
  return (
    <Section
      id="etat-des-lieux"
      titre="Ce que je fais avant d’écrire la moindre ligne."
      chapeau={
        <p>
          Quatre étapes, dans cet ordre, parce que chacune a besoin de la précédente. Vous savez
          où j’en suis à tout moment.
        </p>
      }
    >
      {/* Le rail porte la séquence et se remplit au défilement : sans lui, quatre paragraphes
          numérotés se lisent comme quatre paragraphes. */}
      <ol className="relative mt-16 pl-14 sm:pl-24">
        <span
          aria-hidden="true"
          className="absolute bottom-8 left-0 top-3 w-px overflow-hidden bg-encre/12"
        >
          <span className="remplit block h-full w-px bg-encre/70" />
        </span>

        {ETAT_DES_LIEUX.map((etape, rang) => (
          <li key={etape.titre} className="monte relative pb-14 last:pb-0">
            <span
              aria-hidden="true"
              className="chiffres absolute -left-11 top-0 font-display text-[1.5rem] font-extrabold leading-none tracking-[-0.04em] text-encre-douce/55 sm:-left-[4.5rem] sm:text-[2.6rem]"
            >
              {String(rang + 1).padStart(2, '0')}
            </span>
            <h3 className="font-display text-[clamp(1.2rem,2.4vw,1.6rem)] font-extrabold leading-[1.15] tracking-[-0.025em]">
              {etape.titre}
            </h3>
            <p className="mt-3.5 max-w-[40rem] leading-relaxed text-encre-douce">{etape.corps}</p>
          </li>
        ))}
      </ol>
    </Section>
  )
}

function Technos() {
  return (
    <section id="technos" className="py-24 sm:py-32">
      {/* La rupture de rythme de cette page : les trois conditions décident de tout, elles
          passent donc sur la seule surface pleine. */}
      <div className="bande py-20 sm:py-24">
        <Container>
          <div className="grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <div>
              <h2 className="max-w-[14ch] font-display text-[clamp(1.9rem,4.2vw,3rem)] font-extrabold leading-[1.03] tracking-[-0.03em] text-balance">
                Ce n’est pas la technologie qui décide.
              </h2>
              <p className="mt-7 max-w-[38rem] text-lg leading-relaxed text-blanc-vif/75">
                Une reprise se décide sur l’état du projet, pas sur le langage dans lequel il est
                écrit. Trois conditions, et elles sont les mêmes partout.
              </p>
            </div>

            <div className="lg:pt-2">
              <ul>
                {CRITERES.map((critere, rang) => (
                  <li
                    key={critere}
                    className={`font-display text-[clamp(1.15rem,2.2vw,1.45rem)] font-bold leading-snug tracking-[-0.02em] ${
                      rang > 0 ? 'mt-7 border-t border-blanc-vif/15 pt-7' : ''
                    }`}
                  >
                    {critere}
                  </li>
                ))}
              </ul>
              {/* Une exclusion n'est pas une quatrième condition : elle se lit plus bas et
                  plus doucement, mais au moment où le lecteur cherche si son cas passe. */}
              <p className="mt-9 border-t border-blanc-vif/25 pt-7 leading-relaxed text-blanc-vif/70">
                Je ne reprends pas les sites montés sur un constructeur de pages. Votre
                intégrateur ira plus vite que moi et vous coûtera moins cher.
              </p>
            </div>
          </div>
        </Container>
      </div>

      <Container>
        <p className="monte mt-20 max-w-[40rem] text-lg leading-relaxed text-encre-douce">
          Le reste est une question de temps, et le temps se chiffre. Voici ce qui passe entre mes
          mains le plus souvent, et que vous cherchez peut-être en ce moment.
        </p>

        <div className="mt-10 grid gap-5 lg:grid-cols-6">
          {TECHNOS.map((techno, rang) => (
            <Verre
              key={techno.nom}
              as="article"
              className={`monte px-7 py-8 sm:px-9 ${LARGEURS[rang]}`}
            >
              <h3 className="font-display text-2xl font-extrabold tracking-[-0.03em]">
                {techno.nom}
              </h3>
              <p className="mt-4 max-w-[40rem] leading-relaxed text-encre-douce">{techno.corps}</p>
            </Verre>
          ))}
        </div>

        <p className="monte mt-16 max-w-[26ch] font-display text-[clamp(1.2rem,2.4vw,1.6rem)] font-extrabold leading-[1.15] tracking-[-0.025em] text-balance">
          Si votre projet n’est pas dans cette liste, demandez quand même. Les trois conditions
          comptent plus que le nom du framework.
        </p>
      </Container>
    </section>
  )
}

const SORTIE = [
  'Le dépôt Git, avec tout l’historique des changements.',
  'Les accès à l’hébergement et au nom de domaine, à votre nom.',
  'Un document qui explique comment le projet se déploie, en une page.',
]

function Depart() {
  return (
    <Section
      id="depart"
      titre="Ce qui se passe le jour où vous arrêtez."
      chapeau={
        <p>
          L’autre peur, celle dont on parle moins : se retrouver dépendant du prestataire qui a
          repris le projet. Voilà à quoi ressemble une sortie propre.
        </p>
      }
      fond="creux"
    >
      <div className="mt-14 grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center">
        <p className="monte max-w-[18ch] font-display text-[clamp(1.5rem,3.4vw,2.2rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-balance">
          Je ne garde ni accès, ni sauvegarde, ni compte de service.
        </p>

        <Verre epais className="monte px-7 py-8 sm:px-10 sm:py-10">
          <ul>
            {SORTIE.map((ligne, rang) => (
              <li
                key={ligne}
                className={`text-lg leading-snug ${
                  rang > 0 ? 'mt-5 border-t border-encre/10 pt-5' : ''
                }`}
              >
                {ligne}
              </li>
            ))}
          </ul>
          <p className="mt-7 border-t border-encre/10 pt-5 text-sm leading-relaxed text-encre-douce">
            Un autre développeur peut reprendre le projet sans avoir à me parler.
          </p>
        </Verre>
      </div>
    </Section>
  )
}
