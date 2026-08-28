// One list serves the header and the footer: below 768px the bar can no longer hold three
// links, so the footer carries the navigation. Two lists would drift apart the first time a
// page is added.
export const NAV = [
  { href: '/renfort/', label: 'Renfort ponctuel' },
  { href: '/projet-complet/', label: 'Projet complet' },
  { href: '/reprise-et-maintenance/', label: 'Reprise et maintenance' },
] as const
