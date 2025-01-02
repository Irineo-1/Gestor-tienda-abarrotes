'use client'

import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import '@/app/styles/header.css'
import Navbar from '@/app/componentes/Navbar'

export default function Header() {

  const [state, setState] = React.useState(false)

  const toggleDrawer = (open: boolean) => {
    setState(open);
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
          <Button color="inherit">Cerrar sesion</Button>
        </Toolbar>
      </AppBar>

      <React.Fragment>
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
      </React.Fragment>
    </Box>
  );
}