'use client'

import { useEffect, useState } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { getUsuarios } from '@/request/usuarios';
import { Usuario } from '@/interfaces/Usuario';
import Button from '@mui/material/Button';
import { PersonAdd } from '@mui/icons-material';
import TextField from '@mui/material/TextField';
import Modal from '@/componentes/Modal';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

export default function GestorUsuarios() {

    const [usuarios, setUsuarios] = useState<Usuario[]>([])
    const [usuario, setUsuario] = useState<Usuario>()

    const [openAddUsers, setOpenAddUsers] = useState(false)

    useEffect(() => {
        getUsuarios().then(data => {
            setUsuarios(data)
        })
    }, [])

    const changeUser = (name: string, toChange: keyof Usuario) => {

        setUsuario(user => {

            if (!user) return undefined;

            return {
                ...user,
                [toChange]: name
            }
        })
    }

    return (
        <>
            <div className="flex flex-wrap flex-row h-full w-full">
                <div className="w-full h-[50%] md:w-[50%] md:h-full md:pl-3">
                    <div className='mb-2'>
                        <Button variant="contained" startIcon={<PersonAdd />} onClick={() => setOpenAddUsers(true)}> Agregar usuario</Button>
                    </div>
                    {usuarios.map((usuario, i) => (
                        <div className='max-h-[90%] overflow-y-auto' key={i}>
                            <ListItem component="div" disablePadding>
                                <ListItemButton onClick={() => setUsuario(usuario)}>
                                    <ListItemText primary={`${usuario.usuario} - ${usuario.typo}`} />
                                </ListItemButton>
                            </ListItem>
                        </div>
                    ))}
                </div>

                {usuario &&
                    
                    <div className="flex items-center justify-center w-full h-[50%] md:w-[50%] md:h-[99%] md:pr-3 border border-gray-300">
                            <div className='w-[80%] h-full flex items-center justify-center flex-col'>
                                <div className='my-4 w-full space-y-4'>
                                    <TextField 
                                        id="usuario" 
                                        label="usuario" 
                                        variant="standard" 
                                        size="small" 
                                        fullWidth 
                                        value={usuario?.usuario ?? ""} 
                                        onChange={e => changeUser(e.target.value, 'usuario')}
                                    />
                                    <TextField 
                                        id="password" 
                                        label="Nueva contraseña" 
                                        variant="standard" 
                                        size="small" 
                                        fullWidth 
                                        value={usuario?.password ?? ""}
                                        onChange={e => changeUser(e.target.value, 'password')}
                                    />
                                </div>
                                <div className='w-full flex justify-between'>
                                    <Button variant="contained" color="success" size="small">Actualizar</Button>
                                    <Button variant="contained" color='error' size="small">Eliminar</Button>
                                </div>
                            </div>
                        
                    </div>
                }
            </div>

            <Modal titulo='Agregar personal' open={openAddUsers} setOpen={setOpenAddUsers} textoBotonConfirmar='Agregar'>
                <>
                    <TextField 
                        id="usuario-add" 
                        label="usuario" 
                        variant="standard" 
                        size="small" 
                        fullWidth 
                        value={usuario?.usuario ?? ""} 
                        onChange={e => changeUser(e.target.value, 'usuario')}
                    />
                    <FormControl fullWidth variant="standard">
                        <InputLabel id="nivel-trabajador">Typo de producto</InputLabel>
                        <Select
                            labelId="nivel-trabajador"
                            id="nivel-trabajador-select"
                            label="Typo de producto"
                        >
                            <MenuItem value={1}>Contable</MenuItem>
                            <MenuItem value={2}>Gramaje</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField 
                        id="password-add"
                        label="contraseña" 
                        variant="standard" 
                        size="small" 
                        fullWidth 
                        value={usuario?.password ?? ""}
                        onChange={e => changeUser(e.target.value, 'password')}
                    />
                </>
            </Modal>
        </>
    )
}