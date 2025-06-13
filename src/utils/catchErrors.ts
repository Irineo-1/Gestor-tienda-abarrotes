export const catchError = async <T>(fun: () => Promise<T>): Promise<[error: string, data: T]> => {

    try {
        let response = await fun()
        return ["", response];
    }
    catch(err) {
        return [err as string, null as T];
    }
}