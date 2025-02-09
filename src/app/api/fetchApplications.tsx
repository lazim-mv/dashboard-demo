import { axiosInstance } from "@/app/configs/axios"; import { AxiosError } from "axios";
import { Student } from "../(pages)/students/hooks/useGetByIdStudents";
import { Course } from "../(pages)/courses/api/fetchCourseById";

interface FetchApplicationsParams {
    take?: number;
    skip?: number;
    route: string;
}

interface Application {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    mobile_no: string;
    status: string;
    whatsapp_no: string;
    company_name: string;
    website: string;
    address: string;
    city: string;
    post_code: string;
    country: string;
    can_upload_docs: boolean;
    resubmit_note: string | null;
    pan_card_url: string;
    cancelled_cheque_url: string;
    gst_spice_letter_url: string;
    student: Student;
    course: Course;
}

interface FetchApplicationsResponse {
    data: {
        data: Application[];
        hasMore: boolean;
        total: number;
    };
}

// Define a custom error type for API errors
export interface ApiError {
    message: string;
    code?: string;
    status?: number;
}

export const fetchApplications = async ({
    route,
    take,
    skip,
}: FetchApplicationsParams): Promise<FetchApplicationsResponse> => {
    try {
        const response = await axiosInstance.get<FetchApplicationsResponse>(`${route}`, {
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