import type { Metadata } from 'next'
import { Ecran } from '@/components/Ecran'

export const metadata: Metadata = {
  title: 'Qui je suis, NMW Studios',
  description:
    'Nathan Marimbordes, développeur web depuis six ans, à mon compte depuis un an à Bègles. Seul, et je le dis.',
}

const FAQ = [
  [
    'Vous êtes seul, que se passe-t-il si vous n’êtes plus disponible ?',
    'Le code est livré et documenté, il est chez vous, à votre nom, et l’hébergement est transférable. Un autre développeur peut reprendre le projet sans avoir besoin de moi.',
  ],
  [
    'Vous pouvez reprendre un site fait par une autre agence ?',
    'Oui, c’est une partie normale de mon métier, même si l’agence n’existe plus. Envoyez-moi l’adresse, je vous écris ce qui tient et ce qui casse avant tout devis. Je ne reprends pas les sites sans code source, montés sur Wix, Squarespace ou un éditeur équivalent.',
  ],
  [
    'Travaillez-vous en marque blanche pour des agences ?',
    'Oui. Une agence parisienne me confie aujourd’hui ses applications et ses nouveaux projets. Vos maquettes, vos délais, votre nom devant votre client. Je ne contacte jamais votre client et je ne signe pas mon travail.',
  ],
  [
    'Combien coûte une reprise ?',
    'Au temps passé, au taux annoncé avant de commencer. L’adresse de votre site suffit pour que je vous écrive ce qui tient et ce qui casse ; le devis vient après.',
  ],
  [
    'Combien coûte un site ?',
    'Un site vitrine simple, jusqu’à trois pages, démarre à 1 500 €. Un site sur mesure avec une direction graphique et des animations propres se chiffre après cadrage. Les montants sont indicatifs et s’ajustent selon le périmètre et les contenus.',
  ],
  [
    'Combien de temps pour une première version ?',
    'La date se fixe au cadrage, à partir de ce que le projet doit faire et de ce que vous fournissez : textes, maquettes, accès. Vous voyez des versions avant cette date, et je préviens avant de dépasser, pas après.',
  ],
  [
    'Que se passe-t-il après la livraison ?',
    'Vous choisissez. Soit je continue à faire vivre le projet, soit vous repartez avec le code, la documentation et un hébergement transférable.',
  ],
  [
    'À distance ou sur place ?',
    'À distance, depuis Bègles près de Bordeaux, pour toute la France. On se parle en visio quand c’est utile.',
  ],
] as const

export default function Page() {
  return (
    <Ecran classe="qui">
      <div>
        <h2>Nathan Marimbordes.</h2>
        <p className="lead">
          Développeur web depuis six ans, d’abord en alternance puis en CDI, à mon compte depuis un an.
          Je travaille seul, et je le dis : si votre projet demande une équipe de cinq personnes, je
          vous le dirai et je vous orienterai.
        </p>
        <p>
          Depuis un an, je construis des applications pour les clients d’une agence, souvent de grands
          groupes, et je reprends ce que d’autres ont écrit. Mes chantiers durent et se relaient :
          pendant qu’un client relit, un autre avance. J’ai de la place, et je vous dis à partir de
          quand avant de m’engager.
        </p>
        <p>
          C’est moi qui réponds. Si une fonctionnalité va coûter cher pour rien, je le dis avant de la
          chiffrer. Je préviens avant de dépasser, en budget comme en date, pas après.
        </p>
        <p className="faits">Bègles, près de Bordeaux. À distance pour toute la France.</p>
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
