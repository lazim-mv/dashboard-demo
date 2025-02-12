// src/types/api-error.ts
export interface ApiErrorResponse {
    status: number;
    message: string;
}

export interface ApiError extends Error {
    response?: {
        status: number;
        data?: {
            message?: string;
        };
    };
    request?: XMLHttpRequest;
}

export function handleApiError(error: ApiError): string {
    if (error.response) {
        const { status } = error.response;
        switch (status) {
            case 401:
                return "Unauthorized access. Please log in.";
            case 403:
                return "No Permission";
            case 404:
                return "No Data Found";
            case 500:
                return "Internal Server Error";
            default:
                return error.response.data?.message || "An unexpected error occurred.";
        }
    } else if (error.request) {
        return "No response from the server. Please try again.";
    } else {
        return "Failed to load data. Please try again.";
    }
}