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
        <div className="header"><Header /></div>
        <div className="navbar"><Navbar /></div>
        <div className="main">{children}</div>
      </div>
    )
  }