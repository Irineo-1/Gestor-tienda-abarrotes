'use server'

import { IProducto } from '@/interfaces/Iproducto';
import { env } from '@/app/config';
import { cookies } from 'next/headers';

export const getProductos = async (): Promise<IProducto[]> => {

    const token = (await cookies()).get('tk')?.value
    
    const response: Response = await fetch(`${env.host}:${env.port}/productos`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    if (!response.ok) throw new Error('Error al obtener los productos')

    const data: IProducto[] = await response.json()
    return data
}

export const addProductos = async (data: IProducto): Promise<{id: number}> => {

    const token = (await cookies()).get('tk')?.value

    const response: Response = await fetch(`${env.host}:${env.port}/productos`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        method: "POST",
        body: JSON.stringify(data)
    })

    if (!response.ok) throw new Error('Error al obtener los productos')

    const id_row: {id: number} = await response.json()
    return id_row
}

export const deleteProducto = async (id: number): Promise<void> => {

    const token = (await cookies()).get('tk')?.value

    const response: Response = await fetch(`${env.host}:${env.port}/productos/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        method: "DELETE"
    })

    if (!response.ok) throw new Error('Error al obtener los productos')
}

export const updateProducto = async (producto: IProducto): Promise<void> => {

    const token = (await cookies()).get('tk')?.value

    const response: Response = await fetch(`${env.host}:${env.port}/productos`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        method: "PUT",
        body: JSON.stringify(producto)
    })

    if (!response.ok) throw new Error('Error al obtener los productos')
}