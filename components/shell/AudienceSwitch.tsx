'use client'

import { AUDIENCE_COOKIE, AUDIENCE_MAX_AGE, AUDIENCES, type Audience } from '@/lib/shell/audience'

/** Ancres volontaires : chaque porte est une URL partageable, rendue statiquement. */
export function AudienceSwitch({ current }: { current: Audience }) {
  return (
    <div
      className="panel inline-flex gap-1 p-1"
    >
      {AUDIENCES.map(({ id, label, href }) => (
        <a
          key={id}
          href={href}
          aria-current={current === id ? 'page' : undefined}
          onClick={() => {
            document.cookie = `${AUDIENCE_COOKIE}=${id};path=/;max-age=${AUDIENCE_MAX_AGE};samesite=lax`
          }}
          className="rounded-md px-4 py-1.5 text-sm text-muted-foreground transition-colors duration-(--dur-micro) hover:text-foreground aria-[current]:bg-accent/20 aria-[current]:text-foreground"
        >
          {label}
        </a>
      ))}
    </div>
  )
}
