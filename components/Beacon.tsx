'use client'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

// One ping per page, sent by the browser itself. Most robots run no JavaScript and never
// count, but search engines that render pages in Chrome can. sendBeacon fires without
// blocking and survives the page being left; usePathname fires it again on each navigation.
export function Beacon() {
  const pathname = usePathname()
  useEffect(() => {
    try {
      const body = JSON.stringify({ p: pathname, r: document.referrer })
      navigator.sendBeacon('/api/beacon', body)
    } catch {
      // An old browser or a blocked beacon: this visit goes uncounted, nothing breaks.
    }
  }, [pathname])
  return null
}
