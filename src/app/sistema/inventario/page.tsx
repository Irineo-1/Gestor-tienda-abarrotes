'use client'

import { useEffect, useState } from 'react';
import { getProductos, addProductos, deleteProducto, updateProducto } from '@/request/producto';
import { IProducto, TIPO_PRODUCTO } from '@/interfaces/Iproducto';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import ModalProductos from '@/componentes/ModalProductos';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import SuccsessAlert from '@/alets/Success';
import ErrorAlert from '@/alets/Error';
import Tabla from '@/componentes/Tabla';
import { HeadersTabla } from '@/interfaces/Tabla';
import QrCodeScanner from '@mui/icons-material/QrCodeScanner';
import { IconButton } from '@mui/material';
import LectorBarras from '@/componentes/LectorBarras';
import { unidadMedidaAtom } from '@/atom/unidadMedidaAtom';
import { useAtom } from 'jotai';
import { GramosToKilos } from '@/utils/convercion';


interface editarProducto extends IProducto {
    cantidadAgregar: number
    gramajeAgregar: number
}

export default function Inventario() {

    const [productos, setProductos] = useState<IProducto[]>([])
    const [open, setOpen] = useState<boolean>(false)
    const [openEdit, setOpenEdit] = useState<boolean>(false)
    const [openConfirmacionEliminar, setOpenConfirmacionEliminar] = useState<boolean>(false)
    const [isOpenModalLector, setIsOpenModalLector] = useState(false)

    const [successOpen, setSuccessOpen] = useState<boolean>(false)
    const [successMessage, setSuccessMessage] = useState<string>("")
    const [errorMessage, seterrorMessage] = useState<string>("")
    const [errorOpen, setErrorOpen] = useState<boolean>(false)

    const [toDelete, setToDelete] = useState<{id: number, nombre: string}>()

    const [productoActualEditar, setProductoActualEditar] = useState<editarProducto>({} as editarProducto)
    const [productoActualAgregar, setProductoActualAgregar] = useState<IProducto>({} as IProducto)

    const [unidadMedida] = useAtom(unidadMedidaAtom)

    const headersTablaTest: HeadersTabla<IProducto>[] = [
        {
            titulo: "Nombre",
            valor: "nombre"
        },
        {
            titulo: "Precio",
            valor: "precio"
        },
        {
            titulo: (unidadMedida == "gm") ? "Gramaje" : "kilaje",
            valor: "gramaje"
        },
        {
            titulo: "Cantidad",
            valor: "cantidad_contable"
        }
    ]

    const agregar = ()  => {

        if(productoActualAgregar.typo == TIPO_PRODUCTO.CONTABLE) {
            productoActualAgregar.gramaje = 0
        }
        else {
            productoActualAgregar.cantidad_contable = 0
        }

        productoActualAgregar.id = 0 // al responder la solicitud se resetea

        const validate = [
            productoActualAgregar.nombre.trim(), 
            productoActualAgregar.precio, 
            productoActualAgregar.gramaje, 
            productoActualAgregar.cantidad_contable, 
            productoActualAgregar.typo, 
            productoActualAgregar.codigo_barras.trim()
        ]

        if(validate.includes('')) { 
            seterrorMessage('No puede haber valores vacios')
            setErrorOpen(true)
        }

        addProductos(productoActualAgregar).then((data) => {
            setSuccessMessage('Producto agregado exitosamente')
            setSuccessOpen(true)
 
            productoActualAgregar.id = data.id // Se modifica el id para poder editar y eliminar 🆔

            setProductos(productos => {
                return [...productos, productoActualAgregar]
            })

        }).catch(() => {
            seterrorMessage('Un error ha ocurrido, revisa la informacion del producto')
            setErrorOpen(true)
        })
        
        setOpen(false)
    }

    const editar = () => {
        seterrorMessage('No puede haber valores vacios')
        if(productoActualEditar.nombre.trim() == '') return setErrorOpen(true)
        if(isNaN(productoActualEditar.precio)) return setErrorOpen(true)
        if(isNaN(productoActualEditar.gramajeAgregar)) return setErrorOpen(true)
        if(isNaN(productoActualEditar.cantidadAgregar)) return setErrorOpen(true)

        const producto: IProducto = {
            nombre: productoActualEditar.nombre,
            precio: productoActualEditar.precio,
            gramaje: productoActualEditar.gramaje + productoActualEditar.gramajeAgregar,
            cantidad_contable: productoActualEditar.cantidad_contable + productoActualEditar.cantidadAgregar,
            typo: productoActualEditar.typo, // No utilizado
            codigo_barras: productoActualEditar.codigo_barras, // No utilizado
            id: productoActualEditar.id
        }

        updateProducto(producto).then(() => {
            setSuccessMessage('Producto editado exitosamente')
            setSuccessOpen(true)

            setProductos(productos => 
                productos.map(every_producto => {
                    if(every_producto.id == producto.id) {
                        return producto
                    }

                    return every_producto
                })
            )
        }).catch(() => {
            seterrorMessage('Un error ha ocurrido, revisa la informacion del producto')
            setErrorOpen(true)
        })

        setOpenEdit(false)
    }

    const eliminar = () => {
        deleteProducto(toDelete?.id!!).then(() => {
            setSuccessMessage('Producto eliminado exitosamente')
            setSuccessOpen(true)

            const result_productos = productos.filter(el => el.id != toDelete?.id!!)

            setProductos(result_productos)

        }).catch(() => {
            seterrorMessage('Un error ha ocurrido, intenta mas tarde')
            setErrorOpen(true)
        })
        
        setOpenConfirmacionEliminar(false)
    }

    const handleEditarOpenModal = (producto: IProducto) => {

        const producto_editar: editarProducto = {
            ...producto,
            gramajeAgregar: 0,
            cantidadAgregar: 0
        }

        setProductoActualEditar(producto_editar)
        setOpenEdit(true)
    }

    const handleAgregarOpenModal = () => {
        setProductoActualAgregar({} as IProducto)
        setOpen(true)
    }

    const handleEliminar = (id: number, nombre: string) => {
        setToDelete({id, nombre})
        setOpenConfirmacionEliminar(true)
    }

    const getCodigoBarras = (codigo: string) => {
        productoActualAgregar.codigo_barras = codigo
    }

    const cambiarPropiedadesProductoEditar = <T extends keyof editarProducto> (name: editarProducto[T], toChange: T) => {

        setProductoActualEditar(producto => {
            return {
                ...producto,
                [toChange]: name
            }
        })
    }

    const cambiarPropiedadesProductoAgregar = <T extends keyof IProducto> (name: IProducto[T], toChange: T) => {

        setProductoActualAgregar(producto => {
            return {
                ...producto,
                [toChange]: name
            }
        })
    }

    useEffect(() => {
        getProductos().then((data) => {
            setProductos(data)
        }).catch((err) => {
            console.log(err)
        })
    }, [])

  return (
    <>
        <div className='mb-4'>
            <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={handleAgregarOpenModal}>
                Agregar producto
            </Button>
        </div>

        <Tabla acciones={true} data={productos} headers={headersTablaTest} editData={handleEditarOpenModal} deleteData={product => handleEliminar(product.id, product.nombre)}/>

        {/* Agregar productos */}
        <ModalProductos open={open} handleAgregar={agregar} setOpen={setOpen} textAction='Agregar'>

            <DialogTitle>Agregar producto</DialogTitle>
            <DialogContent>
                <div className='flex items-center'>                    
                    <TextField
                        required
                        margin="dense"
                        label="Codigo de barras"
                        type="text"
                        value={productoActualAgregar.codigo_barras}
                        onChange={e => cambiarPropiedadesProductoAgregar(e.target.value, "codigo_barras")}
                        fullWidth
                        variant="standard"
                    />
                    <IconButton onClick={() => setIsOpenModalLector(true)}>
                        <QrCodeScanner />
                    </IconButton>
                </div>
                <TextField
                    autoFocus
                    required
                    margin="dense"
                    label="Nombre producto"
                    type="text"
                    value={productoActualAgregar.nombre}
                    onChange={e => cambiarPropiedadesProductoAgregar(e.target.value, "nombre")}
                    fullWidth
                    variant="standard"
                />
                <TextField
                    required
                    margin="dense"
                    label="Precio producto"
                    type="number"
                    value={productoActualAgregar.precio}
                    onChange={e => cambiarPropiedadesProductoAgregar(parseFloat(e.target.value), "precio")}
                    fullWidth
                    variant="standard"
                />
                <FormControl fullWidth variant="standard">
                    <InputLabel id="demo-simple-select-label">Typo de producto</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Typo de producto"
                        value={productoActualAgregar.typo}
                        onChange={e => cambiarPropiedadesProductoAgregar(parseInt(e.target.value.toString()), "typo")}
                    >
                        <MenuItem value={TIPO_PRODUCTO.CONTABLE}>Contable</MenuItem>
                        <MenuItem value={TIPO_PRODUCTO.GRAMAJE}>Gramaje</MenuItem>
                    </Select>
                </FormControl>
                {productoActualAgregar.typo == TIPO_PRODUCTO.GRAMAJE ? 
                    
                    <TextField
                        margin="dense"
                        label="Gramaje producto"
                        type="number"
                        value={productoActualAgregar.gramaje}
                        onChange={e => cambiarPropiedadesProductoAgregar(parseInt(e.target.value), "gramaje")}
                        fullWidth
                        variant="standard"
                    />
                
                : (productoActualAgregar.typo == TIPO_PRODUCTO.CONTABLE) &&
            
                    <TextField
                        margin="dense"
                        label="Cantidad producto"
                        type="number"
                        value={productoActualAgregar.cantidad_contable}
                        onChange={e => cambiarPropiedadesProductoAgregar(parseInt(e.target.value), "cantidad_contable")}
                        fullWidth
                        variant="standard"
                    />
                }
                
            </DialogContent>
        </ModalProductos>

        {/* Editar productos */}
        <ModalProductos open={openEdit} handleAgregar={editar} setOpen={setOpenEdit} textAction='Editar'>

            <DialogTitle>Editar producto</DialogTitle>

            <DialogContent>
                <TextField
                    autoFocus
                    required
                    margin="dense"
                    label="Nombre producto"
                    type="text"
                    value={productoActualEditar.nombre}
                    onChange={e => cambiarPropiedadesProductoEditar(e.target.value, "nombre")}
                    fullWidth
                    variant="standard"
                />
                <TextField
                    required
                    margin="dense"
                    label="Precio producto"
                    type="number"
                    value={productoActualEditar.precio}
                    onChange={e => cambiarPropiedadesProductoEditar(parseFloat(e.target.value), "precio")}
                    fullWidth
                    variant="standard"
                />

                {productoActualEditar.typo == TIPO_PRODUCTO.CONTABLE ?
                
                    <div className='flex items-end'>
                        <span>Cantidad actual: {productoActualEditar.cantidad_contable}</span>
                        <TextField
                            margin="dense"
                            label="Agregar cantidad"
                            type="number"
                            fullWidth
                            variant="standard"
                            value={productoActualEditar.cantidadAgregar}
                            onChange={e => cambiarPropiedadesProductoEditar(parseFloat(e.target.value), "cantidadAgregar")}
                        />
                    </div>
                
                : // Gramage
                
                    <div className='flex items-end'>
                        <span>Cantidad actual: {(unidadMedida == "gm") ? productoActualEditar.gramaje : GramosToKilos(productoActualEditar.gramaje)} {unidadMedida}</span>
                        <TextField
                            margin="dense"
                            label={`${(unidadMedida == "gm") ? "Gramaje" : "Kilaje"} producto`}
                            type="text"
                            fullWidth
                            variant="standard"
                            value={productoActualEditar.gramajeAgregar}
                            onChange={e => cambiarPropiedadesProductoEditar(parseFloat(e.target.value), "gramajeAgregar")}
                        />
                    </div>
                
                }
            </DialogContent>
        </ModalProductos>

        {/* Confirmacion eliminar producto */}
        <ModalProductos open={openConfirmacionEliminar} handleAgregar={eliminar} setOpen={setOpenConfirmacionEliminar} textAction='Aceptar'>
            <DialogTitle>¿Desea eliminar {toDelete?.nombre}?</DialogTitle>
        </ModalProductos>

        <LectorBarras open={isOpenModalLector} setOpen={setIsOpenModalLector} getCode={getCodigoBarras}/>

        <SuccsessAlert mensage={successMessage} open={successOpen} setOpen={setSuccessOpen} />
        <ErrorAlert mensage={errorMessage} open={errorOpen} setOpen={setErrorOpen} />
    </>
  );
}