import { axiosInstance } from '@/app/configs/axios';
import { AxiosError } from 'axios';

export interface Course {
    id: number;
    name: string;
    level: string;
    intake: string[];
    subject: string;
    duration: string;
    awards: string[];
    document_url: string | null;
    tution_fee: string;
    requirements: string[];
    university:
    {
        country: string,
        location: string,
        document_url?: string,
        name?: string,
        logo_url?: string
    };
    university_id: number;
    created_at: string;
    updated_at: string;
}

// Meta type for pagination
export interface Meta {
    total: number;
    skip: number;
    take: number;
}

// API response type for courses
export interface CoursesResponse {
    statusCode: number;
    message: string;
    data: {
        courses: Course[];
        meta: Meta;
    };
}

// Fetch courses parameters
export interface FetchCoursesParams {
    query?: string;
    country?: string;
    location?: string;
    intake?: string;
    level?: string;
    subject?: string;
    universityId?: string;
    orderBy?: string;
    take?: number;
    skip?: number;
}

// Error type for API errors
export interface ApiError {
    message: string;
    status?: number;
    code?: string;
}

// Fetch courses function
export const filterCourse = async ({
    query = '',
    country = '',
    location = '',
    intake = '',
    level = '',
    subject = '',
    universityId = '',
    orderBy = 'asc',
    take = 10,
    skip = 0,
}: FetchCoursesParams = {}): Promise<CoursesResponse> => {
    try {
        // Prepare params, removing empty strings
        const params = {
            ...(query && { query }),
            ...(country && { country }),
            ...(location && { location }),
            ...(intake && { intake }),
            ...(level && { level }),
            ...(subject && { subject }),
            ...(universityId && { universityId }),
            orderBy,
            take,
            skip,
        };

        const response = await axiosInstance.get<CoursesResponse>("/course/filter", {
            params,
            paramsSerializer: {
                indexes: null
            }
        });

        if (!response.data) {
            throw new Error("No data received from server");
        }

        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            const apiError: ApiError = {
                message: error.response?.data?.message || error.message,
                status: error.response?.status,
                code: error.code,
            };
            console.error("Error fetching courses:", apiError);
            throw apiError;
        }

        const unknownError: ApiError = {
            message: error instanceof Error ? error.message : "An unknown error occurred",
        };
        console.error("Error fetching courses:", unknownError);
        throw unknownError;
    }
};