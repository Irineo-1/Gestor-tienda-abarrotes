import { IProducto } from '@/interfaces/Iproducto';
import { env } from '@/app/config';

export const getProductos = async (): Promise<IProducto[]> => {
    const response: Response = await fetch(`${env.host}:${env.port}/productos`)

    if (!response.ok) throw new Error('Error al obtener los productos')

    const data: IProducto[] = await response.json()
    return data
}

export const addProductos = async (data: IProducto): Promise<{id: number}> => {
    const response: Response = await fetch(`${env.host}:${env.port}/productos`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(data)
    })

    if (!response.ok) throw new Error('Error al obtener los productos')

    const id_row: {id: number} = await response.json()
    return id_row
}

export const deleteProducto = async (id: number): Promise<void> => {
    const response: Response = await fetch(`${env.host}:${env.port}/productos/${id}`, {
        method: "DELETE"
    })

    if (!response.ok) throw new Error('Error al obtener los productos')
}

export const updateProducto = async (producto: IProducto): Promise<void> => {
    console.log({producto})
    const response: Response = await fetch(`${env.host}:${env.port}/productos`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: "PUT",
        body: JSON.stringify(producto)
    })

    if (!response.ok) throw new Error('Error al obtener los productos')
}