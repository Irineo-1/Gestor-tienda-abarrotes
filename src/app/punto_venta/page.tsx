'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Header from '../componentes/Header'
import Productos from '../componentes/Productos'
import Navbar from '../componentes/Navbar'
import '@/app/styles/punto_venta.css'
import { Producto } from '@/app/interfaces/producto'

export default function Punto_venta() {

    const router = useRouter()

    let productos: Producto[] = [
      {"nombre": "algo", "cantidad": 1, "gramos": 0, "typo": "contable"}, 
      {"nombre": "algo2", "cantidad": 1, "gramos": 0, "typo": "contable"}, 
      {"nombre": "algo3", "cantidad": 0, "gramos": 200, "typo": "gramaje"}]
    
    
    return (
      <>
        <div className="contenedor">
            <div className="header"><Header /></div>
            <div className="navbar"><Navbar /></div>
            <div className="main"><Productos productosProps={productos}/></div>
            <aside className="sidebar">sideBar</aside>
        </div>
      </>
    );
  }
  