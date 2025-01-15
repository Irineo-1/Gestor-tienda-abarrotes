import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/styles/globals.css";

import Header from '@/app/componentes/Header'
import Navbar from '@/app/componentes/Navbar'
import '@/app/styles/punto_venta.css'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gestor Tienda",
  description: "",
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
      >
        <div className="contenedor">
          <div className="header"><Header /></div>
          <div className="navbar"><Navbar /></div>
          <main className="main">{children}</main>
        </div>
      </body>
    </html>
  );
}
