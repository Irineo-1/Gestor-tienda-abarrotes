'use server'

import { env } from '@/app/config';
import { cookies } from 'next/headers';

export const Autenticacion = async (usuario: string, password: string): Promise<void> => {
    const response: Response = await fetch(`${env.host}:${env.port}/usuario/login`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({usuario, password})
    })

    if(!response.ok) throw Error("algo salio mal")

    const token = await response.json()
    
    const cookieStore = await cookies()
    cookieStore.set({
        name: 'tk',
        value: token.Token,
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 60 * 60 * 15,
        path: '/' 
    })
}

export const cerrarSesion = async (): Promise<void> => {
    const cookieStore = await cookies()
    cookieStore.delete('tk')
}