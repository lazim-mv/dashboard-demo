import { axiosInstance } from "@/app/configs/axios"; import { AxiosError } from "axios";

interface FetchPartnersParams {
    take?: number;
    skip?: number;
    route: string;
}

interface Partner {
    key: string;
    first_name: string;
    mobile_no: string;
    email: string;
    company_name: string;
    source: string;
    address: string;
    status: string;
    tags: string[];
}

interface FetchPartnersResponse {
    data: Partner[];
    hasMore: boolean;
    total: number;
}

// Define a custom error type for API errors
export interface ApiError {
    message: string;
    code?: string;
    status?: number;
}

export const fetchPartners = async ({
    route,
    take,
    skip,
}: FetchPartnersParams): Promise<FetchPartnersResponse> => {
    try {
        const response = await axiosInstance.get<FetchPartnersResponse>(`${route}`, {
            params: {
                take,
                skip,
            },
        });

        if (!response.data) {
            throw new Error('No data received from server');
        }

        return response.data;
    } catch (error) {
        console.log(error, "errorr");
        if (error instanceof AxiosError) {
            const apiError: ApiError = {
                message: error.response?.data?.message || error.message,
                status: error.response?.status,
                code: error.code
            };
            console.error("Error fetching partners:", apiError);
            throw apiError;
        }


        const unknownError: ApiError = {
            message: error instanceof Error ? error.message : 'An unknown error occurred'
        };
        console.error("Error fetching partners:", unknownError);
        throw unknownError;
    }
};