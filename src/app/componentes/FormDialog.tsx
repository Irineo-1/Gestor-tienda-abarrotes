'use client'
import { useState, Fragment, ChangeEvent } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ErrorAlert from '@/app/alets/Error';

type FormDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  precioTotal: number
  getPago: (pago: number) => void
}

export default function FormDialog({open, setOpen, precioTotal, getPago} : FormDialogProps) {

  const [pago, setPago] = useState(0);
  const [cambio, setCambio] = useState(0);
  const [isOpenErrorAlert, setIsOpenErrorAlert] = useState(false)
  
  const handleClose = () => {
    setOpen(false);
  }

  const handlePago = () => {

    if(pago < precioTotal) return setIsOpenErrorAlert(true)
    getPago(pago)
    setPago(0)
    handleClose()
  }

  const calcularCambio = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPago(parseInt(e.target.value))

    if(e.target.value.trim() == '') return setCambio(0)
    if(parseInt(e.target.value) < precioTotal) return setCambio(0)

    setCambio(parseInt(e.target.value) - precioTotal)
  }

  return (
    <Fragment>
      <Dialog
        fullWidth={true}
        maxWidth='sm'
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Total a pagar: <strong>{precioTotal}</strong></DialogTitle>
        <DialogContent>

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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handlePago}>Pagar</Button>
        </DialogActions>
      </Dialog>

      <ErrorAlert open={isOpenErrorAlert} mensage='El pago no puede ser menor al precio total' setOpen={setIsOpenErrorAlert}/>
    </Fragment>
  );
}