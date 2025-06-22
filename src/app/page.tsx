'use client'

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Password from '@mui/icons-material/Password';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Autenticacion } from '@/request/Autenticacion';
import CircularProgress from "@mui/material/CircularProgress";
import ErrorAlert from '@/alets/Error';
import "../styles/login.css"
import { catchError } from '@/utils/catchErrors';
import { Usuario } from '@/interfaces/Usuario';
import { UsuarioLogeado } from '@/atom/usuarioAtom';
import { useAtom } from 'jotai';

export default function Home() {

  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [nombre, setNombre] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorOpen, setErrorOpen] = useState(false)
  const [messageError, setMessageError] = useState('')

  const [,setUsuarioLogeado] = useAtom(UsuarioLogeado)

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return
    handleAutenticate()
  }

  const handleAutenticate = async () => {
    setLoading(true)
    
    const [error, data] = await catchError<Usuario>(() => Autenticacion(nombre, password))

    if (error) {
      setMessageError(error)
      setLoading(false)
      setErrorOpen(true)
      return
    }

    setUsuarioLogeado(data)

    setLoading(false)
    router.push("/sistema/punto_venta")
  }

  return (
    <div className="container-login">
      <form className="login">
        <AccountCircle sx={{ fontSize: 100, color: '#1976d2' }} />
        <TextField
          label="Usuario"
          value={nombre}
          onChange={e => setNombre(e.target.value.trim().toUpperCase())}
          fullWidth={true}
          variant="outlined"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          fullWidth={true}
          label="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyUp={handleKeyUp}
          type={showPassword ? 'text' : 'password'}
          variant="outlined"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Password />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword ? 'hide the password' : 'display the password'
                    }
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            },
          }}
        />

        <Button variant="contained" disabled={loading} onClick={handleAutenticate}>
          {loading ? <CircularProgress size={24} color="inherit" /> : "Iniciar sesión"}
        </Button>
      </form>

      <ErrorAlert mensage={messageError} open={errorOpen} setOpen={setErrorOpen}/>
    </div>
  );
}
