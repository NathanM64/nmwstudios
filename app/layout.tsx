import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'NMW Studios | Développement Web Moderne',
    template: '%s | NMW Studios',
  },
  description: 'Studio web indépendant spécialisé dans le développement d\'applications web modernes et performantes.',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://nmwstudios.com',
    siteName: 'NMW Studios',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} relative overflow-x-hidden bg-white dark:bg-black antialiased`}
      >
        {/* Animated gradient blobs - fixed background */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute -left-40 top-0 h-96 w-96 animate-blob rounded-full bg-gradient-to-r from-accent-blue/30 to-purple-500/30 opacity-70 blur-3xl dark:opacity-40" />
          <div className="animation-delay-2000 absolute right-0 top-20 h-96 w-96 animate-blob rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 opacity-70 blur-3xl dark:opacity-40" />
          <div className="animation-delay-4000 absolute bottom-20 left-20 h-96 w-96 animate-blob rounded-full bg-gradient-to-r from-accent-blue/30 to-cyan-500/30 opacity-70 blur-3xl dark:opacity-40" />
        </div>

        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
