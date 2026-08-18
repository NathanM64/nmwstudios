'use client'

import { useEffect, useState } from 'react'
import { OPTIONS, SOCLE_ID } from '@/lib/config/catalogue'
import { calculer, formaterEuros, suffixePrix, type Configuration } from '@/lib/config/devis'
import { encoder } from '@/lib/config/url'
import { LEGAL } from '@/lib/legal'

export function Recapitulatif({ config }: { config: Configuration }) {
  const devis = calculer(config)
  const retenues = OPTIONS.filter((o) => o.id === SOCLE_ID || (config[o.id] ?? 0) > 0)
  const [lien, setLien] = useState('')

  // `location` n'existe pas au rendu serveur : posé après montage, recalculé si la configuration change.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- dépend de `location`, indisponible au rendu serveur.
    setLien(`${location.origin}${location.pathname}?${encoder(config)}`)
  }, [config])

  const sujet = encodeURIComponent('Ma configuration de site')
  const corps = encodeURIComponent(`Bonjour,\n\nVoici ma configuration : ${lien}`)
  const mailto = `mailto:${LEGAL.email}?subject=${sujet}&body=${corps}`

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

      <a href={mailto} className="mt-6 inline-block rounded-md bg-accent px-4 py-2 text-center text-canvas">
        Envoyer par e-mail
      </a>
    </div>
  )
}
