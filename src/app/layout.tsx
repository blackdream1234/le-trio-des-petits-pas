import type { Metadata } from "next";
import { Inter, Outfit, Calistoga } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-primary",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-secondary",
  subsets: ["latin"],
  display: "swap",
});

const calistoga = Calistoga({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Le Trio des Petits Pas",
  description: "Ensemble pour le handicap - Association créée par des mamans pour soutenir les enfants atteints de paralysie cérébrale.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${outfit.variable} ${calistoga.variable}`}>
      <body className="antialiased flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-24">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
