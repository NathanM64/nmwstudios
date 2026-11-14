import type { Dictionnaire } from '@/content/types'
import { Ecran } from '@/components/Ecran'

export function Qui({ t }: { t: Dictionnaire }) {
  const q = t.qui
  return (
    <Ecran classe="qui">
      <div>
        <h1>{q.h1}</h1>
        <p className="lead">
          {q.lead[0]} <span className="client">{q.lead[1]}</span> {q.lead[2]}
        </p>
        <p>{q.paragraphe}</p>
        <p className="faits">{q.faits}</p>
      </div>
      {/* name="faq" : le navigateur n'en garde qu'une ouverte, sans JavaScript. */}
      <div className="faq panel">
        {q.faq.map(([question, reponse], i) => (
          <details key={question} className="qa" name="faq" open={i === 0}>
            <summary>{question}</summary>
            <p>{reponse}</p>
          </details>
        ))}
      </div>
    </Ecran>
  )
}
