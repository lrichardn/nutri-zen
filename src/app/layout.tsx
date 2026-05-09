import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import ConditionalShell from "@/components/layout/ConditionalShell";
import SessionProvider from "@/components/layout/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nutri'Zen — Nutrition & Rééquilibrage alimentaire",
  description: "Conseils en nutrition et rééquilibrage alimentaire pour une alimentation équilibrée et personnalisée.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SessionProvider>
          <ConditionalShell>{children}</ConditionalShell>
        </SessionProvider>
      </body>
    </html>
  );
}
