'use server'

import { TipoUsuario, Usuario } from "@/interfaces/Usuario"
import { env } from '@/app/config'
import { cookies } from 'next/headers'

export const getUsuarios = async (): Promise<Usuario[]> => {

    const token = (await cookies()).get('tk')?.value

    const response: Response = await fetch(`${env.host}:${env.port}/usuario`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    if (!response.ok) throw new Error('Error al obtener los Usuarios')

    const data: Usuario[] = await response.json()
    return data
}

export const getTiposUsuarios = async (): Promise<TipoUsuario[]> => {

    const token = (await cookies()).get('tk')?.value

    const response: Response = await fetch(`${env.host}:${env.port}/usuario/typos`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    if (!response.ok) throw new Error('Error al obtener los Typos')

    const data: TipoUsuario[] = await response.json()
    return data

}

export const addNuevoUsuario = async (usuario: Usuario) => {
    const token = (await cookies()).get('tk')?.value

    const response: Response = await fetch(`${env.host}:${env.port}/usuario/`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        method: "POST",
        body: JSON.stringify(usuario)
    })

    if (!response.ok) throw new Error('Error al insertar usuario')

}