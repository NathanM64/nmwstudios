'use client'

import { useEffect, useRef, useState } from 'react'
import { Verre } from '@/components/ui/Verre'

type Ligne = { libelle: string; valeur: number; unite?: string }

// Le site affirme qu'il ne charge rien d'ailleurs. Plutôt que de l'écrire une deuxième fois,
// il le mesure dans le navigateur du lecteur et affiche le relevé.
function mesurer(): Ligne[] {
  const ressources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
  const tiers = new Set(
    ressources
      .map((r) => {
        try {
          return new URL(r.name).hostname
        } catch {
          return ''
        }
      })
      .filter((h) => h && h !== location.hostname),
  )

  const navigation = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
  const octets =
    ressources.reduce((total, r) => total + (r.transferSize || 0), 0) +
    (navigation[0]?.transferSize || 0)

  return [
    { libelle: 'Domaines tiers contactés', valeur: tiers.size },
    { libelle: 'Cookies déposés', valeur: document.cookie.split(';').filter(Boolean).length },
    { libelle: 'Poids de cette page', valeur: Math.round(octets / 1024), unite: 'ko' },
  ]
}

export function Releve() {
  const [lignes, setLignes] = useState<Ligne[] | null>(null)
  const [avancement, setAvancement] = useState(1)
  const bloc = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Après le chargement complet, sinon le poids est relevé au milieu du transfert.
    const relever = () => setLignes(mesurer())
    if (document.readyState === 'complete') relever()
    else window.addEventListener('load', relever, { once: true })
    return () => window.removeEventListener('load', relever)
  }, [])

  useEffect(() => {
    const cible = bloc.current
    if (!lignes || !cible) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Les chiffres montent une fois, quand le relevé entre dans le champ.
    let image = 0
    const observateur = new IntersectionObserver(
      ([entree]) => {
        if (!entree.isIntersecting) return
        observateur.disconnect()
        const depart = performance.now()
        const avancer = (maintenant: number) => {
          const t = Math.min(1, (maintenant - depart) / 900)
          setAvancement(1 - Math.pow(1 - t, 3))
          if (t < 1) image = requestAnimationFrame(avancer)
        }
        setAvancement(0)
        image = requestAnimationFrame(avancer)
      },
      { threshold: 0.4 },
    )
    observateur.observe(cible)
    return () => {
      observateur.disconnect()
      cancelAnimationFrame(image)
    }
  }, [lignes])

  return (
    <Verre className="px-7 py-7 sm:px-9 sm:py-9">
      <div ref={bloc}>
        <dl>
          {(lignes ?? [
            { libelle: 'Domaines tiers contactés', valeur: -1 },
            { libelle: 'Cookies déposés', valeur: -1 },
            { libelle: 'Poids de cette page', valeur: -1, unite: 'ko' },
          ]).map((ligne, rang) => (
            <div
              key={ligne.libelle}
              className={`flex items-baseline justify-between gap-6 py-4 ${
                rang > 0 ? 'border-t border-encre/10' : 'pt-0'
              }`}
            >
              <dt className="text-encre-douce">{ligne.libelle}</dt>
              <dd className="chiffres font-display text-[2rem] font-extrabold leading-none tracking-[-0.03em]">
                {ligne.valeur < 0 ? (
                  <span
                    aria-hidden="true"
                    className="inline-block h-[1.1rem] w-9 rounded-full bg-encre/10 align-middle"
                  />
                ) : (
                  <>
                    {Math.round(ligne.valeur * avancement)}
                    {ligne.unite ? (
                      <span className="ml-1.5 text-base font-bold text-encre-douce">
                        {ligne.unite}
                      </span>
                    ) : null}
                  </>
                )}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 border-t border-encre/10 pt-5 text-sm leading-relaxed text-encre-douce">
          Relevé à l&rsquo;instant dans votre navigateur, pas une capture. Ouvrez l&rsquo;onglet
          réseau : vous trouverez le même compte.
        </p>
      </div>
    </Verre>
  )
}
