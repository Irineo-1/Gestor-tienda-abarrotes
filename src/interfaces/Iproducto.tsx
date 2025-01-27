export interface IProducto {
    id: number
    nombre: string
    typo: string
    precio: number
    gramaje: number
    cantidad_contable: number
    codigo_barras: string
}

export interface IProducto_selected {
    nombre: string
    typo: string
    precio: number
    gramos: number
    cantidad: number
}