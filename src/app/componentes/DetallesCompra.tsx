'use client'

import { useAppSelector } from '@/app/redux/hooks'
import { useState } from 'react';
import FormDialog from './FormDialog';
import Button from '@mui/material/Button';
import { setCantidadProductos, setPrecioTotal } from '@/app/redux/Compra';
import { useAppDispatch } from '@/app/redux/hooks';
import { IProducto_selected } from '../interfaces/Iproducto';
import WarningAlert from '@/app/alets/Warning';
import ErrorAlert from '../alets/Error';
import { addVenta } from '../request/Venta';
import { IVenta } from '../interfaces/IVenta';
import SuccsessAlert from '@/app/alets/Success';

type paramProduct = {
  productosSelected: IProducto_selected[]
  setProductosSelected: (value: IProducto_selected[]) => void
}

export default function DetallesCompra({productosSelected, setProductosSelected}: paramProduct) {

  const [isOpenForm, setIsOpenForm] = useState(false)
  const [isOpenWarningAlert, setIsOpenWarningAlert] = useState(false)
  const [isOpenErrorAlert, setIsOpenErrorAlert] = useState(false)
  const [isOpenSuccessAlert, setIsOpenSuccessAlert] = useState(false)

  const cantidadProductos = useAppSelector(state => state.cuenta.cantidadProductos)
  const precioTotal = useAppSelector(state => state.cuenta.precioTotal)
  const dispatch = useAppDispatch()

  const getPago = (pago: number) => {
    const venta: IVenta = {
      productos: productosSelected,
      pago: pago
    }

    addVenta(venta)
    .then(() => {
      setProductosSelected([])
      dispatch(setCantidadProductos(0))
      dispatch(setPrecioTotal(0))
      setIsOpenSuccessAlert(true)
    })
    .catch(() => {
      setIsOpenErrorAlert(true)
    })
  }

  const haveProducts = () => {
    if(productosSelected.length == 0) return setIsOpenWarningAlert(true)
    setIsOpenForm(true)
  }

  return (
      <div className='p-4 mx-1 border border-gray-300 rounded-xl'>
        
        <span className='text-xl w-full block mb-4'>Precio: {precioTotal}</span>
        <span className='text-lg w-full block mb-4'>Cantidad de productos {cantidadProductos}</span>

        <Button variant="contained" color="success" onClick={() => haveProducts()}>
          Pagar
        </Button>

        <FormDialog precioTotal={precioTotal} open={isOpenForm} setOpen={setIsOpenForm} getPago={getPago}/>
        <WarningAlert open={isOpenWarningAlert} mensage='Agregar productos primero' setOpen={setIsOpenWarningAlert}/>
        <ErrorAlert open={isOpenErrorAlert} mensage='No se pudo hacer el cobro, intenta mas tarde' setOpen={setIsOpenErrorAlert}/>
        <SuccsessAlert open={isOpenSuccessAlert} mensage='El pago se ha realizado con éxito' setOpen={setIsOpenSuccessAlert}/>
      </div>
    )
}