/** Plus grande bande sans contenu peint, en part de la hauteur du cadre.
 *
 *  Ne compte que ce qu'un lecteur voit : un élément qui porte du texte en propre, ou un
 *  aplat d'image. Compter tous les nœuds rendrait la mesure aveugle, une racine pleine
 *  hauteur couvrant alors le cadre entier et ramenant tout écart à zéro. Version vérifiée
 *  le 19/08/2026 : la variante par « tous les nœuds » laissait passer 500 px de vide. */
export function pireBandeVide(cadre: Element): number {
  const rect = cadre.getBoundingClientRect()
  const peints = [...cadre.querySelectorAll('*')]
    .filter((n) => {
      const texte = [...n.childNodes].some((c) => c.nodeType === 3 && c.textContent!.trim().length > 0)
      return texte || getComputedStyle(n).backgroundImage !== 'none'
    })
    .map((n) => n.getBoundingClientRect())
    .filter((r) => r.height > 2 && r.width > 2)
    .sort((a, b) => a.top - b.top)

  if (peints.length === 0) return 1

  let pire = peints[0].top - rect.top
  let bas = peints[0].bottom
  for (const boite of peints) {
    if (boite.top - bas > pire) pire = boite.top - bas
    if (boite.bottom > bas) bas = boite.bottom
  }
  if (rect.bottom - bas > pire) pire = rect.bottom - bas
  return pire / rect.height
}
