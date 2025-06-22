'use client'

import { useAppSelector } from '@/redux/hooks'
import { useState, ChangeEvent } from 'react';
import Modal from './Modal';
import Button from '@mui/material/Button';
import { setCantidadProductos, setPrecioTotal } from '@/redux/Compra';
import { useAppDispatch } from '@/redux/hooks';
import { IProducto_selected } from '../interfaces/Iproducto';
import WarningAlert from '@/alets/Warning';
import ErrorAlert from '../alets/Error';
import { addVenta } from '../request/Venta';
import { ICurrent_venta } from '../interfaces/IVenta';
import SuccsessAlert from '@/alets/Success';
import TextField from '@mui/material/TextField';


type paramProduct = {
  productosSelected: IProducto_selected[]
  setProductosSelected: (value: IProducto_selected[]) => void
  realizarPago: (pago: number) => Promise<void>
}

export default function DetallesCompra({productosSelected, setProductosSelected, realizarPago}: paramProduct) {

  const [isOpenForm, setIsOpenForm] = useState(false)
  const [isOpenWarningAlert, setIsOpenWarningAlert] = useState(false)
  const [isOpenErrorAlert, setIsOpenErrorAlert] = useState(false)
  const [isOpenSuccessAlert, setIsOpenSuccessAlert] = useState(false)

  const [mesajeError, setMensajeError] = useState("No se pudo hacer el cobro, intenta mas tarde")

  const [pago, setPago] = useState(0);
  const [cambio, setCambio] = useState(0);

  const cantidadProductos = useAppSelector(state => state.cuenta.cantidadProductos)
  const precioTotal = useAppSelector(state => state.cuenta.precioTotal)
  const dispatch = useAppDispatch()

  const handlePago = async () => {

    if(pago < precioTotal) return setIsOpenErrorAlert(true)

    realizarPago(pago).then(() => {
      dispatch(setCantidadProductos(0))
      dispatch(setPrecioTotal(0))
      setIsOpenSuccessAlert(true)
    })
    .catch((error) => {
      setMensajeError(error)
      setIsOpenErrorAlert(true)
    })

    setPago(0)
    setCambio(0)
    setIsOpenForm(false)
  }

  const calcularCambio = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPago(parseInt(e.target.value))

    if(e.target.value.trim() == '') return setCambio(0)
    if(parseInt(e.target.value) < precioTotal) return setCambio(0)

    setCambio(parseInt(e.target.value) - precioTotal)
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

        <Modal open={isOpenForm} setOpen={setIsOpenForm} titulo={`Total a pagar: ${precioTotal}`} textoBotonConfirmar='Pagar' handleConfirmar={handlePago}>

            <span className='mb-4 block'>Cambio a dar: <strong>{cambio}</strong></span>

            <TextField
              autoFocus
              required
              margin="dense"
              id="pago"
              name="pago"
              label="Pago con: "
              type="number"
              value={pago}
              onChange={(e) => calcularCambio(e)}
              fullWidth
              variant="standard"
            />

        </Modal>

        <WarningAlert open={isOpenWarningAlert} mensage='Agregar productos primero' setOpen={setIsOpenWarningAlert}/>
        <ErrorAlert open={isOpenErrorAlert} mensage={mesajeError} setOpen={setIsOpenErrorAlert}/>
        <SuccsessAlert open={isOpenSuccessAlert} mensage='El pago se ha realizado con éxito' setOpen={setIsOpenSuccessAlert}/>
      </div>
    )
}