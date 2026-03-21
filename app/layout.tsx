import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  title: "MyTwenties — Find out what you're actually built for",
  description: "A 20-minute deep assessment that tells you who you are, what you're built for, and what to do next. No fluff.",
  metadataBase: new URL('https://www.mytwenties.app'),
  openGraph: {
    title: "MyTwenties — Find out what you're actually built for",
    description: "A 20-minute deep assessment that tells you who you are, what you're built for, and what to do next. No fluff.",
    url: 'https://www.mytwenties.app',
    siteName: 'MyTwenties',
    type: 'website',
    locale: 'en_AU',
  },
  twitter: {
    card: 'summary_large_image',
    title: "MyTwenties — Find out what you're actually built for",
    description: "A 20-minute deep assessment that tells you who you are, what you're built for, and what to do next.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ backgroundColor: 'var(--brand-bg)', color: 'var(--brand-text)', minHeight: '100vh' }}
      >
        {children}
      </body>
    </html>
  );
}
