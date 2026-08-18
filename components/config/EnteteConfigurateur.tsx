import { ThemeToggle } from '@/components/shell/ThemeToggle'

export function EnteteConfigurateur() {
  return (
    <header className="flex items-center justify-between px-5 py-4 sm:px-8">
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- ancre volontaire : retour à l’accueil depuis le configurateur. */}
      <a href="/" className="text-sm text-muted-foreground hover:text-foreground">
        Revenir à l’accueil
      </a>
      <ThemeToggle />
    </header>
  )
}
