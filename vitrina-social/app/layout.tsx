import type { Metadata, Viewport } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"]
});

const dmSerif = DM_Serif_Display({ 
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400"]
});

export const metadata: Metadata = {
  title: "Vitrina Social | Artesanias con Alma Colombiana",
  description: "Marketplace artesanal que conecta a emprendedores victimas del conflicto con compradores conscientes. Cada compra transforma vidas y construye paz.",
  keywords: ["artesanias colombianas", "impacto social", "emprendimiento", "reconciliacion", "comercio justo"],
};

export const viewport: Viewport = {
  themeColor: "#3d6b4a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${dmSans.variable} ${dmSerif.variable} font-sans`}
      >
        <AuthProvider>
          <Header />
          <main className="min-h-[80vh]">{children}</main>
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
