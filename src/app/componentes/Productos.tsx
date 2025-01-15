'use client'
import { useState, Fragment, useEffect } from 'react';
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
import { IProducto, IProducto_selected } from '@/app/interfaces/Iproducto';
import { setCantidadProductos, setPrecioTotal } from '@/app/redux/Compra';
import { useAppDispatch } from '@/app/redux/hooks';
import { getProductos } from '@/app/request/producto';
import DetallesCompra from '@/app/componentes/DetallesCompra';

export default function Productos() {

  const [productosSelected, setProductosSelected] = useState<IProducto_selected[]>([])
  const [productos, setProductos] = useState<IProducto[]>([])
  const [search, setSearch] = useState<string>('')
  const dispatch = useAppDispatch()

  useEffect(() => {

    getProductos().then((res) => {
      setProductos(res)
    }).catch((err) => {
      console.error(err)
    })

  }, [])

  useEffect(() => {

    dispatch(setPrecioTotal(parseFloat(productosSelected.reduce((acc, item) => {
      let precionFinal = (item.typo == 'gramaje') ? (item.precio * item.gramos) / 1000 : item.precio * item.cantidad
      return (acc + precionFinal)
    }, 0).toFixed(2))))
    
    dispatch(setCantidadProductos(productosSelected.length))
  }, [productosSelected])

  function agregarProducto(producto: IProducto) {
    let porducto_seleccionado : IProducto_selected = {
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1,
      gramos: 0,
      typo: producto.typo
    }

    setSearch('')

    setProductosSelected((productos) => {
      return [...productos, porducto_seleccionado]
    })
  }

  function agregarCantidad(producto: IProducto_selected) {
    setProductosSelected((productos) => {
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

  function quitarCantidad(producto: IProducto_selected) {
    setProductosSelected((productos) => {
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

  function capturarGramos(valor_capturado: string, element: IProducto_selected) {
    
    if(isNaN(parseInt(valor_capturado))) return

    setProductosSelected(productos => {
      return productos.map(producto => {
        if(producto.nombre == element.nombre) {
          return {
            ...producto,
            gramos: parseInt(valor_capturado)
          }
        }
        return producto
      })
    })
  }

  function deleteProduct(nombre: string) {
    setProductosSelected((productos) => {
      return productos.filter(every_item => every_item.nombre !== nombre)
    })
  }

  function escojerTypoCantidad(element: IProducto_selected) {
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
            type='number'
            onChange={e => capturarGramos(e.target.value, element)}
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
    <div className='main-container'>
      <div className='productos-container'>
        <Paper
          component="form"
          className='my-1'
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: "100%" }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar productos"
            inputProps={{ 'aria-label': 'search google maps' }}
          />
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>

        { search.trim() != '' ? 
        
          <div className='resultados-busqueda'>
            {productos.filter((every_item) => every_item.nombre.toLowerCase().includes(search.toLowerCase())).map((every_item, id) => (

              <div key={id} className='producto' onClick={() => agregarProducto(every_item)}>
                <span className='text-lg font-bold mr-4'>{every_item.nombre}</span>
                <span>(Precio: {every_item.precio}) {every_item.typo == 'gramaje' ? 'KG' : ''}</span>
              </div>
            ))}
          </div>

        : null }

        <List sx={{ bgcolor: 'background.paper' }}>
          {(productosSelected.length > 0) ? productosSelected.map((every_item, id) => (
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
      </div>
      <div className='detalles-container'>
        <DetallesCompra productosSelected={productosSelected} setProductosSelected={setProductosSelected} />
      </div>
    </div>
  );
}
