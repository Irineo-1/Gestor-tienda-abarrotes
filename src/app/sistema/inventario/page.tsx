'use client'

import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { getProductos } from '@/request/producto';
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

export default function Inventario() {

    const [productos, setProductos] = useState<IProducto[]>([])
    const [open, setOpen] = useState(false)

    const test = ()  => {
        console.log("se agrego")
        setOpen(false)
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
        <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
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
                    <IconButton aria-label="edit"><EditIcon /></IconButton>
                    <IconButton color="error" aria-label="delete"><DeleteIcon /></IconButton>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>

        {/* Agregar productos */}
        <ModalProductos open={open} handleAgregar={test} setOpen={setOpen}>

            <DialogTitle>Agregar producto</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    required
                    margin="dense"
                    label="Nombre producto"
                    type="text"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    required
                    margin="dense"
                    label="Precio producto"
                    type="number"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    margin="dense"
                    label="Gramaje producto"
                    type="number"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    margin="dense"
                    label="Cantidad producto"
                    type="number"
                    fullWidth
                    variant="standard"
                />
            </DialogContent>
        </ModalProductos>

        {/* Editar productos */}
        <ModalProductos open={open} handleAgregar={test} setOpen={setOpen}>

            <DialogTitle>Editar producto</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    required
                    margin="dense"
                    label="Nombre producto"
                    type="text"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    required
                    margin="dense"
                    label="Precio producto"
                    type="number"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    margin="dense"
                    label="Gramaje producto"
                    type="number"
                    fullWidth
                    variant="standard"
                />
                <TextField
                    margin="dense"
                    label="Cantidad producto"
                    type="number"
                    fullWidth
                    variant="standard"
                />
            </DialogContent>
        </ModalProductos>
    </>
  );
}