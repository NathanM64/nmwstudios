import type { Metadata } from 'next'

// Next ne fusionne pas openGraph en profondeur : une page qui pose son og:url perd le
// siteName, la locale et le type du layout si elle ne les repose pas ici.
export function og(chemin: string): Metadata['openGraph'] {
  return { type: 'website', locale: 'fr_FR', siteName: 'NMW Studios', url: chemin }
}
