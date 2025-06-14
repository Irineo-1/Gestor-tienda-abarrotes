'use client'

import { useState, Fragment, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import QrCodeScanner from '@mui/icons-material/QrCodeScanner';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import { IProducto, IProducto_selected } from '@/interfaces/Iproducto';
import { setCantidadProductos, setPrecioTotal } from '@/redux/Compra';
import { useAppDispatch } from '@/redux/hooks';
import { getProductos } from '@/request/producto';
import DetallesCompra from '@/componentes/DetallesCompra';
import LectorBarras from '@/componentes/LectorBarras';
import { useAtom } from 'jotai';
import { unidadMedidaAtom } from '@/atom/unidadMedidaAtom';
import { DialogContent, DialogTitle, FormHelperText, Input, InputAdornment, InputLabel, TextField } from '@mui/material';
import { GramosToKilos, kilosToGramos } from '@/utils/convercion';
import { ICurrent_venta } from '@/interfaces/IVenta';
import { addVenta } from '@/request/Venta'; 
import { TIPO_PRODUCTO } from '@/interfaces/Iproducto';
import ModalProductos from '@/componentes/ModalProductos';

export default function Punto_venta() {
  
  const [unidadMedida] = useAtom(unidadMedidaAtom)

  const [openModalGenericProduct, setOpenModalGenericProduct] = useState(false)
  const [productoGenerico, setProductoGenerico] = useState<IProducto_selected>({} as IProducto_selected)

  const [productosSelected, setProductosSelected] = useState<IProducto_selected[]>([])
  const [productos, setProductos] = useState<IProducto[]>([])
  const [search, setSearch] = useState<string>('')
  const [isOpenModalLector, setIsOpenModalLector] = useState(false)
  const dispatch = useAppDispatch()

  useEffect(() => {

    setProductosSelected(JSON.parse(localStorage.getItem("productos_seleccionados") || ""))

    getProductos().then((res) => {
      setProductos(res)
    }).catch((err) => {
      console.error(err)
    })

  }, [])

  useEffect(() => {

    dispatch(setPrecioTotal(parseFloat(productosSelected.reduce((acc, item) => {
      let precionFinal = (item.typo == 2) ? (item.precio * item.gramos) / 1000 : item.precio * item.cantidad
      return (acc + precionFinal)
    }, 0).toFixed(2))))

    dispatch(setCantidadProductos(productosSelected.length))
  }, [productosSelected])

  const agregarGenerico = () => {
    productoGenerico.typo = TIPO_PRODUCTO.GENERICO
    productoGenerico.id = -1 // 
    productoGenerico.gramos = 0

    setOpenModalGenericProduct(false)

    setProductosSelected(productos => [...productos, productoGenerico])
  }

  const agregarProducto = (producto: IProducto) => {
    // valida si ya exite ese elemento
    const foundValue = productosSelected.find(el => el.id == producto.id)
    if(foundValue) return

    let porducto_seleccionado : IProducto_selected = {
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: (producto.typo == TIPO_PRODUCTO.CONTABLE) ? 1 : 0,
      gramos: (producto.typo == TIPO_PRODUCTO.GRAMAJE) ? 1000 : 0,
      pesage: "1",
      typo: producto.typo,
      stock: (producto.typo == 1) ? producto.cantidad_contable : producto.gramaje
    }

    setSearch('')

    setProductosSelected((productos) => {
      return [...productos, porducto_seleccionado]
    })

    saveLocalProductsSelected()
  }

  const agregarCantidad = (producto: IProducto_selected) => {
    setProductosSelected((productos) => {
      return productos.map((every_item) => {

        if(every_item.cantidad == producto.stock) return every_item
        
        if(every_item.id === producto.id) {
          return {
            ...every_item, 
            cantidad: every_item.cantidad + 1}
        }
        return every_item
      })
    })

    saveLocalProductsSelected()
  }

  const quitarCantidad = (producto: IProducto_selected) => {
    setProductosSelected((productos) => {
      return productos.map(every_item => {
        if(every_item.id === producto.id && every_item.cantidad > 1) {
          return {
            ...every_item,
            cantidad: every_item.cantidad - 1
          }
        }
        return every_item
      })
    })

    saveLocalProductsSelected()
  }

  const capturarPesage = (valorCapturado: string, element: IProducto_selected) => {

    const valor = parseFloat(valorCapturado)

    if(isNaN(valor)) return

    setProductosSelected(productos => {
      return productos.map(producto => {
        if(producto.id == element.id) {

          const valorGramos = (unidadMedida == "gm") ? valor : kilosToGramos(valor)

          // El stock siempre estara en gramos
          if(valorGramos >= Number(producto.stock)) {
            valorCapturado = (unidadMedida == "gm") ? producto.stock?.toString() ?? "" : GramosToKilos(parseFloat(producto.stock?.toString() ?? ""))
          }

          return {
            ...producto,
            pesage: (unidadMedida == "gm") ? GramosToKilos(valor) : valorCapturado,
            gramos: (unidadMedida == "gm") ? parseInt(valorCapturado) : kilosToGramos(valor)
          }
        }
        return producto
      })
    })

    saveLocalProductsSelected()
  }

  const deleteProduct = (id: number) => {
    setProductosSelected((productos) => {
      return productos.filter(every_item => every_item.id !== id)
    })

    saveLocalProductsSelected()
  }

  const realizarPago = (pago: number): Promise<void> => {

    const venta: ICurrent_venta = {
      productos: productosSelected,
      pago: pago
    }

    return new Promise(async (resolve, reject) => {

      const {error} = await addVenta(venta)
      console.log(error)
      if(error) return reject(error)
      
      setProductosSelected([])
      saveLocalProductsSelected()
      resolve()

    })

  }

  const escojerTypoCantidad = (element: IProducto_selected) => {
    if(element.typo === TIPO_PRODUCTO.CONTABLE || element.typo == TIPO_PRODUCTO.GENERICO) {
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
    else if(element.typo === TIPO_PRODUCTO.GRAMAJE) {
      return(
        <FormControl variant="standard" sx={{ m: 1, mt: 3, width: '12ch' }}>
          <Input
            id="standard-adornment-weight"
            type='text'
            value={(unidadMedida == "gm") ? element.gramos : element.pesage}
            onChange={e => capturarPesage(e.target.value, element)}
            endAdornment={<InputAdornment position="end">{unidadMedida}</InputAdornment>}
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

  const getCodigoBarras = (codigo: string) => {
    const productoBuscado = productos.find(el => el.codigo_barras == codigo)
    if(!productoBuscado) return

    agregarProducto(productoBuscado)
  }

  const saveLocalProductsSelected = () => {
    setProductosSelected(prevProduc => {
      localStorage.setItem("productos_seleccionados", JSON.stringify(prevProduc))
      return prevProduc
    })
  }

  const cambiarPropiedadesProductoGenerico = <T extends keyof IProducto_selected>(valor: IProducto_selected[T], propiedad: T) => {
    setProductoGenerico(prev => {
      return {
        ...prev,
        [propiedad]: valor
      }
    })
  }

  return (
    <div className='main-container'>
      <div className='productos-container'>
        <Paper
          component="div"
          className='my-1'
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: "100%" }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar productos"
            inputProps={{ 'aria-label': 'search products' }}
          />
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={() => setOpenModalGenericProduct(true)}>
            <AddIcon />
          </IconButton>
          <IconButton type="button" onClick={() => setIsOpenModalLector(true)}><QrCodeScanner /></IconButton>
        </Paper>

        { search.trim() != '' &&
        
          <div className='resultados-busqueda w-full md:w-[800px]'>
            {productos.filter((every_item) => every_item.nombre.toLowerCase().includes(search.toLowerCase())).map((every_item, id) => (

              <div key={id} className='producto' onClick={() => agregarProducto(every_item)}>
                <span className='text-lg font-bold mr-4'>{every_item.nombre}</span>
                <span>(Precio: {every_item.precio}) {every_item.typo == TIPO_PRODUCTO.GRAMAJE ? 'KG' : ''}</span>
              </div>
            ))}
          </div>
        }

        <List sx={{ bgcolor: 'background.paper' }}>
          {(productosSelected.length > 0) ? productosSelected.map((every_item, id) => (
            <ListItem
              key={id}
              disableGutters
              secondaryAction={
                <IconButton aria-label="delete" onClick={() => deleteProduct(every_item.id)}>
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
        <DetallesCompra productosSelected={productosSelected} setProductosSelected={setProductosSelected} realizarPago={realizarPago} />
      </div>

        {/* Agregar productos */}
        <ModalProductos open={openModalGenericProduct} handleAgregar={agregarGenerico} setOpen={setOpenModalGenericProduct} textAction='Agregar'>

            <DialogTitle>Agregar producto generico</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    required
                    margin="dense"
                    label="Nombre producto"
                    type="text"
                    value={productoGenerico.nombre}
                    onChange={e => cambiarPropiedadesProductoGenerico(e.target.value, "nombre")}
                    fullWidth
                    variant="standard"
                />
                <TextField
                    required
                    margin="dense"
                    label="Precio producto"
                    type="number"
                    value={productoGenerico.precio}
                    onChange={e => cambiarPropiedadesProductoGenerico(parseFloat(e.target.value), "precio")}
                    fullWidth
                    variant="standard"
                />

                <TextField
                    margin="dense"
                    label="Cantidad producto"
                    type="number"
                    value={productoGenerico.cantidad}
                    onChange={e => cambiarPropiedadesProductoGenerico(parseInt(e.target.value), "cantidad")}
                    fullWidth
                    variant="standard"
                />
                
            </DialogContent>
        </ModalProductos>

      <LectorBarras open={isOpenModalLector} setOpen={setIsOpenModalLector} getCode={getCodigoBarras}/>
    </div>
  )
}
  