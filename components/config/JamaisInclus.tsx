const EXCLUS = [
  'La photographie et la prise de vue',
  'La création de logo et d’identité visuelle',
  'Les visuels sous licence payante, refacturés au coût réel',
  'Le contenu inventé : les textes reposent sur ce que vous me dites',
  'Tout ce qui sort du périmètre configuré, qui fait l’objet d’un avenant',
]

export function JamaisInclus() {
  return (
    <section data-testid="jamais-inclus" className="mt-12">
      <h2 className="font-mono text-xs uppercase tracking-[0.08em] text-accent">
        Ce qui n’est jamais inclus
      </h2>
      <ul className="mt-3 flex flex-col gap-1 text-sm text-muted-foreground">
        {EXCLUS.map((ligne) => (
          <li key={ligne}>{ligne}</li>
        ))}
      </ul>
    </section>
  )
}
