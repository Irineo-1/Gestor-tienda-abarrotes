'use server'

import { responseFetch } from "@/interfaces/ResponseFetch";

export const useFetch = async <T> (url: string, content: RequestInit): Promise<responseFetch<T>> => {

    const response: Response = await fetch(url, content)

    const body_response = await response.json()

    return {
        error: (!response.ok) ? body_response.error : "",
        data: body_response,
        status: response.status
    } as responseFetch<T>
}