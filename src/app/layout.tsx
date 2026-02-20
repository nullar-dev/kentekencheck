import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const themeColor = [
  { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
];

export const metadata: Metadata = {
  title: "Kentekencheck - RDW Voertuiggegevens",
  description: "Zoek Nederlandse kentekens en bekijk alle voertuiggegevens, APK-historie en meer.",
  keywords: ["kenteken", "RDW", "voertuig", "APK", "auto", "Nederland"],
  authors: [{ name: "Kentekencheck" }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Kentekencheck - RDW Voertuiggegevens",
    description: "Zoek Nederlandse kentekens en bekijk alle voertuiggegevens",
    type: "website",
    locale: "nl_NL",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
