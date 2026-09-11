'use client'

import { useState, type FormEvent } from 'react'

type Etat = 'repos' | 'envoi' | 'envoye' | { erreur: string }
const SECOURS = 'L’envoi a échoué. Écrivez-moi directement à contact@nmwstudios.com.'

export function FormulaireContact() {
  const [etat, setEtat] = useState<Etat>('repos')

  async function envoyer(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    const form = ev.currentTarget
    const champs = Object.fromEntries(new FormData(form)) as Record<string, string>
    setEtat('envoi')
    try {
      const reponse = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: champs.nom,
          email: champs.email,
          message: champs.message,
          honeypot: champs.site ?? '',
        }),
      })
      if (reponse.status === 204) {
        form.reset()
        setEtat('envoye')
        return
      }
      const corps = (await reponse.json().catch(() => ({}))) as { error?: string }
      setEtat({ erreur: corps.error ?? SECOURS })
    } catch {
      setEtat({ erreur: SECOURS })
    }
  }

  return (
    <form className="contact panel" onSubmit={envoyer}>
      <label>
        <span className="eyebrow">Votre nom</span>
        <input type="text" name="nom" autoComplete="name" required maxLength={120} />
      </label>
      <label>
        <span className="eyebrow">Votre email</span>
        <input type="email" name="email" autoComplete="email" required maxLength={200} />
      </label>
      <label>
        <span className="eyebrow">Votre projet, en quelques lignes</span>
        <textarea name="message" rows={4} required maxLength={5000} />
      </label>
      {/* Le piège à robots : un humain ne le voit pas, un robot le remplit. */}
      <label className="piege" aria-hidden="true">
        Votre site
        <input type="text" name="site" tabIndex={-1} autoComplete="off" />
      </label>
      <p className="actions">
        <button className="bouton" type="submit" disabled={etat === 'envoi'}>
          {etat === 'envoi' ? 'Envoi en cours' : 'Envoyer'}
        </button>
        {etat === 'envoye' && (
          <span className="note" role="status">
            Message envoyé. Je vous réponds moi-même.
          </span>
        )}
        {typeof etat === 'object' && (
          <span className="note" role="alert">
            {etat.erreur}
          </span>
        )}
      </p>
    </form>
  )
}
