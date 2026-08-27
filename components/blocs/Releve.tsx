'use client'

import { useEffect, useState } from 'react'
import { Verre } from '@/components/ui/Verre'

type Mesure = { tiers: number; cookies: number; domaines: string[] }

// Le site affirme qu'il ne charge rien d'ailleurs. Plutôt que de l'écrire une deuxième fois,
// il le mesure dans le navigateur du lecteur.
//
// Le poids de la page a été retiré : au rechargement les ressources viennent du cache et
// sortent des entrées de performance, donc transferSize, encodedBodySize et decodedBodySize
// changent tous les trois d'une visite à l'autre. Un chiffre qui se contredit prouve le
// contraire de ce qu'il annonce.
function mesurer(): Mesure {
  const ressources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
  const domaines = new Set<string>([location.hostname])
  for (const ressource of ressources) {
    // Une URI data: passe dans new URL sans lever, avec un hostname vide. Sans ce filtre,
    // le grain du mur et les cartes de déplacement comptaient comme un domaine tiers.
    try {
      const url = new URL(ressource.name)
      if (url.protocol.startsWith('http') && url.hostname) domaines.add(url.hostname)
    } catch {
      // Une entrée sans URL analysable ne sort d'aucun domaine.
    }
  }

  return {
    tiers: [...domaines].filter((domaine) => domaine !== location.hostname).length,
    cookies: document.cookie.split(';').filter(Boolean).length,
    domaines: [...domaines],
  }
}

export function Releve() {
  const [mesure, setMesure] = useState<Mesure | null>(null)

  useEffect(() => {
    // Après le chargement complet, sinon le relevé est pris au milieu du transfert.
    const relever = () => setMesure(mesurer())
    if (document.readyState === 'complete') relever()
    else window.addEventListener('load', relever, { once: true })
    return () => window.removeEventListener('load', relever)
  }, [])

  const lignes: { libelle: string; valeur: number | null }[] = [
    { libelle: 'Domaines tiers contactés', valeur: mesure?.tiers ?? null },
    { libelle: 'Cookies déposés', valeur: mesure?.cookies ?? null },
  ]

  return (
    <Verre className="px-7 py-7 sm:px-9 sm:py-9">
      <dl>
        {lignes.map((ligne, rang) => (
          <div
            key={ligne.libelle}
            className={`flex items-baseline justify-between gap-6 py-4 ${
              rang > 0 ? 'border-t border-encre/10' : 'pt-0'
            }`}
          >
            <dt className="text-encre-douce">{ligne.libelle}</dt>
            <dd className="chiffres font-display text-[2rem] font-extrabold leading-none tracking-[-0.03em]">
              {ligne.valeur === null ? (
                <span
                  aria-hidden="true"
                  className="inline-block h-[1.1rem] w-9 rounded-full bg-encre/10 align-middle"
                />
              ) : (
                ligne.valeur
              )}
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-6 border-t border-encre/10 pt-5 text-sm leading-relaxed text-encre-douce">
        {[
          'Relevé à l’instant dans votre navigateur, pas une capture.',
          mesure ? `Cette page a contacté ${mesure.domaines.join(', ')}, et rien d’autre.` : '',
          'Ouvrez l’onglet réseau : vous trouverez le même compte.',
        ]
          .filter(Boolean)
          .join(' ')}
      </p>
    </Verre>
  )
}
