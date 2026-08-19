'use client'

import { Fragment, memo, useEffect, useRef, useState } from 'react'
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

/** Compteur qui s'incrémente au lieu de sauter. La durée suit l'écart : sans cela, passer de
 *  zéro à huit se lirait aussi vite qu'un plus un. */
function useCompteur(cible: number): { valeur: number; anime: boolean } {
  const [valeur, setValeur] = useState(0)
  const depart = useRef(0)

  useEffect(() => {
    const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const debut = depart.current
    if (reduit || debut === cible) {
      setValeur(cible)
      depart.current = cible
      return
    }

    const duree = Math.min(700, 180 + 70 * Math.abs(cible - debut))
    const t0 = performance.now()
    let image = 0
    const pas = () => {
      const avance = Math.min(1, (performance.now() - t0) / duree)
      const courant = Math.round(debut + (cible - debut) * avance)
      setValeur(courant)
      depart.current = courant
      if (avance < 1) image = requestAnimationFrame(pas)
    }
    image = requestAnimationFrame(pas)
    return () => cancelAnimationFrame(image)
  }, [cible])

  return { valeur, anime: valeur !== cible }
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

export const ScenePreuve = memo(function ScenePreuve({
  config,
  domaine = DOMAINE_DEFAUT,
}: {
  config: Configuration
  domaine?: DomaineId
}) {
  // Cette scène n'a pas de sélecteur de langue : elle reste en français, comme le reste de ses libellés.
  const recherche = editorialDe(domaine, 'fr').recherche
  const ratio = useContrasteMesure()
  const [vitesse, setVitesse] = useState<number | null>(null)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mesure ponctuelle au montage, la seule vraie source de la scène.
    setVitesse(lireChargement(performance.getEntriesByType('navigation')))
  }, [])

  const retenus = CONTROLES.filter((controle) => (config[controle.id] ?? 0) > 0).length
  const compteur = useCompteur(retenus)

  return (
    <div className="animate-apparait m-air-serre m-marge flex flex-1 flex-col">
      {/* Le compteur domine, les huit lignes se rangent dessous. Sur une ligne avec son
          libellé plutôt qu'au-dessus : le cadre en bandeau ne paie pas deux fois. */}
      <div className="flex shrink-0 items-baseline gap-3">
        <p
          data-testid="preuve-score"
          data-anime={compteur.anime ? 'oui' : 'non'}
          className="m-chiffre shrink-0"
        >
          {compteur.valeur} / {CONTROLES.length}
        </p>
        <div className="min-w-0 flex-1">
          <p className="m-surtitre">contrôles retenus</p>
          <span className="m-filet mt-1 block h-px w-full" />
        </div>
      </div>

      {/* Les lignes s'étirent pour occuper la place libre, aucune ne se comprime sous son
          contenu : c'est le centrage qui creusait les bandes vides de la version précédente. */}
      <div className="m-air-serre flex flex-1 flex-col">
        {CONTROLES.map((controle) => {
          const retenu = (config[controle.id] ?? 0) > 0
          return (
            <div
              key={controle.id}
              data-testid="preuve-ligne"
              data-retenu={retenu ? 'oui' : 'non'}
              // opacity-70 : la ligne reste en retrait sans passer sous 4,5:1, modélisé sur les
              // trois directions par tests/unit/configurateur-contraste.test.ts.
              className={`m-cadre m-ligne flex shrink-0 grow flex-col justify-center gap-0.5 ${retenu ? 'm-retenu' : 'opacity-70'}`}
            >
              <div className="flex min-w-0 items-baseline gap-1.5">
                {retenu && <span className="m-barre h-1.5 w-1.5 shrink-0" />}
                <p className="m-corps truncate">{controle.nom}</p>
              </div>

              {retenu && controle.id === 'seo' && (
                <div data-testid="preuve-serp" className="animate-construit flex flex-col">
                  <p className="m-mono m-sourd">votre-nom.fr</p>
                  <p className="m-sous-titre m-accent truncate">{recherche.titre}</p>
                  <p className="m-legende line-clamp-1">{recherche.description}</p>
                </div>
              )}

              {retenu && controle.id === 'seo-local' && (
                <p className="m-legende">Bègles · horaires d’ouverture renseignés</p>
              )}

              {retenu && controle.id === 'perf' && (
                <>
                  {/* Artefact visuel, aucune requête simulée : la mesure vient du texte en dessous. */}
                  <div data-testid="preuve-cascade" className="animate-construit m-cascade flex flex-col gap-0.5">
                    {[100, 65, 40, 20].map((largeur, i) => (
                      <span key={i} className="m-barre h-0.5" style={{ width: `${largeur}%` }} />
                    ))}
                  </div>
                  <p data-testid="preuve-vitesse" className="m-corps m-accent truncate">
                    {vitesse === null
                      ? 'mesure indisponible'
                      : `mesuré sur ce configurateur, pas sur votre futur site : ${vitesse.toFixed(2).replace('.', ',')} s`}
                  </p>
                </>
              )}

              {retenu && controle.id === 'a11y' && ratio !== null && (
                <p data-testid="apercu-a11y" className="m-legende m-accent truncate">
                  mesuré sur ce configurateur, pas sur votre futur site : {ratio.toFixed(2).replace('.', ',')}:1 ·{' '}
                  {ratio >= 4.5 ? 'conforme AA' : 'sous le seuil AA'}
                </p>
              )}

              {retenu && controle.id === 'rgpd' && (
                <p data-testid="preuve-rgpd" className="m-cadre m-legende w-fit px-1">
                  Bannière de consentement aux cookies
                </p>
              )}

              {retenu && controle.id === 'legal' && (
                <p data-testid="preuve-legal" className="m-legende truncate">
                  Pied de page · Mentions légales
                </p>
              )}

              {retenu && controle.id === 'migration' && (
                // Une vraie table : deux colonnes et un code de réponse, pas deux lignes de texte.
                <div data-testid="preuve-redirections" className="m-table font-mono">
                  {[
                    ['/ancien-site/accueil', '/'],
                    ['/ancien-site/contact', '/#contact'],
                  ].map(([avant, apres]) => (
                    <Fragment key={avant}>
                      <span className="m-legende">{avant}</span>
                      <span className="m-legende m-accent">{apres}</span>
                      <span className="m-jeton m-legende justify-self-start px-1">301</span>
                    </Fragment>
                  ))}
                </div>
              )}

              {retenu && controle.id === 'domaine' && (
                <p data-testid="preuve-domaine" className="m-legende truncate">
                  votre-nom.fr · certificat valide
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
})
