export interface Producto {
    id: number
    nombre: string
    typo: string
    precio: number
    gramaje: number
    cantidad_contable: number
}

export interface Producto_selected {
    nombre: string
    typo: string
    precio: number
    gramos: number
    cantidad: number
}