import type { Metadata } from 'next'
import { Ecran } from '@/components/Ecran'

export const metadata: Metadata = {
  alternates: { canonical: '/qui-je-suis/' },
  openGraph: { url: '/qui-je-suis/' },
  title: 'Nathan Marimbordes, développeur web indépendant à Bordeaux',
  description:
    'Nathan Marimbordes, développeur web depuis 2020, à mon compte depuis 2025, à Bordeaux. Je travaille seul, et je le dis, et je vous oriente si votre projet demande une équipe.',
}

const FAQ = [
  [
    'Vous êtes seul, que se passe-t-il si vous n’êtes plus disponible ?',
    'Le code est livré et documenté, il est chez vous, à votre nom, et l’hébergement est transférable. Un autre développeur peut reprendre sans avoir besoin de moi.',
  ],
  [
    'Vous pouvez reprendre un site fait par une autre agence ?',
    'Oui, même si l’agence n’existe plus. Envoyez-moi l’adresse, je vous écris ce qui tient et ce qui casse avant tout devis, et je vous dis si une refonte vaut mieux qu’une reprise.',
  ],
  [
    'Travaillez-vous en marque blanche pour des agences ?',
    'Oui, en freelance. Vos maquettes, vos délais, votre nom devant votre client. Je ne contacte jamais votre client et je ne signe pas mon travail.',
  ],
  [
    'Combien coûte une reprise ?',
    'Au temps passé, au taux annoncé avant de commencer. Le devis vient après l’état des lieux.',
  ],
  [
    'Combien coûte un site ?',
    'Un site vitrine simple, jusqu’à trois pages, démarre à 1 500 €. Un site sur mesure se chiffre après cadrage, selon le périmètre et les contenus.',
  ],
  [
    'Combien de temps pour une première version ?',
    'La date se fixe au cadrage, à partir de ce que le projet doit faire et de ce que vous fournissez. Vous voyez des versions avant cette date.',
  ],
  [
    'Que se passe-t-il après la livraison ?',
    'Vous choisissez : je continue à faire vivre le projet, ou vous repartez avec le code, la documentation et un hébergement transférable.',
  ],
] as const

export default function Page() {
  return (
    <Ecran classe="qui">
      <div>
        <h1>Nathan Marimbordes.</h1>
        <p className="lead">
          Développeur web depuis 2020, à mon compte depuis 2025.{' '}
          <span className="client">Je travaille seul, et je le dis :</span> si votre projet demande une
          équipe, je vous le dirai et je vous orienterai.
        </p>
        <p>
          Mes chantiers durent et se relaient : pendant qu’un client relit, un autre avance. J’ai de la
          place, et je vous dis à partir de quand avant de m’engager. Si une fonctionnalité va coûter
          cher pour rien, je le dis avant de la chiffrer. Je préviens avant de dépasser, pas après.
        </p>
        <p className="faits">Bordeaux. À distance pour toute la France.</p>
      </div>
      {/* name="faq" : le navigateur n'en garde qu'une ouverte, sans JavaScript. */}
      <div className="faq panel">
        {FAQ.map(([question, reponse], i) => (
          <details key={question} className="qa" name="faq" open={i === 0}>
            <summary>{question}</summary>
            <p>{reponse}</p>
          </details>
        ))}
      </div>
    </Ecran>
  )
}
