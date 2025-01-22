import { IProducto_selected } from "./Iproducto";

export interface ICurrent_venta {
    productos: IProducto_selected[]
    pago: number
}

export interface IVenta {
    nombre: string
    cantidad: number
    typo: number
    gramaje: number
    precio_acumulado: number
}

export interface IVenta_gp_codigo {
    codigo_venta: string
    fecha: string
    productos: string
}