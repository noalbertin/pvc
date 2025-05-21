import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Recherche Opérationnelle (RO) PVC",
  description: "Site officiel du PVC dédié à la Recherche Opérationnelle : optimisation, modélisation mathématique et algorithmique.",
  keywords: [
    "recherche opérationnelle",
    "PVC",
    "optimisation",
    "modélisation mathématique",
    "programmation linéaire",
    "algorithmes"
  ],
  authors: [{ name: "NSA" }],
  creator: "PVC",
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "Recherche Opérationnelle (RO) - PVC",
    description: "Découvre les concepts clés de la recherche opérationnelle avec PVC.",
    url: "https://pvc-ro.vercel.app",
    siteName: "RO PVC",
    locale: "fr_FR",
    type: "website",
    // images: [
    //   {
    //     url: "/ro-pva.png", 
    //     width: 1200,
    //     height: 630,
    //     alt: "Recherche Opérationnelle PVA",
    //   },
    // ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <body  className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
