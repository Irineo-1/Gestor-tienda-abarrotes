'use client'

import { useState, Fragment } from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import Navbar from '@/componentes/Navbar'
import { cerrarSesion } from '@/request/Autenticacion'
import { useRouter } from 'next/navigation'
import ModalProductos from './ModalProductos'
import '@/styles/header.css'
import { DialogTitle } from '@mui/material'

export default function Header() {

  const [state, setState] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const router = useRouter()

  const toggleDrawer = (open: boolean) => {
    setState(open);
  }

  const modalValidator = () => {
    setOpenModal(true)
  }

  const cerrar = () => {
    cerrarSesion().then(() => {
      router.push("/")
    })
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            onClick={() => toggleDrawer(true)}
            className='show-movile'
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Tienda
          </Typography>
          <Button color="inherit" onClick={modalValidator}>Cerrar sesion</Button>
        </Toolbar>
      </AppBar>

      <Fragment>
        <SwipeableDrawer
          anchor='bottom'
          open={state}
          onClose={() => toggleDrawer(false)}
          onOpen={() => toggleDrawer(true)}
        >
          <Box
            sx={{ 'auto': 'auto' }}
            className='my-4'
            role="presentation"
            onClick={() => toggleDrawer(false)}
            onKeyDown={() => toggleDrawer(false)}
          >
            <Navbar />
          </Box>
        </SwipeableDrawer>
      </Fragment>

      <ModalProductos open={openModal} setOpen={setOpenModal} textAction='Aceptar' handleAgregar={cerrar} >
        <DialogTitle>¿Desea cerrar sesion?</DialogTitle>
      </ModalProductos>
    </Box>
  );
}