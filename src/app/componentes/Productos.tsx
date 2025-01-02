'use client'
import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import { Producto } from '@/app/interfaces/producto'

interface ProductosProps {
  productosProps: Producto[]
}

export default function Productos({productosProps}: ProductosProps) {

  let [productos, setProductos] = React.useState<Producto[]>(productosProps)

  function agregarCantidad(producto: Producto) {
    setProductos((productos) => {
      return productos.map((every_item) => {
        if(every_item.nombre === producto.nombre) {
          return {
            ...every_item, 
            cantidad: every_item.cantidad + 1}
        }
        return every_item
      })
    })
  }

  function quitarCantidad(producto: Producto) {
    setProductos((productos) => {
      return productos.map(every_item => {
        if(every_item.nombre === producto.nombre && every_item.cantidad > 1) {
          return {
            ...every_item,
            cantidad: every_item.cantidad - 1
          }
        }
        return every_item
      })
    })
  }

  function deleteProduct(nombre: string) {
    setProductos((productos) => {
      return productos.filter(every_item => every_item.nombre !== nombre)
    })
  }

  function escojerTypoCantidad(element: Producto) {
    if(element.typo === "contable") {
      return (
        <React.Fragment>
          <IconButton aria-label="quitar" onClick={() => quitarCantidad(element)}>
            <RemoveIcon />
          </IconButton>
          <span>{element.cantidad}</span>
          <IconButton aria-label="agregar" onClick={() => agregarCantidad(element)}>
            <AddIcon />
          </IconButton>
        </React.Fragment>
      )
    }
    else if(element.typo === "gramaje") {
      return(
        <FormControl variant="standard" sx={{ m: 1, mt: 3, width: '12ch' }}>
          <Input
            id="standard-adornment-weight"
            endAdornment={<InputAdornment position="end">Gm</InputAdornment>}
            aria-describedby="standard-weight-helper-text"
            inputProps={{
              'aria-label': 'Peso',
            }}
          />
          <FormHelperText id="standard-weight-helper-text">Peso</FormHelperText>
        </FormControl>
      )
    }
  }

  return (
    <List sx={{ bgcolor: 'background.paper' }}>
      {(productos.length > 0) ? productos.map((every_item, id) => (
        <ListItem
          key={id}
          disableGutters
          secondaryAction={
            <IconButton aria-label="delete" onClick={() => deleteProduct(every_item.nombre)}>
              <DeleteIcon />
            </IconButton>
          }
        >
          <ListItemText primary={`Line item ${every_item.nombre}`} />

          {escojerTypoCantidad(every_item)}

        </ListItem>
      )) : []}
    </List>
  );
}
