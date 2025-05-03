export interface Usuario {
    id?: number
    usuario: string
    typo: string
    password?: string
}

export interface TipoUsuario {
    id: number
    typo: string
}