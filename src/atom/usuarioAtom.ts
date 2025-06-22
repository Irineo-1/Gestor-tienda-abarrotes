import { Usuario } from "@/interfaces/Usuario"
import { atom } from "jotai"

export const UsuarioLogeado = atom<Usuario>({} as Usuario)