import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact - Devis Gratuit Agence Web Bordeaux',
  description: 'Contactez NMW Studios, agence web à Bordeaux. Devis gratuit sous 24h pour votre site vitrine, landing page ou application web.',
  alternates: {
    canonical: 'https://nmwstudios.com/contact',
  },
  openGraph: {
    title: 'Contact - Devis Gratuit | NMW Studios Bordeaux',
    description: 'Contactez NMW Studios, agence web à Bordeaux. Devis gratuit sous 24h pour votre site vitrine, landing page ou application web.',
    url: 'https://nmwstudios.com/contact',
    type: 'website',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
