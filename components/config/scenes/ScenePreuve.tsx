'use client'

import { useEffect, useState } from 'react'
import type { Configuration } from '@/lib/config/devis'
import { contrastRatio, parseColor } from '@/lib/color/contrast'
import { lireChargement } from '@/lib/config/mesure'

/** Contraste réellement rendu : lu sur le DOM, jamais écrit en dur. */
function useContrasteMesure(): number | null {
  const [ratio, setRatio] = useState<number | null>(null)

  useEffect(() => {
    const mesurer = () => {
      const styles = getComputedStyle(document.documentElement)
      const texte = parseColor(styles.getPropertyValue('--color-foreground').trim())
      const fond = parseColor(styles.getPropertyValue('--color-canvas').trim())
      setRatio(contrastRatio(texte.rgb, fond.rgb))
    }
    mesurer()
    // Le thème se change depuis cet écran : sans observation, le chiffre affiché ment.
    const observateur = new MutationObserver(mesurer)
    observateur.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observateur.disconnect()
  }, [])

  return ratio
}

const CONTROLES = [
  { id: 'seo', nom: 'Vous apparaissez dans les résultats' },
  { id: 'seo-local', nom: 'Fiche locale et horaires' },
  { id: 'perf', nom: 'Vitesse de chargement' },
  { id: 'a11y', nom: 'Contraste du texte' },
  { id: 'rgpd', nom: 'Consentement aux cookies' },
  { id: 'legal', nom: 'Mentions légales et CGV' },
  { id: 'migration', nom: 'Anciennes adresses redirigées' },
  { id: 'domaine', nom: 'Adresse et certificat' },
] as const

export function ScenePreuve({ config }: { config: Configuration }) {
  const ratio = useContrasteMesure()
  const [vitesse, setVitesse] = useState<number | null>(null)

  useEffect(() => {
    // Indirection requise par react-hooks/set-state-in-effect : un setState direct au premier niveau de l'effet est refusé.
    const mesurer = () => setVitesse(lireChargement(performance.getEntriesByType('navigation')))
    mesurer()
  }, [])

  const retenus = CONTROLES.filter((controle) => (config[controle.id] ?? 0) > 0).length

  return (
    <div className="animate-apparait flex flex-1 flex-col gap-1.5 p-3">
      <p data-testid="preuve-score" className="text-[0.55rem] uppercase tracking-wider text-accent">
        {retenus} / {CONTROLES.length} contrôles retenus
      </p>

      <div className="flex flex-1 flex-col justify-center gap-1">
        {CONTROLES.map((controle) => {
          const retenu = (config[controle.id] ?? 0) > 0
          return (
            <div
              key={controle.id}
              data-testid="preuve-ligne"
              data-retenu={retenu ? 'oui' : 'non'}
              className={`rounded-sm border border-border p-1 ${retenu ? '' : 'opacity-40'}`}
            >
              <p className="text-[0.55rem] leading-tight text-foreground">{controle.nom}</p>

              {retenu && controle.id === 'seo' && (
                <div data-testid="preuve-serp" className="animate-apparait mt-0.5 rounded-sm border border-border p-1">
                  <p className="text-[0.45rem] text-accent">votre-nom.fr</p>
                  <p className="text-[0.45rem] text-foreground">Votre métier à Bègles · devis gratuit</p>
                  <p className="text-[0.45rem] text-muted-foreground">Description reprise de votre page d’accueil.</p>
                </div>
              )}

              {retenu && controle.id === 'seo-local' && (
                <p className="mt-0.5 text-[0.45rem] text-muted-foreground">Bègles · horaires d’ouverture renseignés</p>
              )}

              {retenu && controle.id === 'perf' && (
                <>
                  {/* Aucune requête réelle à simuler : la forme suffit à évoquer un chargement, la mesure vient du texte en dessous. */}
                  <div data-testid="preuve-cascade" className="animate-apparait mt-0.5 flex flex-col gap-0.5">
                    {[100, 65, 40, 20].map((largeur, i) => (
                      <span key={i} className="h-1 rounded-sm bg-accent/40" style={{ width: `${largeur}%` }} />
                    ))}
                  </div>
                  <p data-testid="preuve-vitesse" className="mt-0.5 text-[0.45rem] text-muted-foreground">
                    {vitesse === null ? 'mesure indisponible' : `cette page a chargé en ${vitesse.toFixed(2)} s`}
                  </p>
                </>
              )}

              {retenu && controle.id === 'a11y' && ratio !== null && (
                <p data-testid="apercu-a11y" className="mt-0.5 text-[0.45rem] text-accent">
                  Contraste mesuré : {ratio.toFixed(2)}:1 · {ratio >= 4.5 ? 'conforme AA' : 'sous le seuil AA'}
                </p>
              )}

              {retenu && controle.id === 'rgpd' && (
                <p data-testid="preuve-rgpd" className="mt-0.5 w-fit rounded-sm border border-border px-1 py-0.5 text-[0.45rem] text-muted-foreground">
                  Bannière de consentement aux cookies
                </p>
              )}

              {retenu && controle.id === 'legal' && (
                <p data-testid="preuve-legal" className="mt-0.5 text-[0.45rem] text-muted-foreground">
                  Pied de page · Mentions légales
                </p>
              )}

              {retenu && controle.id === 'migration' && (
                <div data-testid="preuve-redirections" className="mt-0.5 flex flex-col gap-0.5 font-mono text-[0.45rem] text-muted-foreground">
                  <p>/ancien-site/accueil → / · 301</p>
                  <p>/ancien-site/contact → /#contact · 301</p>
                </div>
              )}

              {retenu && controle.id === 'domaine' && (
                <p data-testid="preuve-domaine" className="mt-0.5 text-[0.45rem] text-muted-foreground">
                  votre-nom.fr · certificat valide
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
