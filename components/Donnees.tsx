// Un bloc JSON-LD dans la page, sans rien d'autre.
export function Donnees({ objet }: { objet: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(objet) }} />
}
