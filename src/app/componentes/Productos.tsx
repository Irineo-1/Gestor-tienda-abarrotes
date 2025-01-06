'use client'
import { useState, Fragment } from 'react';
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
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { Producto } from '@/app/interfaces/producto';
import { setCantidadProductos, setPrecioTotal } from '@/app/redux/Compra';
import { useAppDispatch } from '@/app/redux/hooks';

export default function Productos() {

  let [productos, setProductos] = useState<Producto[]>([{cantidad: 1, nombre: "Producto 1", typo: "contable", gramos: 0, precio: 50}, {cantidad: 1, nombre: "Producto 2", typo: "gramaje", gramos: 200, precio: 100}])
  const dispatch = useAppDispatch()

  dispatch(setCantidadProductos(productos.length))
  dispatch(setPrecioTotal(productos.reduce((acc, every_item) => acc + every_item.precio * every_item.cantidad, 0)))

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

    dispatch(setPrecioTotal(productos.reduce((acc, every_item) => acc + every_item.precio * every_item.cantidad, 0)))
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

    dispatch(setPrecioTotal(productos.reduce((acc, every_item) => acc + every_item.precio * every_item.cantidad, 0)))
  }

  function deleteProduct(nombre: string) {
    setProductos((productos) => {
      return productos.filter(every_item => every_item.nombre !== nombre)
    })

    dispatch(setCantidadProductos(productos.length))
  }

  function escojerTypoCantidad(element: Producto) {
    if(element.typo === "contable") {
      return (
        <Fragment>
          <IconButton aria-label="quitar" onClick={() => quitarCantidad(element)}>
            <RemoveIcon />
          </IconButton>
          <span>{element.cantidad}</span>
          <IconButton aria-label="agregar" onClick={() => agregarCantidad(element)}>
            <AddIcon />
          </IconButton>
        </Fragment>
      )
    }
    else if(element.typo === "gramaje") {
      return(
        <FormControl variant="standard" sx={{ m: 1, mt: 3, width: '12ch' }}>
          <Input
            id="standard-adornment-weight"
            value={element.gramos}
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

    <>
      <Paper
        component="form"
        className='my-1'
        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: "100%" }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Buscar productos"
          inputProps={{ 'aria-label': 'search google maps' }}
        />
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>

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
            <ListItemText primary={`${every_item.nombre}  (${every_item.precio})`} />

            {escojerTypoCantidad(every_item)}

          </ListItem>
        )) : []}
      </List>

    </>
  );
}
