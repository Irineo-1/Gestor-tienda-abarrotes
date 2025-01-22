'use client'

import { useState, useEffect, Fragment } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TextField from '@mui/material/TextField';
import { IVenta, IVenta_gp_codigo } from '@/interfaces/IVenta';
import { getVentas } from '@/request/Venta'


function Row({ventas}: {ventas: IVenta_gp_codigo}) {
    const [open, setOpen] = useState(false);
    
    if(ventas == undefined) return

    if(ventas.productos == null) return

    let Productos_formater: IVenta[] = JSON.parse(ventas.productos)

    return (
        <Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                {ventas.codigo_venta}
                </TableCell>
                <TableCell align="right">{ventas.fecha}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box sx={{ margin: 1 }}>
                    <Typography variant="h6" gutterBottom component="div">
                        Productos
                    </Typography>
                    <Table size="small" aria-label="purchases">
                        <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Cantidad</TableCell>
                            <TableCell>Gramaje</TableCell>
                            <TableCell align="right">Precio</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {Productos_formater.map((producto, i) => (
                            <TableRow key={i}>
                                <TableCell component="th" scope="row">
                                    {producto.nombre}
                                </TableCell>
                                <TableCell>{producto.cantidad}</TableCell>
                                <TableCell>{producto.gramaje}</TableCell>
                                <TableCell align="right">{producto.precio_acumulado}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    </Box>
                </Collapse>
                </TableCell>
            </TableRow>
        </Fragment>
    );
}

export default function Venta() {

    const [rows, setRows] = useState<IVenta_gp_codigo[]>([])
    const [fechaSeleccionada, setfechaSeleccionada] = useState('')

    const formatearFecha = (fecha: Date): string => {
        const year = fecha.getFullYear()
        const month = (`0${(fecha.getMonth() + 1)}`).slice(-2)
        const day = (`0${(fecha.getDate())}`).slice(-2)
        return `${year}-${month}-${day}`
    }

    useEffect(() => {
        const today = new Date()
        let fecha = formatearFecha(today)
        setfechaSeleccionada(fecha)

        getVentas(fecha).then((data) => {
            setRows(data ?? [])
        })
    }, [])

    const cambiarFecha = (fecha: string) => {
        setfechaSeleccionada(fecha)
        getVentas(fecha).then((data) => {
            setRows(data ?? [])
        })
    }

    return (
        <>
            <div className='bg-white border shadow-md flex items-center p-2'>
                <span className='mr-2'>Fecha de la venta: </span>
                <TextField
                    required
                    id="outlined-required"
                    type='date'
                    value={fechaSeleccionada}
                    onChange={(e) => cambiarFecha(e.target.value)}
                />
            </div>
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell>Codigo Venta</TableCell>
                        <TableCell align="right">Fecha</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {rows.map((row, i) => (
                        <Row key={i} ventas={row} />
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}