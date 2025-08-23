import type { Metadata } from "next";
import { Poppins, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from './providers';
import Navbar from '@/components/Navbar';
import FloatingActionButton from '@/components/FloatingActionButton';

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins'
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space'
});

export const metadata: Metadata = {
  title: "PropChain - Decentralized Real Estate Platform",
  description: "Fractional ownership of real estate on Avalanche blockchain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${spaceGrotesk.variable}`}>
      <body className={poppins.className}>
        <Providers>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
            <FloatingActionButton />
          </div>
        </Providers>
      </body>
    </html>
  );
}
