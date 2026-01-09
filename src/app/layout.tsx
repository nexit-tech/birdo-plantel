import type { Metadata, Viewport } from "next";
import { Inter, Lexend } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/layout/BottomNav/BottomNav";
import { UIProvider } from "@/contexts/UIContext";
import clsx from "clsx";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-body",
  display: "swap" 
});

const lexend = Lexend({ 
  subsets: ["latin"], 
  variable: "--font-heading",
  display: "swap" 
});

export const metadata: Metadata = {
  title: "Birdo",
  description: "Gerenciador de Plantéis Inteligente",
  icons: {
    icon: '/birdo.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#FFFFFF',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={clsx(inter.variable, lexend.variable)}>
        <UIProvider>
          {children}
          <BottomNav />
        </UIProvider>
      </body>
    </html>
  );
}