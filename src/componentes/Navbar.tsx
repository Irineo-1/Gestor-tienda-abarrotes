'use client'
import Link from 'next/link'
import '@/styles/navbar.css'
import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useAtom } from 'jotai'
import { unidadMedidaAtom } from '@/atom/unidadMedidaAtom'
import { useEffect } from 'react';

export default function Navbar() {

    const [unidadMedida, setUnidadMedida] = useAtom(unidadMedidaAtom)

    const handleChangeUnidadMedida = (unidad: "gm" | "kg") => {
        setUnidadMedida(unidad)
        localStorage.setItem("unidad_medida", unidad)
    }

    useEffect(() => {
        const unidadActual = localStorage.getItem("unidad_medida")
        if (unidadActual === "gm" || unidadActual === "kg") {
            handleChangeUnidadMedida(unidadActual)
        }
    }, [])

    return (
        <>
        
            <nav className="flex items-center h-full w-full border-r-2 border-gray-300">
                <ul className="w-full">
                    <li className='every-item'><Link href="/sistema/punto_venta">Caja</Link></li>
                    <li className='every-item'><Link href="/sistema/ventas">Ventas</Link></li>
                    <li className='every-item'><Link href="/sistema/inventario">Inventario</Link></li>
                    <li className='every-item'><Link href="/sistema/gestor_usuarios">Gestion de usuarios</Link></li>
                    <li>
                        <Box sx={{marginX: "1rem", marginTop: "10px"}}>
                            <FormControl
                                sx={{width: "100%"}}
                                size="small"
                            >
                            <InputLabel id="demo-simple-select-label">Unidad de medida</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={unidadMedida}
                                label="Unidad de medida"
                                onChange={e => handleChangeUnidadMedida(e.target.value as "gm" | "kg")}
                            >
                                <MenuItem value="gm">Gramos</MenuItem>
                                <MenuItem value="kg">Kilos</MenuItem>
                            </Select>
                            </FormControl>
                        </Box>
                    </li>
                </ul>
            </nav>
        
        </>
    );
}