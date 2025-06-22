export const catchError = async <T>(fun: () => Promise<T>): Promise<[error: string, data: T]> => {

    try {
        let response = await fun()
        return ["", response];
    }
    catch(err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        return [errorMessage, null as T];
    }
}