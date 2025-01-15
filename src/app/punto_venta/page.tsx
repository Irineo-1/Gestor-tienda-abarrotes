'use client'

import Productos from '@/app/componentes/Productos'
import { Provider } from 'react-redux'
import {store} from '../redux/store'

export default function Punto_venta() {
    
    return (
      <Provider store={store}>
        <Productos />
      </Provider>
    );
  }
  