import { Producto } from '@/app/interfaces/producto';

export const getProductos = async (): Promise<Producto[]> => {
    const response: Response = await fetch('http://127.0.0.1:8000/productos')

    if (!response.ok) throw new Error('Error al obtener los productos')

    const data: Producto[] = await response.json()
    return data
}