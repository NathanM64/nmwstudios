import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  // Motifs récursifs : les worktrees vivent sous `.claude/`, dans le dépôt,
  // et leurs sorties de build seraient sinon analysées.
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/out/**',
      '**/test-results/**',
      '**/playwright-report/**',
      '.claude/**',
    ],
  },
]

export default eslintConfig
