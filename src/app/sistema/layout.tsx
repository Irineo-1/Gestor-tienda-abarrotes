'use client'

import Header from '@/componentes/Header'
import Navbar from '@/componentes/Navbar'
import '@/styles/punto_venta.css'

export default function dashboardLayout({
    children,
  }: {
    children: React.ReactNode
  }) {

    return (
      <div className="contenedor">
        <header className="header"><Header /></header>
        <nav className="navbar"><Navbar /></nav>
        <main className="main">{children}</main>
      </div>
    )
  }