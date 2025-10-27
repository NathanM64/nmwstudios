import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contactez NMW Studios pour discuter de votre projet web. Devis gratuit et réponse sous 24h.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact | NMW Studios',
    description: 'Contactez NMW Studios pour discuter de votre projet web. Devis gratuit et réponse sous 24h.',
    url: '/contact',
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
