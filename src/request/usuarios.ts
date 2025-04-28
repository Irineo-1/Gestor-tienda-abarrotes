'use server'

import { Usuario } from "@/interfaces/Usuario"
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