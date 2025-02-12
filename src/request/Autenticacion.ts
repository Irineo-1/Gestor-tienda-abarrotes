import { env } from '@/app/config';

export const Autenticacion = async (usuario: string, password: string): Promise<string> => {
    const response: Response = await fetch(`${env.host}:${env.port}/usuario/login`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({usuario, password})
    })

    if(!response.ok) throw Error("algo salio mal")

    const token = await response.json()

    return token.Token ?? ""
}