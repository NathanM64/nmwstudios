'use client'

import { useState } from 'react'
import { LEGAL } from '@/lib/legal'

// Le seul composant client du site. Il coûte un peu de JavaScript, et il évite qu'un
// prospect sur un poste sans client mail configuré reparte sans avoir écrit.
// L'endpoint vit dans service/ : le site est un export statique, il ne reçoit rien.

type Etat = { forme: 'repos' | 'envoi' | 'parti' } | { forme: 'erreur'; message: string }

const REPLI = `Le message n’est pas parti. Écrivez-moi directement à ${LEGAL.email}.`

export function Formulaire() {
  const [etat, setEtat] = useState<Etat>({ forme: 'repos' })

  async function envoyer(evenement: React.FormEvent<HTMLFormElement>) {
    evenement.preventDefault()
    if (etat.forme === 'envoi') return

    const champs = new FormData(evenement.currentTarget)
    setEtat({ forme: 'envoi' })

    try {
      const reponse = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(champs)),
      })

      if (reponse.ok) return setEtat({ forme: 'parti' })

      // Le service renvoie une phrase utilisable telle quelle. S'il n'en renvoie pas,
      // on ne montre pas un code HTTP à un directeur d'agence.
      const corps = await reponse.json().catch(() => null)
      setEtat({ forme: 'erreur', message: corps?.erreur ?? REPLI })
    } catch {
      setEtat({ forme: 'erreur', message: REPLI })
    }
  }

  if (etat.forme === 'parti') {
    return (
      <p
        role="status"
        className="font-display text-xl font-bold leading-snug tracking-[-0.02em] text-balance"
      >
        C’est parti. Je réponds sous vingt-quatre heures ouvrées, et toujours par oui ou par
        non.
      </p>
    )
  }

  return (
    <form onSubmit={envoyer} className="space-y-6">
      {/* Un humain ne le voit ni ne l'atteint au clavier. Un robot le remplit, et le
          service répond 204 sans rien envoyer. */}
      <div aria-hidden="true" className="absolute left-[-9999px]">
        <label htmlFor="piege">Ne remplissez pas ce champ</label>
        <input id="piege" name="piege" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Champ nom="nom" libelle="Votre nom" autoComplete="name" />
        <Champ nom="email" libelle="Votre adresse" type="email" autoComplete="email" />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm text-encre-douce">
          Ce que vous avez sur les bras
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          maxLength={5000}
          className="champ mt-2 resize-y"
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1">
        <button
          type="submit"
          disabled={etat.forme === 'envoi'}
          className="capsule px-7 py-3 font-display text-[0.95rem] font-bold tracking-[-0.01em] disabled:opacity-60"
        >
          {etat.forme === 'envoi' ? 'Envoi…' : 'Envoyer'}
        </button>

        {etat.forme === 'erreur' ? (
          <p role="alert" className="text-sm leading-relaxed text-encre">
            {etat.message}
          </p>
        ) : null}
      </div>
    </form>
  )
}

function Champ({
  nom,
  libelle,
  type = 'text',
  autoComplete,
}: {
  nom: string
  libelle: string
  type?: string
  autoComplete?: string
}) {
  return (
    <div>
      <label htmlFor={nom} className="block text-sm text-encre-douce">
        {libelle}
      </label>
      <input
        id={nom}
        name={nom}
        type={type}
        required
        maxLength={nom === 'email' ? 200 : 120}
        autoComplete={autoComplete}
        className="champ mt-2"
      />
    </div>
  )
}
