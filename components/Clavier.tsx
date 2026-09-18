'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { dico, indexEcran, langueDuChemin } from '@/content'

// Le menu est le moyen de navigation ; flèches et molette passent à l'écran voisin.
// Le seuil et le délai évitent qu'une inertie de pavé tactile saute deux écrans.
const SEUIL = 120
const DELAI = 700
let dernierSaut = 0

export function Clavier() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const t = dico(langueDuChemin(pathname))
    const i = indexEcran(pathname)
    if (i < 0) return
    const aller = (j: number) => {
      const cible = t.ecrans[j]
      if (!cible || performance.now() - dernierSaut < DELAI) return
      dernierSaut = performance.now()
      router.push(t.routes[cible.cle])
    }

    let cumul = 0
    let dernierPas = 0
    const molette = (ev: WheelEvent) => {
      const cible = ev.target as HTMLElement
      if (cible.closest('.document, textarea')) return
      // Un écran qui a du contenu caché défile en lui même : la molette lui revient.
      const inner = cible.closest('.inner')
      if (inner && inner.scrollHeight > inner.clientHeight + 1) return
      const maintenant = performance.now()
      if (maintenant - dernierPas > 200) cumul = 0
      dernierPas = maintenant
      cumul += ev.deltaY
      if (Math.abs(cumul) < SEUIL) return
      cumul = 0
      aller(i + Math.sign(ev.deltaY))
    }
    const touche = (ev: KeyboardEvent) => {
      if ((ev.target as HTMLElement).closest('input, textarea, select')) return
      if (ev.key === 'ArrowRight' || ev.key === 'PageDown') aller(i + 1)
      if (ev.key === 'ArrowLeft' || ev.key === 'PageUp') aller(i - 1)
    }
    addEventListener('wheel', molette, { passive: true })
    addEventListener('keydown', touche)
    return () => {
      removeEventListener('wheel', molette)
      removeEventListener('keydown', touche)
    }
  }, [pathname, router])

  return null
}
