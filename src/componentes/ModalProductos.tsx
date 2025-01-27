import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';

interface MyComponentProps {
  open: boolean
  setOpen: (Open: boolean) => void
  children: React.ReactNode
  handleAgregar: () => void
  textAction: string
}

export default function ModalProductos({open, setOpen, children, handleAgregar, textAction}: MyComponentProps) {

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
      >

        {children}
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="button" onClick={() => handleAgregar()}>{textAction}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}