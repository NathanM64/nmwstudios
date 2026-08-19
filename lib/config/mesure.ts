/** Vitesse réellement mesurée sur la page en cours. Jamais une valeur en dur :
 *  un chiffre affirmé serait une promesse invérifiable sur le futur site du visiteur. */
export function lireChargement(entrees: PerformanceEntryList): number | null {
  const navigation = entrees[0]
  if (!navigation || navigation.duration <= 0) return null
  return navigation.duration / 1000
}
