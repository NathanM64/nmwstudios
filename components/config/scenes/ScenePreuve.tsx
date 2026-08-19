'use client'

import { useEffect, useState } from 'react'
import type { Configuration } from '@/lib/config/devis'
import { contrastRatio, parseColor } from '@/lib/color/contrast'
import { lireChargement } from '@/lib/config/mesure'
import { DOMAINE_DEFAUT, editorialDe, type DomaineId } from '@/lib/config/domaines'

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

export function ScenePreuve({ config, domaine = DOMAINE_DEFAUT }: { config: Configuration; domaine?: DomaineId }) {
  // Cette scène n'a pas de sélecteur de langue : elle reste en français, comme le reste de ses libellés.
  const recherche = editorialDe(domaine, 'fr').recherche
  const ratio = useContrasteMesure()
  const [vitesse, setVitesse] = useState<number | null>(null)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mesure ponctuelle au montage, la seule vraie source de la scène.
    setVitesse(lireChargement(performance.getEntriesByType('navigation')))
  }, [])

  const retenus = CONTROLES.filter((controle) => (config[controle.id] ?? 0) > 0).length

  return (
    <div className="animate-apparait m-air-serre m-marge flex flex-1 flex-col">
      <p data-testid="preuve-score" className="m-surtitre">
        {retenus} / {CONTROLES.length} contrôles retenus
      </p>

      <div className="flex flex-1 flex-col justify-center gap-0.5">
        {CONTROLES.map((controle) => {
          const retenu = (config[controle.id] ?? 0) > 0
          return (
            <div
              key={controle.id}
              data-testid="preuve-ligne"
              data-retenu={retenu ? 'oui' : 'non'}
              // opacity-70 : la ligne reste en retrait sans passer sous 4,5:1, mesuré dans les deux
              // thèmes et modélisé par tests/unit/configurateur-contraste.test.ts.
              className={`m-cadre m-ligne flex flex-col gap-0.5 ${retenu ? '' : 'opacity-70'}`}
            >
              <p className="m-corps">{controle.nom}</p>

              {retenu && controle.id === 'seo' && (
                <div data-testid="preuve-serp" className="animate-apparait m-cadre px-1 py-0.5">
                  <p className="m-mono">votre-nom.fr</p>
                  <p className="m-corps">{recherche.titre}</p>
                  <p className="m-legende">{recherche.description}</p>
                </div>
              )}

              {retenu && controle.id === 'seo-local' && (
                <p className="m-legende">Bègles · horaires d’ouverture renseignés</p>
              )}

              {retenu && controle.id === 'perf' && (
                <>
                  {/* Artefact visuel, aucune requête simulée : la mesure vient du texte en dessous. */}
                  <div data-testid="preuve-cascade" className="animate-apparait flex flex-col gap-0.5">
                    {[100, 65, 40, 20].map((largeur, i) => (
                      <span key={i} className="m-barre h-0.5" style={{ width: `${largeur}%` }} />
                    ))}
                  </div>
                  <p data-testid="preuve-vitesse" className="m-corps m-accent">
                    {vitesse === null
                      ? 'mesure indisponible'
                      : `mesuré sur ce configurateur, pas sur votre futur site : ${vitesse.toFixed(2).replace('.', ',')} s`}
                  </p>
                </>
              )}

              {retenu && controle.id === 'a11y' && ratio !== null && (
                <p data-testid="apercu-a11y" className="m-legende m-accent">
                  mesuré sur ce configurateur, pas sur votre futur site : {ratio.toFixed(2).replace('.', ',')}:1 ·{' '}
                  {ratio >= 4.5 ? 'conforme AA' : 'sous le seuil AA'}
                </p>
              )}

              {retenu && controle.id === 'rgpd' && (
                <p data-testid="preuve-rgpd" className="m-cadre m-legende w-fit px-1 py-0.5">
                  Bannière de consentement aux cookies
                </p>
              )}

              {retenu && controle.id === 'legal' && (
                <p data-testid="preuve-legal" className="m-legende">
                  Pied de page · Mentions légales
                </p>
              )}

              {retenu && controle.id === 'migration' && (
                <div data-testid="preuve-redirections" className="m-legende flex flex-col gap-0.5 font-mono">
                  <p>/ancien-site/accueil → / · 301</p>
                  <p>/ancien-site/contact → /#contact · 301</p>
                </div>
              )}

              {retenu && controle.id === 'domaine' && (
                <p data-testid="preuve-domaine" className="m-legende">
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
