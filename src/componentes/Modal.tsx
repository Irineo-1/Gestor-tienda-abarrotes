import { Fragment, ReactNode, useRef } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

type props = {
    open: boolean
    setOpen: (open: boolean) => void
    handleConfirmar?: () => void
    handleCloseEmit?: () => void
    children: ReactNode
    titulo: string
    textoBotonConfirmar?: string
    persistent?: boolean
}

export default function Modal({open, setOpen, children, titulo, textoBotonConfirmar, handleConfirmar, handleCloseEmit, persistent}: props) {

  const handleClose = () => {
    setOpen(false)
    handleCloseEmit?.()
  }

  return (
    <Fragment>
      <Dialog
        fullWidth={true}
        maxWidth='sm'
        open={open}
        onClose={persistent ? undefined : handleClose}
        disableEscapeKeyDown={persistent}
        aria-labelledby={titulo}
        aria-describedby={titulo}
      >
        <DialogTitle>
          {titulo}
        </DialogTitle>
        <DialogContent>
          {children}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cerrar</Button>
          {textoBotonConfirmar != undefined &&
            <Button onClick={handleConfirmar}>
              {textoBotonConfirmar}
            </Button>
          }
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}