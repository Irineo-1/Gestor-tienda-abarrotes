export interface IProducto {
    id: number
    nombre: string
    typo: number
    precio: number
    gramaje: number
    cantidad_contable: number
    codigo_barras: string
}

export interface IProducto_selected {
    id: number
    nombre: string
    typo: number
    precio: number
    gramos: number
    pesage?: string
    cantidad: number
    stock?: number
}

export const TIPO_PRODUCTO = {
    CONTABLE: 1,
    GRAMAJE: 2,
    GENERICO: 3
} as const;