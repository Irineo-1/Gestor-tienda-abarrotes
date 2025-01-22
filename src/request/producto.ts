import { IProducto } from '@/interfaces/Iproducto';
import { env } from '@/app/config';

export const getProductos = async (): Promise<IProducto[]> => {
    const response: Response = await fetch(`${env.host}:${env.port}/productos`)

    if (!response.ok) throw new Error('Error al obtener los productos')

    const data: IProducto[] = await response.json()
    return data
}