import { chromium } from 'playwright';

const demos = [
  {
    name: 'nexus-ai',
    url: 'https://nexus-ai.nmwstudios.com',
    title: 'Nexus AI'
  },
  {
    name: 'atelier-bois',
    url: 'https://atelier-bois.nmwstudios.com',
    title: 'Atelier Bois'
  },
  {
    name: 'taskflow',
    url: 'https://taskflow.nmwstudios.com',
    title: 'TaskFlow'
  }
];

async function captureScreenshots() {
  console.log('🚀 Lancement du navigateur...');
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  for (const demo of demos) {
    console.log(`📸 Capture de ${demo.title}...`);
    const page = await context.newPage();

    try {
      await page.goto(demo.url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(2000); // Attendre que les animations se chargent

      // Screenshot desktop
      await page.screenshot({
        path: `public/projects/${demo.name}-desktop.png`,
        fullPage: false
      });
      console.log(`✅ Desktop screenshot sauvegardé: ${demo.name}-desktop.png`);

      // Screenshot mobile
      await page.setViewportSize({ width: 375, height: 812 });
      await page.waitForTimeout(1000);
      await page.screenshot({
        path: `public/projects/${demo.name}-mobile.png`,
        fullPage: false
      });
      console.log(`✅ Mobile screenshot sauvegardé: ${demo.name}-mobile.png`);

    } catch (error) {
      console.error(`❌ Erreur lors de la capture de ${demo.title}:`, error.message);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log('✨ Toutes les captures sont terminées !');
}

captureScreenshots().catch(console.error);
