# NMW Studios — site vitrine

Refonte en cours. Spec : `docs/superpowers/specs/2026-08-17-refonte-vitrine-design.md`

## Commentaires

Une ligne, deux au maximum. Le fait, pas l'histoire.

On commente ce qui n'est pas déductible du code : un piège, une contrainte
externe, une raison de ne pas « simplifier ». Jamais de bloc narratif, jamais
de paraphrase du code, jamais l'historique d'un bug. Un commentaire qui décrit
ce que fait la ligne suivante se supprime.

## Contraintes du projet

- yarn uniquement — aucun `package-lock.json`.
- Aucune librairie d'animation : CSS natif (`animation-timeline`, `@view-transition`).
- JavaScript de première charge sur `/` : < 30 ko gzip (`yarn budget`).
- Contraste ≥ 4,5:1 dans les deux thèmes, vérifié par test.
- Le rayon de `blur()` ne s'anime jamais ; seuls `opacity` et `transform`.
- Aucun texte long sur une surface de verre.
- Aucun chiffre affiché qui ne soit mesuré. Aucun client, avis ou référence inventé.
- Messages de commit en français, sans `Co-Authored-By`.
