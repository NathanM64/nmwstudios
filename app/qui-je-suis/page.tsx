import type { Metadata } from 'next'
import Link from 'next/link'
import { Ecran } from '@/components/Ecran'

export const metadata: Metadata = {
  title: 'Qui je suis, NMW Studios',
  description:
    'Nathan Marimbordes, développeur web depuis six ans, à mon compte depuis un an à Bègles. Seul, et je le dis.',
}

const FAQ = [
  [
    'Vous êtes seul, que se passe-t-il si vous n’êtes plus disponible ?',
    'Le code est livré et documenté, le dépôt est à votre nom, l’hébergement est transférable. Un autre développeur peut reprendre le projet sans me demander quoi que ce soit.',
  ],
  [
    'Travaillez-vous en marque blanche pour des agences ?',
    'Oui. Une agence parisienne me confie aujourd’hui son parc applicatif et ses nouveaux projets. Vos maquettes, vos délais, votre nom devant votre client. Je ne contacte jamais votre client et je ne signe pas mon travail.',
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
    'Vous reprenez vraiment du code que vous n’avez pas écrit ?',
    'Oui, c’est une partie normale de mon métier. Envoyez-moi l’adresse et les accès, je vous écris ce qui tient et ce qui casse avant tout devis. Je ne reprends pas les sites sans code source, montés sur Wix, Squarespace ou un éditeur équivalent.',
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
          Depuis un an, une agence parisienne me confie son parc applicatif et ses nouveaux projets :
          des applications pour ses clients, souvent de grands groupes.
        </p>
        <p>
          C’est moi qui réponds, dans la journée. Si une fonctionnalité va coûter cher pour rien, je le
          dis avant de la chiffrer. Je préviens avant de dépasser, pas après.
        </p>
        <p className="faits">
          Bègles, près de Bordeaux. À distance pour toute la France. Entrepreneur individuel,{' '}
          <Link href="/mentions-legales">SIRET et mentions légales</Link>.
        </p>
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
