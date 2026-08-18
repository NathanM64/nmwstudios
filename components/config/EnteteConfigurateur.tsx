import { ThemeToggle } from '@/components/shell/ThemeToggle'

export function EnteteConfigurateur() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between bg-canvas/80 px-5 py-4 backdrop-blur-sm sm:px-8">
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- ancre volontaire : retour à l’accueil depuis le configurateur. */}
      <a href="/" className="text-sm text-muted-foreground hover:text-foreground">
        Revenir à l’accueil
      </a>
      <ThemeToggle />
    </header>
  )
}
