'use client'

import { useEffect, useState } from 'react'
import { SECTIONS } from '@/lib/shell/sections'

export function Dock() {
  const [active, setActive] = useState<string>(SECTIONS[0].id)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-30% 0px -50% 0px', threshold: [0, 0.25, 0.5, 1] }
    )

    for (const { id } of SECTIONS) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [])

  return (
    <nav
      aria-label="Sections de la page"
      className="panel fixed inset-x-0 bottom-4 z-50 mx-auto flex w-max gap-1 p-1.5 sm:inset-x-auto sm:bottom-auto sm:top-4 sm:left-1/2 sm:-translate-x-1/2"
    >
      {SECTIONS.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          aria-current={active === id ? 'true' : undefined}
          className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors duration-(--dur-micro) hover:text-foreground aria-[current]:bg-accent/20 aria-[current]:text-foreground"
        >
          {label}
        </a>
      ))}
    </nav>
  )
}
