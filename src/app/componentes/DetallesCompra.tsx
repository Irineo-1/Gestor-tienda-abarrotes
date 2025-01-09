'use client'

import { useAppSelector } from '@/app/redux/hooks'
import { useState } from 'react';
import FormDialog from './FormDialog';
import Button from '@mui/material/Button';

export default function DetallesCompra() {

  const [isOpenForm, setIsOpenForm] = useState(false)

  const cantidadProductos = useAppSelector(state => state.cuenta.cantidadProductos)
  const precioTotal = useAppSelector(state => state.cuenta.precioTotal)

  const getPago = (pago: number) => {
    console.log(pago)
  }

  return (
      <div className='p-4 mx-1 border border-gray-300 rounded-xl'>
        
        <span className='text-xl w-full block mb-4'>Precio: {precioTotal}</span>
        <span className='text-lg w-full block mb-4'>Cantidad de productos {cantidadProductos}</span>

        <Button variant="contained" color="success" onClick={() => setIsOpenForm(true)}>
          Pagar
        </Button>

        <FormDialog precioTotal={precioTotal} open={isOpenForm} setOpen={setIsOpenForm} getPago={getPago}/>
      </div>
    )
}