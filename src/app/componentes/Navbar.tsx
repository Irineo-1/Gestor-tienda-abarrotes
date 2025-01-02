'use client'
import Link from 'next/link'
import '@/app/styles/navbar.css'

export default function Navbar() {
    return (
        <>
        
            <nav className="flex items-center h-full w-full border-r-2 border-gray-300">
                <ul className="w-full">
                    <li className='every-item'><Link href="/punto_venta">Caja</Link></li>
                    <li className='every-item'><Link href="/ventas">Ventas</Link></li>
                    <li className='every-item'><Link href="/inventario">Inventario</Link></li>
                    <li className='every-item'><Link href="/gestor_usuario">Gestion de usuarios</Link></li>
                </ul>
            </nav>
        
        </>
    );
}