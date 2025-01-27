'use client'

import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { getProductos, addProductos, deleteProducto, updateProducto } from '@/request/producto';
import { IProducto } from '@/interfaces/Iproducto';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
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

export default function Inventario() {

    const [productos, setProductos] = useState<IProducto[]>([])
    const [open, setOpen] = useState<boolean>(false)
    const [openEdit, setOpenEdit] = useState<boolean>(false)
    const [openConfirmacionEliminar, setOpenConfirmacionEliminar] = useState<boolean>(false)

    const [successOpen, setSuccessOpen] = useState<boolean>(false)
    const [successMessage, setSuccessMessage] = useState<string>("")
    const [errorMessage, seterrorMessage] = useState<string>("")
    const [errorOpen, setErrorOpen] = useState<boolean>(false)

    const [codigoBarras, setCodigoBarras] = useState<string>('')
    const [nombre, setNombre] = useState<string>('')
    const [precio, setPrecio] = useState<number>(0)
    const [gramaje, setGramje] = useState<number>(0)
    const [gramajeAgg, setGramjeAgg] = useState<number>(0)
    const [cantidad, setCantidad] = useState<number>(0)
    const [cantidadAgg, setCantidadAgg] = useState<number>(0)
    const [id, setId] = useState<number>(0)
    const [typo, setTypo] = useState<string>('')
    const [typoAgregar, setTypoAgregar] = useState<string>('')
    const [toDelete, setToDelete] = useState<{id: number, nombre: string}>()

    const agregar = ()  => {

        const producto: IProducto = {
            nombre: nombre,
            precio: precio,
            gramaje: gramaje,
            cantidad_contable: cantidad,
            typo: typoAgregar,
            codigo_barras: codigoBarras,
            id: 0 // Este id es temporal. Una vez insertado el registro se remplaza en el then de addProductos
        }

        const validate = [nombre.trim(), precio, gramaje, cantidad, typoAgregar, codigoBarras.trim()]

        if(validate.includes('')) { 
            seterrorMessage('No puede haber valores vacios')
            setErrorOpen(true)
        }

        addProductos(producto).then((data) => {
            setSuccessMessage('Producto agregado exitosamente')
            setSuccessOpen(true)

            producto.id = data.id

            setProductos(productos => {
                return [...productos, producto]
            })

        }).catch(() => {
            seterrorMessage('Un error ha ocurrido, revisa la informacion del producto')
            setErrorOpen(true)
        })
        
        setOpen(false)
    }

    const editar = () => {

        seterrorMessage('No puede haber valores vacios')
        if(nombre.trim() == '') return setErrorOpen(true)
        if(isNaN(precio)) return setErrorOpen(true)
        if(isNaN(gramaje)) return setErrorOpen(true)
        if(isNaN(cantidad)) return setErrorOpen(true)

        const producto: IProducto = {
            nombre: nombre,
            precio: precio,
            gramaje: gramaje + gramajeAgg,
            cantidad_contable: cantidad + cantidadAgg,
            typo: typo, // No utilizado
            codigo_barras: codigoBarras, // No utilizado
            id: id
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
        setNombre(producto.nombre)
        setPrecio(producto.precio)
        setGramje(producto.gramaje)
        setCantidad(producto.cantidad_contable)
        setId(producto.id)
        setTypo(producto.typo)
        setOpenEdit(true)
    }

    const handleAgregarOpenModal = () => {
        setCodigoBarras('')
        setNombre('')
        setPrecio(0)
        setGramje(0)
        setCantidad(0)
        setId(0)
        setTypo('')
        setTypoAgregar('')
        setOpen(true)
    }

    const handleEliminar = (id: number, nombre: string) => {
        setToDelete({id, nombre})
        setOpenConfirmacionEliminar(true)
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
        <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={handleAgregarOpenModal}>
            Agregar producto
        </Button>
        <TableContainer component={Paper} className='mt-4' style={{ height: 500, width: '100%' }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell><strong>Nombre</strong></TableCell>
                    <TableCell align="right"><strong>Precio</strong></TableCell>
                    <TableCell align="right"><strong>Gramaje</strong></TableCell>
                    <TableCell align="right"><strong>Cantidad</strong></TableCell>
                    <TableCell align="right"><strong>Acciones</strong></TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {productos.map((producto) => (
                    <TableRow
                    key={producto.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell component="th" scope="row">
                            {producto.nombre}
                        </TableCell>
                        <TableCell align="right">{producto.precio} {producto.typo == 'gramaje' ? '(KG)' : ''}</TableCell>
                        <TableCell align="right">{producto.gramaje}</TableCell>
                        <TableCell align="right">{producto.cantidad_contable}</TableCell>
                        <TableCell align="right">
                        <IconButton aria-label="edit" onClick={() => handleEditarOpenModal(producto)}><EditIcon /></IconButton>
                        <IconButton color="error" aria-label="delete" onClick={() => handleEliminar(producto.id, producto.nombre)}><DeleteIcon /></IconButton>
                        </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>

        {/* Agregar productos */}
        <ModalProductos open={open} handleAgregar={agregar} setOpen={setOpen} textAction='Agregar'>

            <DialogTitle>Agregar producto</DialogTitle>
            <DialogContent>
                <TextField
                    required
                    margin="dense"
                    label="Codigo de barras"
                    type="text"
                    value={codigoBarras}
                    onChange={e => setCodigoBarras(e.target.value)}
                    fullWidth
                    variant="standard"
                />
                <TextField
                    autoFocus
                    required
                    margin="dense"
                    label="Nombre producto"
                    type="text"
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                    fullWidth
                    variant="standard"
                />
                <TextField
                    required
                    margin="dense"
                    label="Precio producto"
                    type="number"
                    value={precio}
                    onChange={e => setPrecio(parseFloat(e.target.value))}
                    fullWidth
                    variant="standard"
                />
                <FormControl fullWidth variant="standard">
                    <InputLabel id="demo-simple-select-label">Typo de producto</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Typo de producto"
                        value={typoAgregar}
                        onChange={e => setTypoAgregar(e.target.value)}
                    >
                        <MenuItem value={1}>Contable</MenuItem>
                        <MenuItem value={2}>Gramaje</MenuItem>
                    </Select>
                </FormControl>
                {typoAgregar == '2' ? 
                    
                    <TextField
                        margin="dense"
                        label="Gramaje producto"
                        type="number"
                        value={gramaje}
                        onChange={e => setGramje(parseInt(e.target.value))}
                        fullWidth
                        variant="standard"
                    />
                
                : (typoAgregar == '1') ?
            
                    <TextField
                        margin="dense"
                        label="Cantidad producto"
                        type="number"
                        value={cantidad}
                        onChange={e => setCantidad(parseInt(e.target.value))}
                        fullWidth
                        variant="standard"
                    />
                :
                    <></>    
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
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                    fullWidth
                    variant="standard"
                />
                <TextField
                    required
                    margin="dense"
                    label="Precio producto"
                    type="number"
                    value={precio}
                    onChange={e => setPrecio(parseFloat(e.target.value))}
                    fullWidth
                    variant="standard"
                />

                {typo == "gramaje" ? 
                
                    <div className='flex items-end'>
                        <span>Cantidad actual: {gramaje}</span>
                        <TextField
                            margin="dense"
                            label="Gramaje producto"
                            type="number"
                            fullWidth
                            variant="standard"
                            value={gramajeAgg}
                            onChange={e => setGramjeAgg(parseFloat(e.target.value))}
                        />
                    </div>
                
                : 
                
                    <div className='flex items-end'>
                        <span>Cantidad actual: {cantidad}</span>
                        <TextField
                            margin="dense"
                            label="Agregar cantidad"
                            type="number"
                            fullWidth
                            variant="standard"
                            value={cantidadAgg}
                            onChange={e => setCantidadAgg(parseFloat(e.target.value))}
                        />
                    </div>
                
                }
            </DialogContent>
        </ModalProductos>

        {/* Confirmacion eliminar producto */}
        <ModalProductos open={openConfirmacionEliminar} handleAgregar={eliminar} setOpen={setOpenConfirmacionEliminar} textAction='Aceptar'>
            <DialogTitle>¿Desea eliminar {toDelete?.nombre}?</DialogTitle>
        </ModalProductos>

        <SuccsessAlert mensage={successMessage} open={successOpen} setOpen={setSuccessOpen} />
        <ErrorAlert mensage={errorMessage} open={errorOpen} setOpen={setErrorOpen} />
    </>
  );
}