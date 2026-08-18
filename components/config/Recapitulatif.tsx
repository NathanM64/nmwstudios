'use client'

import { OPTIONS, SOCLE_ID } from '@/lib/config/catalogue'
import { calculer, formaterEuros, suffixePrix, type Configuration } from '@/lib/config/devis'

export function Recapitulatif({ config }: { config: Configuration }) {
  const devis = calculer(config)
  const retenues = OPTIONS.filter((o) => o.id === SOCLE_ID || (config[o.id] ?? 0) > 0)

  return (
    <div id="recapitulatif" popover="auto" data-testid="recapitulatif"
         className="w-full max-w-lg rounded-lg border border-border bg-canvas p-6 text-foreground shadow-panel">
      <h2 className="text-lg font-semibold">Votre configuration</h2>

      <ul className="mt-4 flex flex-col gap-1 text-sm">
        {retenues.map((option) => {
          const quantite = config[option.id] ?? 1
          return (
            <li key={option.id} className="flex justify-between gap-4">
              <span>
                {option.libelle}
                {quantite > 1 && ` × ${quantite}`}
              </span>
              <span className="font-mono text-muted-foreground">
                {option.id === SOCLE_ID ? formaterEuros(option.prix) : suffixePrix(option, quantite)}
              </span>
            </li>
          )
        })}
      </ul>

      <p className="mt-4 font-mono">
        {formaterEuros(devis.bas)} – {formaterEuros(devis.haut)}
        {devis.mensuel > 0 && ` puis ${formaterEuros(devis.mensuel)}/mois`}
      </p>

      <form action="/api/recapitulatif" method="post" className="mt-6 flex flex-col gap-3">
        <input type="hidden" name="configuration" value={JSON.stringify(config)} />
        <label className="flex flex-col gap-1 text-sm">
          Votre adresse e-mail
          <input type="email" name="email" required
                 className="rounded-md border border-border bg-transparent px-3 py-2" />
        </label>
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" name="consentement" required className="mt-1 accent-accent" />
          J’accepte d’être recontacté au sujet de ce projet.
        </label>
        <button type="submit" className="rounded-md bg-accent px-4 py-2 text-canvas">
          Envoyer
        </button>
      </form>
    </div>
  )
}
