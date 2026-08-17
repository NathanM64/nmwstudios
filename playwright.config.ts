import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  reporter: 'list',
  // Port dédié : le 3000 est souvent pris par un autre projet, et un serveur
  // étranger réutilisé ferait passer les tests sur la mauvaise application.
  use: { baseURL: 'http://127.0.0.1:3100', colorScheme: 'dark', trace: 'on-first-retry' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'yarn build && yarn start --port 3100',
    url: 'http://127.0.0.1:3100',
    reuseExistingServer: false,
    timeout: 180_000,
  },
})
