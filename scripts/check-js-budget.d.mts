/** Déclarations du script de budget, écrit en `.mjs` pour être lancé par `node` sans compilation.
 *  Sans elles, inclure `tests/` dans le projet TypeScript rendrait son import implicitement `any`,
 *  et c'est pour éviter ces quatre erreurs que tout le dossier `tests/` était exclu du tsconfig. */
export function readFirstLoadBytes(htmlPath: string, staticRoot: string): number

export function listerRoutesPrerendues(appDir: string): { route: string; htmlPath: string }[]
