'use server'

import { env } from '@/app/config';
import { Usuario } from '@/interfaces/Usuario';
import { cookies } from 'next/headers';

export const Autenticacion = async (nombre: string, password: string): Promise<Usuario> => {

    const response: Response = await fetch(`${env.host}:${env.port}/usuario/login`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({nombre, password})
    })

    if(!response.ok) {
        const info = await response.json()
        console.log(info.error)
        throw Error(info.error)
    }

    const datos_usuarios = await response.json()

    const cookieStore = await cookies()
    cookieStore.set({
        name: 'tk',
        value: datos_usuarios.Token,
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 60 * 60 * 15,
        path: '/' 
    })

    return datos_usuarios.usuario

}

export const cerrarSesion = async (): Promise<void> => {
    const cookieStore = await cookies()
    cookieStore.delete('tk')
}