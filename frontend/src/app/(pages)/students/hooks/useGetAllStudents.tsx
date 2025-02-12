import { useEffect, useState } from "react";
import { ApiError } from "@/app/configs/errorTypes";
import { axiosInstance } from "@/app/configs/axios";

export interface Partner {
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
    pan_card_url: string | null;
    cancelled_cheque_url: string | null;
    gst_spice_letter_url: string | null;
}

export interface Student {
    id: number;
    name: string;
    surname: string;
    email: string;
    phone_no: string;
    dob: string;
    gender: string;
    nationality: string;
    birth_country: string;
    native_language: string;
    passport_issue_location: string;
    passport_number: string;
    issue_date: string;
    expiry_date: string;
    skype_id: string;
    alternate_phone_no: string;
    is_permanent_current_same: boolean | null;
    permanent_address_id: number;
    current_address_id: number;
    emergency_contact_name: string;
    emergency_contact_no: string;
    emergency_contact_email: string;
    emergency_contact_relation: string;
    emergency_contact_address: string;
    status: string;
    tab_status: string;
    partner_id: number;
    comment: string | null;
    referee_details_comments: string | null;
    work_details_comments: string | null;
    created_at: string;
    updated_at: string;
    partner: Partner;
}

export interface ApiResponse {
    data: Student[];
}

const useGetAllStudents = (): {
    studentsData: Student[];
    errorMessage: string;
    loading: boolean;
} => {
    const [loading, setLoading] = useState(false);
    const [studentsData, setStudentsData] = useState<Student[]>([]);
    const [errorMessage, setErrorMessage] = useState("");

    const loadStudents = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get<ApiResponse>("/students");
            if (response.status === 200) {
                setStudentsData(response.data?.data || []);
                setErrorMessage("");
            }
        } catch (error) {
            const apiError = error as ApiError;

            if (apiError.response) {
                const { status } = apiError.response;
                switch (status) {
                    case 401:
                        setErrorMessage("Unauthorized access. Please log in.");
                        break;
                    case 403:
                        setErrorMessage("No Permission");
                        break;
                    case 404:
                        setErrorMessage("No Data Found");
                        break;
                    default:
                        setErrorMessage(
                            apiError.response.data?.message ||
                            "An unexpected error occurred."
                        );
                }
            } else if (apiError.request) {
                setErrorMessage("No response from the server. Please try again.");
            } else {
                setErrorMessage("Failed to load data. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStudents();
    }, []);

    return { studentsData, errorMessage, loading };
};

export default useGetAllStudents;
