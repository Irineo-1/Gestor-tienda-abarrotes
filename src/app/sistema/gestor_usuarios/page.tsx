'use client'

import { useEffect, useState } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { getUsuarios } from '@/request/usuarios';
import { Usuario } from '@/interfaces/Usuario';
import Button from '@mui/material/Button';
import { PersonAdd } from '@mui/icons-material';

export default function GestorUsuarios() {

    const [usuarios, setUsuarios] = useState<Usuario[]>([])

    useEffect(() => {
        getUsuarios().then(data => {
            setUsuarios(data)
        })
    }, [])

    return (
        <>
            <div className="flex flex-wrap flex-row h-full w-full">
                <div className="w-full h-[50%] md:w-[50%] md:h-full md:pl-3">
                    <div className='mb-2'>
                        <Button variant="contained" startIcon={<PersonAdd />}> Agregar usuario</Button>
                    </div>
                    {usuarios.map(usuario => (
                        <ListItem component="div" disablePadding>
                            <ListItemButton>
                                <ListItemText primary={`${usuario.usuario} - ${usuario.typo}`} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </div>

                <div className="flex items-center justify-center w-full h-[50%] md:w-[50%] md:h-full md:pr-3">
                    <div className='w-[250px] flex items-center justify-center'>
                        <div></div>
                        <div className='w-full'>
                            <Button variant="contained" color="success" size="small">Actualizar</Button>
                            <Button variant="contained" color='error' size="small">Eliminar</Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}