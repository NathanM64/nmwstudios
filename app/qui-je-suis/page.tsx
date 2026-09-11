import type { Metadata } from 'next'
import { Ecran } from '@/components/Ecran'

export const metadata: Metadata = {
  title: 'Qui je suis, nmwstudios',
  description: 'Nathan Marimbordes, développeur web en micro-entreprise. Seul, et je le dis.',
}

const FAQ = [
  [
    'Vous êtes seul, que se passe-t-il si vous n’êtes plus disponible ?',
    'Le code est livré et documenté, le dépôt est à votre nom, l’hébergement est transférable. Un autre développeur peut reprendre le projet sans me demander quoi que ce soit.',
  ],
  [
    'Vous reprenez vraiment du code que vous n’avez pas écrit ?',
    'Oui. Trois conditions : le code source accessible en entier, un projet capable de redémarrer sur une machine neuve, un hébergement et un domaine transférables. Je ne reprends pas les sites montés sur un constructeur de pages : ça vous coûterait plus cher que de refaire.',
  ],
  [
    'Combien coûte un site ?',
    'Un site vitrine simple, jusqu’à trois pages, démarre à 1 500 €. Un site sur mesure avec une direction graphique et des animations propres se chiffre après cadrage. Les montants sont indicatifs et s’ajustent selon le périmètre et les contenus.',
  ],
  [
    'Combien de temps pour une première version ?',
    'Ça dépend du périmètre. Je vous donne une date au cadrage, et des versions visibles avant cette date.',
  ],
  [
    'Que se passe-t-il après la livraison ?',
    'Vous choisissez. Soit je continue à faire vivre le projet, soit vous repartez avec le code, la documentation et un hébergement transférable.',
  ],
  [
    'Travaillez-vous en marque blanche pour des agences ?',
    'Oui. Une agence parisienne me confie aujourd’hui son parc applicatif et ses nouveaux projets. Vos maquettes, vos délais, votre nom devant le client.',
  ],
] as const

export default function Page() {
  return (
    <Ecran>
      <div>
        <h2>Nathan Marimbordes.</h2>
        <p className="lead">
          Développeur web en micro-entreprise. Je travaille seul, et je le dis : si votre projet demande
          une équipe de cinq personnes, je vous le dirai et je vous orienterai.
        </p>
        <p>
          Le code est livré et documenté. Le dépôt est à votre nom. L’hébergement est transférable. Rien
          ne dépend d’un outil que quelqu’un d’autre ne pourrait pas reprendre.
        </p>
      </div>
      {/* name="faq" : le navigateur n'en garde qu'une ouverte, sans JavaScript. */}
      <div className="faq">
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
