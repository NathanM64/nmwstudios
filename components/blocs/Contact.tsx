import { Container } from '@/components/ui/Container'
import { Verre } from '@/components/ui/Verre'
import { LEGAL, RENDEZ_VOUS } from '@/lib/legal'

// L'email est le chemin principal et assumé comme tel : il est écrit en toutes lettres,
// à la taille d'un titre, plutôt que caché derrière un libellé.
export function Contact() {
  return (
    <section id="contact" className="py-20 sm:py-28">
      <Container>
        <Verre epais reflet className="monte px-7 py-10 sm:px-12 sm:py-14">
          <div className="grid gap-x-14 gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:items-end">
            <div>
              <h2 className="max-w-[18ch] font-display text-[clamp(1.9rem,4.2vw,3rem)] font-extrabold leading-[1.03] tracking-[-0.03em] text-balance">
                Écrivez-moi ce que vous avez sur les bras.
              </h2>
              <p className="mt-6 max-w-[40rem] text-lg leading-relaxed text-encre-douce">
                Une adresse de dépôt Git, une URL, ou trois lignes sur la situation. Je vous dis
                franchement si c&rsquo;est pour moi ou non.
              </p>
              <a
                href={`mailto:${LEGAL.email}`}
                className="lien-souligne mt-9 inline-block font-display text-[clamp(1.35rem,3.4vw,2.1rem)] font-extrabold tracking-[-0.03em]"
              >
                {LEGAL.email}
              </a>
            </div>

            <div className="text-sm leading-relaxed text-encre-douce">
              <a
                href={`tel:${LEGAL.telephoneLien}`}
                className="chiffres font-display text-lg font-bold tracking-[-0.02em] text-encre transition-opacity duration-300 hover:opacity-70"
              >
                {LEGAL.telephone}
              </a>
              {RENDEZ_VOUS ? (
                <p className="mt-4">
                  <a href={RENDEZ_VOUS} target="_blank" rel="noreferrer" className="lien-souligne">
                    Réserver un créneau
                  </a>
                  , dans un autre onglet.
                </p>
              ) : null}
              <p className="mt-5">
                Pas de formulaire : il faudrait un service tiers, donc un script et un cookie.
              </p>
            </div>
          </div>
        </Verre>
      </Container>
    </section>
  )
}
