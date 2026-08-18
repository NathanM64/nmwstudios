'use client'

import { useEffect, useState } from 'react'
import type { Configuration } from '@/lib/config/devis'
import { contrastRatio, parseColor } from '@/lib/color/contrast'

const PAGES_BASE = ['Accueil', 'Services', 'Contact']
const PAGES_SUP = ['Tarifs', 'Réalisations', 'À propos', 'Équipe', 'FAQ', 'Blog', 'Presse', 'Partenaires', 'Recrutement', 'Mentions', 'Plan', 'Aide']
const NAV_EN = ['Home', 'Services', 'Contact']

const CARTES: Record<string, string> = {
  heberg: 'votre-nom.fr · certificat valide',
  essentiel: 'Sauvegarde quotidienne · restauration en 1 h',
  serenite: 'Surveillance active · intervention sous 4 h',
  partenaire: 'Évolutions · rapport mensuel',
}

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

export function Apercu({ config }: { config: Configuration }) {
  const tranches = config.pages ?? 0
  const pages = [...PAGES_BASE, ...PAGES_SUP.slice(0, tranches * 3)]
  const langues = config.langue ?? 0
  const [langue, setLangue] = useState('fr')
  const ratio = useContrasteMesure((config.a11y ?? 0) > 0)
  const formule = ['partenaire', 'serenite', 'essentiel', 'heberg'].find((id) => (config[id] ?? 0) > 0)
  const libelles = langue === 'en' ? [...NAV_EN, ...PAGES_SUP.slice(0, tranches * 3)] : pages

  return (
    <div className="panel flex aspect-[4/3] w-full flex-col overflow-hidden">
      <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <span className="h-3 w-14 rounded-sm bg-accent/70" />
        <div data-testid="apercu-nav">
          <ul className="flex flex-wrap gap-2">
            {libelles.map((page) => (
              <li key={page} className="animate-apparait text-[0.5rem] text-muted-foreground">
                {page}
              </li>
            ))}
          </ul>
        </div>
        {langues > 0 && (
          <select
            data-testid="apercu-langue"
            value={langue}
            onChange={(e) => setLangue(e.target.value)}
            aria-label="Langue de l’aperçu"
            className="animate-apparait rounded-sm border border-border bg-transparent text-[0.5rem]"
          >
            <option value="fr">FR</option>
            <option value="en">EN</option>
          </select>
        )}
        {(config.membre ?? 0) > 0 && (
          <span data-testid="apercu-connexion" className="animate-apparait rounded-sm border border-border px-1.5 py-0.5 text-[0.5rem]">
            Connexion
          </span>
        )}
      </header>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="h-3 w-2/3 rounded-sm bg-foreground/25" />
        <div className="h-2 w-1/2 rounded-sm bg-foreground/15" />

        {(config.rdv ?? 0) > 0 && (
          <span data-testid="apercu-rdv" className="animate-apparait mt-1 w-fit rounded-sm bg-accent/20 px-2 py-1 text-[0.5rem]">
            Réserver un créneau
          </span>
        )}

        {ratio !== null && (
          <p data-testid="apercu-a11y" className="animate-apparait text-[0.5rem] text-accent">
            Contraste mesuré : {ratio.toFixed(2)}:1 · {ratio >= 4.5 ? 'conforme AA' : 'sous le seuil AA'}
          </p>
        )}

        {(config.seo ?? 0) > 0 && (
          <div data-testid="apercu-seo" className="animate-apparait rounded-sm border border-border p-2">
            <p className="text-[0.5rem] text-accent">votre-nom.fr</p>
            <p className="text-[0.5rem] text-foreground">Votre métier à Bègles · devis gratuit</p>
            <p className="text-[0.5rem] text-muted-foreground">Description reprise de votre page d’accueil.</p>
          </div>
        )}

        {(config.perf ?? 0) > 0 && (
          <p data-testid="apercu-perf" className="animate-apparait text-[0.5rem] text-muted-foreground">
            Chargement mesuré après optimisation
          </p>
        )}

        {formule && (
          <p data-testid="carte-etat" className="animate-apparait rounded-sm border border-border px-2 py-1 text-[0.5rem] text-muted-foreground">
            {CARTES[formule]}
          </p>
        )}

        {(config.blog ?? 0) > 0 && (
          <section data-testid="apercu-blog" className="animate-apparait mt-auto">
            <p className="text-[0.5rem] uppercase tracking-wider text-accent">Actualités</p>
            <div className="mt-1 grid grid-cols-3 gap-1">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-6 rounded-sm border border-border" />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
