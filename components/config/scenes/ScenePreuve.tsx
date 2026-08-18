'use client'

import { useEffect, useState } from 'react'
import type { Configuration } from '@/lib/config/devis'
import { contrastRatio, parseColor } from '@/lib/color/contrast'

/** Contraste réellement rendu : lu sur le DOM, jamais écrit en dur. */
function useContrasteMesure(actif: boolean): number | null {
  const [ratio, setRatio] = useState<number | null>(null)

  useEffect(() => {
    if (!actif) return
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
  }, [actif])

  // Dérivé au rendu plutôt que remis à `null` dans l'effet : évite un setState superflu.
  return actif ? ratio : null
}

export function ScenePreuve({ config }: { config: Configuration }) {
  // Scène entière dédiée à la preuve : plus de garde sur la sous-section conformité.
  const ratio = useContrasteMesure(true)

  return (
    <div className="animate-apparait flex flex-1 flex-col">
      <div className="flex flex-1 flex-col justify-center gap-2 p-4">
        {(config.seo ?? 0) > 0 && (
          <div data-testid="apercu-seo" className="animate-apparait w-full rounded-sm border border-border p-2">
            <p className="text-[0.5rem] text-accent">votre-nom.fr</p>
            <p className="text-[0.5rem] text-foreground">Votre métier à Bègles · devis gratuit</p>
            <p className="text-[0.5rem] text-muted-foreground">Description reprise de votre page d’accueil.</p>
          </div>
        )}
        {(config['seo-local'] ?? 0) > 0 && (
          <div data-testid="apercu-seo-local" className="animate-apparait w-full rounded-sm border border-border p-2">
            <p className="text-[0.5rem] text-accent">votre-nom.fr</p>
            <p className="text-[0.5rem] text-foreground">Bègles</p>
            <p className="text-[0.5rem] text-muted-foreground">Horaires d’ouverture renseignés</p>
          </div>
        )}
        {(config.seo ?? 0) === 0 && (config['seo-local'] ?? 0) === 0 && (
          <p data-testid="apercu-recherche-vide" className="animate-apparait text-[0.5rem] text-muted-foreground">
            Rien à montrer dans les résultats de recherche pour l’instant.
          </p>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-center gap-2 p-4">
        {ratio !== null && (config.a11y ?? 0) > 0 && (
          <p data-testid="apercu-a11y" className="animate-apparait text-[0.5rem] text-accent">
            Contraste mesuré : {ratio.toFixed(2)}:1 · {ratio >= 4.5 ? 'conforme AA' : 'sous le seuil AA'}
          </p>
        )}
        {(config.rgpd ?? 0) > 0 && (
          <p data-testid="apercu-rgpd" className="animate-apparait w-fit rounded-sm border border-border px-2 py-1 text-[0.5rem] text-muted-foreground">
            Bannière de consentement aux cookies
          </p>
        )}
        {(config.legal ?? 0) > 0 && (
          <p data-testid="apercu-legal" className="animate-apparait text-[0.5rem] text-muted-foreground">
            Pied de page · Mentions légales
          </p>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-center gap-2 p-4">
        {(config.perf ?? 0) > 0 && (
          <p data-testid="apercu-perf" className="animate-apparait text-[0.5rem] text-muted-foreground">
            Chargement mesuré après optimisation
          </p>
        )}
        {(config.domaine ?? 0) > 0 && (
          <p data-testid="apercu-domaine" className="animate-apparait text-[0.5rem] text-muted-foreground">
            votre-nom.fr · domaine réservé
          </p>
        )}
        {(config.migration ?? 0) > 0 && (
          <p data-testid="apercu-migration" className="animate-apparait text-[0.5rem] text-muted-foreground">
            Adresses de l’ancien site redirigées
          </p>
        )}
        {(config.perf ?? 0) === 0 && (config.domaine ?? 0) === 0 && (config.migration ?? 0) === 0 && (
          <p data-testid="apercu-technique-vide" className="animate-apparait text-[0.5rem] text-muted-foreground">
            Rien de technique retenu pour l’instant.
          </p>
        )}
      </div>
    </div>
  )
}
