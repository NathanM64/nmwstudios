// L'ordre est celui du menu, et celui que suivent les flèches.
export const ECRANS = [
  { href: '/', titre: 'Accueil' },
  { href: '/ce-que-je-fais', titre: 'Ce que je fais' },
  { href: '/comment-je-travaille', titre: 'Comment je travaille' },
  { href: '/qui-je-suis', titre: 'Qui je suis' },
  { href: '/contact', titre: 'Contact' },
] as const

// usePathname garde parfois la barre finale de trailingSlash : on compare sans elle.
export function indexEcran(pathname: string): number {
  const chemin = pathname.replace(/\/+$/, '') || '/'
  return ECRANS.findIndex((e) => (e.href === '/' ? chemin === '/' : chemin.startsWith(e.href)))
}
