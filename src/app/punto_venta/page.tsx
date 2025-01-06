'use client'

import { useRouter } from 'next/navigation'
import Header from '@/app/componentes/Header'
import Productos from '@/app/componentes/Productos'
import Navbar from '@/app/componentes/Navbar'
import DetallesCompra from '@/app/componentes/DetallesCompra'
import { Provider } from 'react-redux'
import {store} from '../redux/store'
import '@/app/styles/punto_venta.css'

export default function Punto_venta() {

    const router = useRouter()
    
    return (
      <Provider store={store}>
        <div className="contenedor">
          <div className="header"><Header /></div>
          <div className="navbar"><Navbar /></div>
          <div className="main"><Productos /></div>
          <div className="sidebar"><DetallesCompra /></div>
        </div>
      </Provider>
    );
  }
  