import { defineConfig } from '@playwright/test'

// Les filets tournent contre le site exporté, pas contre le serveur de développement :
// c'est le HTML réellement mis en ligne qu'on vérifie.
export default defineConfig({
  testDir: './tests/e2e',
  use: { baseURL: 'http://127.0.0.1:4321' },
  webServer: {
    command: 'yarn serve',
    url: 'http://127.0.0.1:4321',
    // Jamais de réutilisation : un autre projet qui écoutait sur le port a déjà fait passer
    // les filets contre le mauvais site, sans qu'aucun ne le signale.
    reuseExistingServer: false,
    timeout: 60_000,
  },
})
