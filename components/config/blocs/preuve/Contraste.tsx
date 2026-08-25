'use client'

import { useEffect, useState } from 'react'
import { contrastRatio, parseColor } from '@/lib/color/contrast'

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

export function Contraste() {
  const ratio = useContrasteMesure()
  if (ratio === null) return null

  return (
    <p data-testid="apercu-a11y" className="m-legende m-accent truncate">
      mesuré sur ce configurateur, pas sur votre futur site : {ratio.toFixed(2).replace('.', ',')}:1 ·{' '}
      {ratio >= 4.5 ? 'conforme AA' : 'sous le seuil AA'}
    </p>
  )
}
