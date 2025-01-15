import { Producto } from '@/app/interfaces/Iproducto';
import { env } from '../config';

export const getProductos = async (): Promise<Producto[]> => {
    const response: Response = await fetch(`${env.host}:${env.port}/productos`)

    if (!response.ok) throw new Error('Error al obtener los productos')

    const data: Producto[] = await response.json()
    return data
}