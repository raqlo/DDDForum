import axios, {AxiosError, type AxiosRequestConfig, type AxiosResponse} from "axios";

interface SuccessResponse<T> {
    data: T;
    success: true;
}

interface ErrorResponse<T> {
    error: T;
    success: false;
}

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

async function apiHandler<TSuccess, TError>(
    url: string,
    config?: AxiosRequestConfig
): Promise<AxiosResponse<SuccessResponse<TSuccess>>> {
    try {
        return await axiosInstance<SuccessResponse<TSuccess>>(url, config);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw error as AxiosError<ErrorResponse<TError>>;
        }
        throw error;
    }
}

export { axiosInstance, apiHandler };
export type { SuccessResponse, ErrorResponse };