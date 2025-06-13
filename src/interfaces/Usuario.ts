export interface Usuario {
    id?: number
    usuario: string
    typo_valor: string
    typo_identificador: number
    password?: string
}

export interface TipoUsuario {
    id: number
    typo: string
}