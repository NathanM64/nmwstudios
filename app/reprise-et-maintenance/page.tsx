import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Entete } from '@/components/shell/Entete'
import { Pied } from '@/components/shell/Pied'
import { Contact } from '@/components/blocs/Contact'
import { CRITERES, TECHNOS } from '@/content/technos'
import { PREMIERES_SEMAINES } from '@/content/semaines'

export const metadata: Metadata = {
  title: 'Reprise et maintenance de site existant',
  description:
    "Reprise d'un site développé par un autre prestataire : Symfony, PHP sans framework, React ancien, WordPress sur mesure. Maintenance au mois pour les agences, en marque blanche.",
}

export default function Page() {
  return (
    <>
      <Entete />
      <main>
        <Hero />
        <Semaines />
        <Technos />
        <Depart />
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
          Reprise et maintenance
        </p>
        <h1
          className="entre mt-8 max-w-[17ch] font-display text-[clamp(2.2rem,5.8vw,4.2rem)] font-extrabold leading-[1] tracking-[-0.035em]"
          style={{ '--rang': 1 } as React.CSSProperties}
        >
          Non, je ne vais pas vous dire que tout est à refaire.
        </h1>
        <div
          className="entre mt-10 max-w-2xl space-y-5 text-lg leading-relaxed text-encre-sourde"
          style={{ '--rang': 2 } as React.CSSProperties}
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

function Semaines() {
  return (
    <Section
      id="semaines"
      surtitre="Les deux premières semaines"
      titre="Ce que je fais avant d’écrire la moindre ligne."
      chapeau={
        <p>
          Quatre étapes, dans cet ordre, parce que chacune a besoin de la précédente. Vous savez
          où j’en suis à tout moment.
        </p>
      }
    >
      <ol className="mt-14 space-y-12">
        {PREMIERES_SEMAINES.map((etape, index) => (
          <li key={etape.titre} className="grid gap-x-8 gap-y-3 sm:grid-cols-[3rem_1fr]">
            <span className="font-mono text-sm text-carbone" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div>
              <h3 className="font-display text-xl font-bold leading-snug tracking-[-0.015em]">
                {etape.titre}
              </h3>
              <p className="mt-3 max-w-2xl text-encre-sourde">{etape.corps}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  )
}

function Technos() {
  return (
    <Section
      id="technos"
      surtitre="Ce que je reprends"
      titre="Ce n’est pas la technologie qui décide."
      chapeau={
        <p>
          Une reprise se décide sur l’état du projet, pas sur le langage dans lequel il est
          écrit. Trois conditions, et elles sont les mêmes partout.
        </p>
      }
    >
      <ul className="mt-12 max-w-3xl border-b border-filet-fort">
        {CRITERES.map((critere) => (
          <li key={critere} className="border-t border-filet-fort py-4 text-lg">
            {critere}
          </li>
        ))}
      </ul>

      <p className="mt-16 max-w-2xl text-encre-sourde">
        Le reste est une question de temps, et le temps se chiffre. Voici ce qui passe entre mes
        mains le plus souvent, et que vous cherchez peut-être en ce moment.
      </p>

      <dl className="mt-10 space-y-10">
        {TECHNOS.map((techno) => (
          <div key={techno.nom} className="grid gap-x-10 gap-y-3 md:grid-cols-[14rem_1fr]">
            <dt className="font-display text-xl font-bold tracking-[-0.015em]">{techno.nom}</dt>
            <dd className="max-w-2xl text-encre-sourde">{techno.corps}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-16 grid gap-x-10 gap-y-4 md:grid-cols-2">
        <p className="font-display text-xl font-semibold leading-snug tracking-[-0.015em]">
          Si votre projet n’est pas dans cette liste, demandez quand même : les trois conditions
          du haut comptent plus que le nom du framework.
        </p>
        <p className="calque pl-5 text-lg leading-snug">
          Je ne reprends pas les sites montés sur un constructeur de pages : votre intégrateur
          ira plus vite que moi, et il vous coûtera moins cher.
        </p>
      </div>
    </Section>
  )
}

function Depart() {
  return (
    <Section
      id="depart"
      surtitre="Réversibilité"
      titre="Ce qui se passe le jour où vous arrêtez."
      chapeau={
        <p>
          L’autre peur, celle dont on parle moins : se retrouver dépendant du prestataire qui a
          repris le projet. Voilà à quoi ressemble une sortie propre.
        </p>
      }
    >
      <div className="mt-14 grid gap-x-10 gap-y-6 md:grid-cols-2">
        <ul className="border-b border-filet-fort">
          {[
            'Le dépôt Git, avec tout l’historique des changements.',
            'Les accès à l’hébergement et au nom de domaine, à votre nom.',
            'Un document qui explique comment le projet se déploie, en une page.',
          ].map((ligne) => (
            <li key={ligne} className="border-t border-filet-fort py-4 text-lg">
              {ligne}
            </li>
          ))}
        </ul>
        <p className="calque pl-5 text-lg leading-snug">
          Je ne garde ni accès, ni sauvegarde, ni compte de service. Un autre développeur peut
          reprendre sans avoir à me parler.
        </p>
      </div>
    </Section>
  )
}
