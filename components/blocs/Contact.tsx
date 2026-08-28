import { Container } from '@/components/ui/Container'
import { Verre } from '@/components/ui/Verre'
import { Formulaire } from '@/components/blocs/Formulaire'
import { LEGAL } from '@/lib/legal'

// Le formulaire est le chemin principal, l'adresse reste écrite en toutes lettres à côté :
// un mailto seul renvoyait chez eux les visiteurs sans client mail configuré, et c'était le
// seul chemin de conversion du site.
export function Contact() {
  return (
    <section id="contact" className="py-20 sm:py-28">
      <Container>
        <Verre epais reflet className="monte px-7 py-10 sm:px-12 sm:py-14">
          <div className="max-w-[40rem]">
            <h2 className="font-display text-[clamp(1.9rem,4.2vw,3rem)] font-extrabold leading-[1.03] tracking-[-0.03em] text-balance">
              Écrivez-moi ce que vous avez sur les bras.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-encre-douce">
              Une adresse de dépôt Git, une URL, ou trois lignes sur la situation. Je vous dis
              franchement si c&rsquo;est pour moi ou non.
            </p>
          </div>

          <div className="mt-12 grid gap-x-14 gap-y-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            <Formulaire />

            <div className="border-t border-encre/10 pt-8 lg:border-l lg:border-t-0 lg:pl-14 lg:pt-0">
              <p className="text-sm text-encre-douce">Ou directement, si vous préférez.</p>
              <a
                href={`mailto:${LEGAL.email}`}
                className="lien-souligne mt-4 inline-block font-display text-lg font-extrabold tracking-[-0.02em]"
              >
                {LEGAL.email}
              </a>
              <p className="mt-4">
                <a
                  href={`tel:${LEGAL.telephoneLien}`}
                  className="chiffres font-display text-lg font-bold tracking-[-0.02em] text-encre transition-opacity duration-300 hover:opacity-70"
                >
                  {LEGAL.telephone}
                </a>
              </p>
            </div>
          </div>
        </Verre>
      </Container>
    </section>
  )
}
