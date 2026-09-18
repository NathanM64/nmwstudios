'use client'

import { useState, type FormEvent } from 'react'
import type { Dictionnaire } from '@/content/types'

type Etat = 'repos' | 'envoi' | 'envoye' | { erreur: string }

export function FormulaireContact({ t }: { t: Dictionnaire['formulaire'] }) {
  const [etat, setEtat] = useState<Etat>('repos')

  async function envoyer(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    const champs = Object.fromEntries(new FormData(ev.currentTarget)) as Record<string, string>
    // Le service ne connaît que trois champs : l'adresse du site ouvre le message. Ces deux lignes
    // sont pour Nathan, elles restent en français.
    const entete = [champs.url && `Site : ${champs.url}`, champs.telephone && `Téléphone : ${champs.telephone}`].filter(Boolean).join('\n')
    const message = entete ? `${entete}\n\n${champs.message}` : champs.message
    setEtat('envoi')
    try {
      const reponse = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: champs.nom, email: champs.email, message, honeypot: champs.site ?? '' }),
      })
      if (reponse.status === 204) {
        setEtat('envoye')
        return
      }
      // Le service répond en français : le message vient d'ici, dans la langue de la page.
      setEtat({ erreur: reponse.status === 429 ? t.tropDeMessages : t.secours })
    } catch {
      setEtat({ erreur: t.secours })
    }
  }

  if (etat === 'envoye') {
    return (
      <div className="contact panel envoye" role="status">
        <p className="lead">{t.envoye}</p>
        <p>{t.envoyeDetail}</p>
      </div>
    )
  }

  return (
    <form className="contact panel" onSubmit={envoyer}>
      <label>
        <span className="eyebrow">{t.nom}</span>
        <input type="text" name="nom" autoComplete="name" required maxLength={120} />
      </label>
      <label>
        <span className="eyebrow">{t.email}</span>
        <input type="email" name="email" autoComplete="email" required maxLength={200} placeholder={t.emailPlaceholder} />
      </label>
      <label>
        <span className="eyebrow">
          {t.url} <span className="optionnel">{t.facultatif}</span>
        </span>
        <input type="url" name="url" autoComplete="url" maxLength={300} placeholder="https://" />
      </label>
      <label>
        <span className="eyebrow">
          {t.telephone} <span className="optionnel">{t.facultatif}</span>
        </span>
        <input type="tel" name="telephone" autoComplete="tel" maxLength={40} />
      </label>
      <label>
        <span className="eyebrow">{t.projet}</span>
        <textarea name="message" rows={4} required maxLength={5000} placeholder={t.projetPlaceholder} />
      </label>
      {/* Le piège à robots : un humain ne le voit pas, un robot le remplit. */}
      <label className="piege" aria-hidden="true">
        {t.piege}
        <input type="text" name="site" tabIndex={-1} autoComplete="off" />
      </label>
      <p className="actions">
        <button className="bouton" type="submit" disabled={etat === 'envoi'}>
          {etat === 'envoi' ? t.envoiEnCours : t.envoyer}
        </button>
        {typeof etat === 'object' && (
          <span className="note" role="alert">
            {etat.erreur}
          </span>
        )}
      </p>
    </form>
  )
}
