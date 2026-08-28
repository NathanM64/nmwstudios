'use client'

import { useState } from 'react'
import { LEGAL } from '@/lib/legal'

// The only client component on the site. It costs a little JavaScript, and it stops a
// prospect on a machine with no mail client from leaving without writing.
// The endpoint lives in service/: the site is a static export and receives nothing.

type State = { kind: 'idle' | 'sending' | 'sent' } | { kind: 'error'; message: string }

const FALLBACK = `Le message n’est pas parti. Écrivez-moi directement à ${LEGAL.email}.`

export function Form() {
  const [state, setState] = useState<State>({ kind: 'idle' })

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (state.kind === 'sending') return

    const fields = new FormData(event.currentTarget)
    setState({ kind: 'sending' })

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(fields)),
      })

      if (response.ok) return setState({ kind: 'sent' })

      // The service returns a sentence that can be shown as is. When it does not, an agency
      // director should not be reading an HTTP status code.
      const body = await response.json().catch(() => null)
      setState({ kind: 'error', message: body?.error ?? FALLBACK })
    } catch {
      setState({ kind: 'error', message: FALLBACK })
    }
  }

  if (state.kind === 'sent') {
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
    <form onSubmit={submit} className="space-y-6">
      {/* A human neither sees it nor reaches it with the keyboard. A bot fills it, and the
          service answers 204 without sending anything. */}
      <div aria-hidden="true" className="absolute left-[-9999px]">
        <label htmlFor="honeypot">Ne remplissez pas ce champ</label>
        <input id="honeypot" name="honeypot" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field name="name" label="Prénom Nom" autoComplete="name" maxLength={120} />
        <Field
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          maxLength={200}
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm text-ink-soft">
          Ce que vous avez sur les bras
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          maxLength={5000}
          className="field mt-2 resize-y"
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1">
        <button
          type="submit"
          disabled={state.kind === 'sending'}
          className="pill px-7 py-3 font-display text-[0.95rem] font-bold tracking-[-0.01em] disabled:opacity-60"
        >
          {state.kind === 'sending' ? 'Envoi…' : 'Envoyer'}
        </button>

        {state.kind === 'error' ? (
          <p role="alert" className="text-sm leading-relaxed text-ink">
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  )
}

function Field({
  name,
  label,
  type = 'text',
  autoComplete,
  maxLength,
}: {
  name: string
  label: string
  type?: string
  autoComplete?: string
  maxLength: number
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm text-ink-soft">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        maxLength={maxLength}
        autoComplete={autoComplete}
        className="field mt-2"
      />
    </div>
  )
}
