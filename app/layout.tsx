import "./globals.css";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "TheQuuk — Turning cities into living memories.",
  description: "Şehri canlı bir duygu haritasına dönüştüren sosyal şehir-anı platformu.",
};

export const viewport: Viewport = {
  themeColor: "#06030F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-ink-900 text-violet-100 antialiased">
        <main className="relative w-full min-h-screen bg-ink-900">
          {children}
        </main>
      </body>
    </html>
  );
}
