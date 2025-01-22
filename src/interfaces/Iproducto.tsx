export interface IProducto {
    id: number
    nombre: string
    typo: string
    precio: number
    gramaje: number
    cantidad_contable: number
}

export interface IProducto_selected {
    nombre: string
    typo: string
    precio: number
    gramos: number
    cantidad: number
}