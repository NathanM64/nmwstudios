import type { Metadata } from 'next'

// Next does not deep merge openGraph: a page that sets its own og:url loses the siteName,
// locale and type from the layout unless it restates them here.
export function og(path: string): Metadata['openGraph'] {
  return { type: 'website', locale: 'fr_FR', siteName: 'NMW Studios', url: path }
}
