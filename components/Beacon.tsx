'use client'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

// One ping per page, sent by the browser itself. A robot runs no JavaScript, so it
// never counts. sendBeacon fires without blocking and survives the page being left;
// usePathname makes it fire again on each client-side navigation.
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
