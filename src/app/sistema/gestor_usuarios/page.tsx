'use client'

import { useEffect, useState } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { getTiposUsuarios, getUsuarios, addUsuario, updateUsuario, deleteUsuario } from '@/request/usuarios';
import { TipoUsuario, Usuario } from '@/interfaces/Usuario';
import Button from '@mui/material/Button';
import { PersonAdd } from '@mui/icons-material';
import TextField from '@mui/material/TextField';
import Modal from '@/componentes/Modal';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { catchError } from '@/utils/catchErrors';
import ErrorAlert from '@/alets/Error';
import SuccsessAlert from '@/alets/Success';

export default function GestorUsuarios() {

    const [usuarios, setUsuarios] = useState<Usuario[]>([])
    const [usuario, setUsuario] = useState<Usuario>()
    const [nuevoUsuario, setNuevoUsuario] = useState<Usuario>({} as Usuario)
    const [tiposUsuario, setTiposUsuario] = useState<TipoUsuario[]>()

    const [openAddUsers, setOpenAddUsers] = useState(false)
    const [openDeleteUsers, setOpenDeleteUsers] = useState(false)
    const [openUpdateUsers, setOpenUpdateUsers] = useState(false)

    const [openErrorAlert, setOpenErrorAlert] = useState(false)
    const [openSuccessAlert, setOpenSuccessAlert] = useState(false)

    const [mensajeError, setMensajeError] = useState("")
    const [mensajeSuccsess, setMensajeSuccsess] = useState("")

    useEffect(() => {

        const initInformacion = async () => {

            let [error, usuarios] = await catchError<Usuario[]>(() => getUsuarios())
            let [error2, tipos] = await catchError<TipoUsuario[]>(() => getTiposUsuarios())

            if(error || error2) console.error(`Error getUsuarios: ${error} ::: Error getTiposUsuarios: ${error2}`)
            
            setUsuarios(usuarios)
            setTiposUsuario(tipos)
        }

        initInformacion()
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

    const changeNuevoUsuario = (name: string, toChange: keyof Usuario) => {

        setNuevoUsuario(user => {
            return {
                ...user,
                [toChange]: name
            }
        })
    }

    const handleAddUsuario = () => {

        nuevoUsuario.typo_valor = tiposUsuario?.find(el => el.id == nuevoUsuario.typo_identificador)?.typo ?? ""

        addUsuario(nuevoUsuario).then(registro => {
            nuevoUsuario.id = registro.id
            setUsuarios(users => [...users, nuevoUsuario])
            setMensajeSuccsess(`Se agrego a ${nuevoUsuario.usuario} correctamente`)
            setOpenSuccessAlert(true)
        })

        setOpenAddUsers(false)
        setNuevoUsuario({} as Usuario)
    }

    const handleDeleteUsuario = () => {

        if(!usuario || !usuario.id) return

        deleteUsuario(usuario.id).then(() => {
            setUsuarios(usuarios.filter(user => user.id != usuario.id))

            setMensajeSuccsess(`Se elimino a ${usuario.usuario} correctamente`)
            setOpenSuccessAlert(true)
        })
        
        setOpenDeleteUsers(false)
        setUsuario(undefined)
    }

    const handleUpdateUsuario = () => {

        if(!usuario) return

        updateUsuario(usuario).then(() => {

            setUsuarios((users) => {
                return users.map(user => {
                    if(user.id == usuario?.id) {
                        return {
                            ...user,
                            usuario: usuario?.usuario
                        }
                    }
                    return user
                })
            })
    
            setMensajeSuccsess(`Se actualizo un ${usuario.usuario} correctamente`)
            setOpenSuccessAlert(true)

            setUsuario(undefined)
        })
        
        setOpenUpdateUsers(false)
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
                                    <ListItemText primary={`${usuario.usuario} - ${usuario.typo_valor}`} />
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
                                        onChange={e => changeUser(e.target.value.trim().toUpperCase(), 'usuario')}
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
                                    <Button variant="contained" color="success" size="small" onClick={() => setOpenUpdateUsers(true)}>Actualizar</Button>
                                    <Button variant="contained" color='error' size="small" onClick={() => setOpenDeleteUsers(true)}>Eliminar</Button>
                                </div>
                            </div>
                        
                    </div>
                }
            </div>

            <Modal titulo='Agregar personal' open={openAddUsers} setOpen={setOpenAddUsers} textoBotonConfirmar='Agregar' handleConfirmar={handleAddUsuario}>
                <>
                    <TextField 
                        id="usuario-add" 
                        label="usuario" 
                        variant="standard" 
                        size="small" 
                        fullWidth 
                        value={nuevoUsuario?.usuario ?? ""} 
                        onChange={e => changeNuevoUsuario(e.target.value.trim().toUpperCase(), 'usuario')}
                    />
                    <FormControl fullWidth variant="standard">
                        <InputLabel id="nivel-trabajador">Roll de empleo</InputLabel>
                        <Select
                            labelId="nivel-trabajador"
                            id="nivel-trabajador-select"
                            label="Roll de empleo"
                            value={nuevoUsuario?.typo_identificador}
                            onChange={e => changeNuevoUsuario(e.target.value.toString(), 'typo_identificador')}
                        >
                            {tiposUsuario?.map(tipo => (
                                <MenuItem key={tipo.id} value={tipo.id}>{tipo.typo}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField 
                        id="password-add"
                        label="contraseña" 
                        variant="standard" 
                        size="small" 
                        fullWidth 
                        value={nuevoUsuario?.password ?? ""}
                        onChange={e => changeNuevoUsuario(e.target.value, 'password')}
                    />
                </>
            </Modal>

            <Modal titulo={`Eliminar a ${usuario?.usuario}`} open={openDeleteUsers} setOpen={setOpenDeleteUsers} textoBotonConfirmar='Eliminar' handleConfirmar={handleDeleteUsuario}>
                <>
                    <p>Una ves eliminado se perdera el {usuario?.typo_valor} permanentemente</p>
                </>
            </Modal>

            <Modal titulo={`Actualizar ${usuario?.usuario}`} open={openUpdateUsers} setOpen={setOpenUpdateUsers} textoBotonConfirmar='Actualizar' handleConfirmar={handleUpdateUsuario}>
                <>
                    <p>¿Desea actualizar al {usuario?.typo_valor}?</p>
                </>
            </Modal>

            <ErrorAlert open={openErrorAlert} setOpen={setOpenErrorAlert} mensage={mensajeError} />
            <SuccsessAlert open={openSuccessAlert} setOpen={setOpenSuccessAlert} mensage={mensajeSuccsess} />
        </>
    )
}