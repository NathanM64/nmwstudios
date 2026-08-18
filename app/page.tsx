import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { Dock } from '@/components/shell/Dock'
import { ThemeToggle } from '@/components/shell/ThemeToggle'
import { AudienceSwitch } from '@/components/shell/AudienceSwitch'
import { Footer } from '@/components/shell/Footer'
import { rappelAudienceScript } from '@/lib/shell/audience'
import { SECTIONS } from '@/lib/shell/sections'
import { optionParId, SOCLE_ID } from '@/lib/config/catalogue'
import { formaterEuros } from '@/lib/config/devis'

const RAPPEL_ID = 'rappel-agence'
const SOCLE = optionParId(SOCLE_ID)!

export default function Page() {
  return (
    <>
      <Dock />
      <main className="pb-28 sm:pb-0 sm:pt-24">
        <Container className="flex items-center justify-between gap-4">
          <AudienceSwitch current="entreprise" />
          <ThemeToggle />
        </Container>

        <Container>
          <a
            id={RAPPEL_ID}
            hidden
            href="/agences"
            className="mt-4 inline-block text-sm text-muted-foreground underline"
          >
            Revenir à la version agence
          </a>
        </Container>
        <script dangerouslySetInnerHTML={{ __html: rappelAudienceScript(RAPPEL_ID) }} />

        {SECTIONS.map(({ id, label }) => (
          <Section key={id} id={id}>
            <Container>
              <h2 className="font-mono text-xs uppercase tracking-[0.08em] text-accent">{label}</h2>
              {id === 'prix' ? (
                <div className="mt-6">
                  <p className="max-w-prose text-lg">
                    Un site à partir de {formaterEuros(SOCLE.prix)}. Le reste dépend de ce que vous y mettez.
                  </p>
                  <a href="/configurateur"
                     className="mt-6 inline-block rounded-md bg-accent px-5 py-3 text-canvas transition-opacity duration-(--dur-micro) hover:opacity-90">
                    Configurer votre site
                  </a>
                </div>
              ) : (
                <div className="min-h-[70vh]" />
              )}
            </Container>
          </Section>
        ))}
      </main>
      <Footer />
    </>
  )
}
