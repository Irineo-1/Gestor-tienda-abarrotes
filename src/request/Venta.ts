'use server'

import { IVenta, IVenta_gp_codigo, ICurrent_venta } from "../interfaces/IVenta";
import { env } from '@/app/config';
import { responseFetch } from "@/interfaces/ResponseFetch";
import { cookies } from 'next/headers';

export const addVenta = async (venta: ICurrent_venta): Promise<responseFetch<string>> => {

    const token = (await cookies()).get('tk')?.value

    const response: Response = await fetch(`${env.host}:${env.port}/venta`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        method: 'POST',
        body: JSON.stringify(venta)
    })

    const body_response = await response.json()

    return {
        error: (!response.ok) ? body_response.error : "",
        data: body_response,
        status: response.status
    } as responseFetch<string>

    // if(!response.ok) throw new Error('Error al Insertar la venta')
}

export const getVentas = async (date: string): Promise<IVenta_gp_codigo[]> => {

    const token = (await cookies()).get('tk')?.value

    const response: Response = await fetch(`${env.host}:${env.port}/venta/${date}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    if(!response.ok) throw new Error('Error al Insertar la venta')

    const data = await response.json()

    return data
}