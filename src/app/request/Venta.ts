import { IVenta, IVenta_gp_codigo } from "../interfaces/IVenta";
import { env } from '../config';

export const addVenta = async (venta: IVenta): Promise<void> => {

    const response: Response = await fetch(`${env.host}:${env.port}/venta`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(venta)
    })

    if(!response.ok) throw new Error('Error al Insertar la venta')
}

export const getVentas = async (date: string): Promise<IVenta_gp_codigo[]> => {
    const response: Response = await fetch(`${env.host}:${env.port}/venta/${date}`)

    if(!response.ok) throw new Error('Error al Insertar la venta')

    const data = await response.json()

    return data
}