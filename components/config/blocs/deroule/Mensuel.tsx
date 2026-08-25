'use client'

import { OPTIONS } from '@/lib/config/catalogue'
import type { Configuration } from '@/lib/config/devis'

const OPTIONS_RECURRENTES = OPTIONS.filter((o) => o.groupe === 'recurrent')

/** Rendez-vous mensuels par formule. `sans-suivi` n'y figure pas : son refus a sa propre manifestation. */
const EVENEMENTS: Record<string, string[]> = {
  heberg: ['Hébergement et domaine', 'Certificat renouvelé'],
  essentiel: ['Sauvegarde quotidienne', 'Mises à jour et correctifs', 'Surveillance'],
  serenite: ['Sauvegarde quotidienne', 'Mises à jour et correctifs', 'Surveillance', 'Intervention sous 4 h', '1 h de modifications'],
  partenaire: ['Sauvegarde quotidienne', 'Mises à jour et correctifs', 'Surveillance', 'Intervention sous 4 h', 'Évolutions', 'Rapport mensuel'],
}

/** Ce que le client reprend en refusant le suivi : les mêmes rendez-vous, à sa charge. */
const A_VOTRE_CHARGE = ['Sauvegarde', 'Mises à jour', 'Surveillance']

export function Mensuel({ config }: { config: Configuration }) {
  const formule = OPTIONS_RECURRENTES.find((o) => (config[o.id] ?? 0) > 0)
  const evenements = formule ? (EVENEMENTS[formule.id] ?? []) : []
  const refus = formule?.id === 'sans-suivi'

  return (
    <div data-endroit="deroule-mensuel" className="m-air-serre flex shrink-0 flex-col">
      <div className="flex items-baseline gap-3">
        <p className="m-surtitre">Chaque mois, après la livraison</p>
        <span className="m-filet h-px flex-1" />
      </div>
      <div data-testid="deroule-mois" className="flex flex-col gap-1">
        {evenements.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {evenements.map((e) => (
              <span key={e} data-testid="deroule-evenement" className="animate-glisse m-puce px-1.5">
                {e}
              </span>
            ))}
          </div>
        )}

        {refus && (
          <div data-testid="deroule-sans-suivi" className="animate-apparait flex flex-col gap-1">
            <div className="flex flex-wrap gap-1">
              {A_VOTRE_CHARGE.map((e) => (
                <span key={e} data-testid="deroule-charge" className="m-cadre-tiret m-legende px-1.5">
                  {e}
                </span>
              ))}
            </div>
            <p className="m-legende">Personne ne passe : le site est à vous, et vous vous en occupez.</p>
          </div>
        )}

        {!formule && <p className="m-legende">Après la livraison, à vous de dire qui s’en occupe.</p>}
      </div>
    </div>
  )
}
