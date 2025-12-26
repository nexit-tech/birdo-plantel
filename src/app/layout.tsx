import type { Metadata } from "next";
import { Inter, Lexend } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/layout/BottomNav/BottomNav";
import { UIProvider } from "@/contexts/UIContext";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${lexend.variable}`}>
        <UIProvider>
          {children}
          <BottomNav />
        </UIProvider>
      </body>
    </html>
  );
}