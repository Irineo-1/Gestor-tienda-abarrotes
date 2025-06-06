export interface responseFetch<T> {
    error: string
    data: T
    status: number
}