import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_SITE_NAME || 'AURA PARFUMS'} | Haute Parfumerie & Fragrances d'Exception`,
  description: "Découvrez notre collection exclusive de parfums de luxe. Eaux de parfum d'exception, commande facile et livraison rapide.",
  openGraph: {
    title: 'AURA PARFUMS | Parfumerie de Luxe',
    description: 'Boutique en ligne spécialisée dans la haute parfumerie.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-[#faf9f6] text-stone-900 font-sans antialiased selection:bg-amber-100 selection:text-amber-900 min-h-screen flex flex-col justify-between">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
