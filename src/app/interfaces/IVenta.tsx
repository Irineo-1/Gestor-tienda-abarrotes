import { IProducto_selected } from "./Iproducto";

export interface IVenta {
    productos: IProducto_selected[]
    pago: number
}