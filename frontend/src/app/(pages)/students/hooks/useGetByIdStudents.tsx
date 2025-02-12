import { useEffect, useState } from "react";
import { ApiError } from "@/app/configs/errorTypes";
import { axiosInstance } from "@/app/configs/axios";
import { useParams } from "next/navigation";
import { Course } from "../../courses/api/filterCourse";

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

export interface current_address {
    id: string;
    country: string;
    address1: string;
    address2: string;
    post_code: string;
    state: string;
    city: string;
}

export interface Education {
    id: number;
    academic_interest_id: number;
    comment: string | null;
    created_at: string;
    updated_at: string;
    academic_history: AcademicHistory[];
    academic_interest: AcademicInterest;
    proficient_languages: ProficientLanguage[];
}

export interface AcademicHistory {
    id: number;
    country: string;
    institution: string;
    course: string;
    level_of_study: string;
    start_date: string;
    end_date: string;
    result_percent: number;
    student_education_id: number;
    created_at: string;
    updated_at: string;
}

export interface AcademicInterest {
    id: number;
    country: string;
    level_of_study: string;
    programme: string;
    intake: string;
    location: string;
    created_at: string;
    updated_at: string;
}

export interface ProficientLanguage {
    id: number;
    name: string;
    level_of_proficiencey: string;
    years_of_experience: number;
    student_education_id: number;
}

export interface RefereeDetails {
    id: number;
    name: string;
    position: string;
    email: string;
    mobile_no: string;
    address: string;
    student_id: number;
}

export interface WorkDetail {
    id: number;
    title: string;
    organisation: string;
    organisation_address: string;
    phone_no: string;
    email: string;
    from_date: string;
    to_date: string;
    student_id: number;
}

export interface TravelImmigration {
    id: number;
    comment: string | null;
    created_at: string;
    updated_at: string;
    has_health_issues: boolean;
    health_issue_details: string;
    need_visa_for_specific_countries: string[];
    stay_permission_in_specific_countries: string | null;
    visa_rejections_for_any_countries: boolean;
}

export interface CourseShortlist {
    id: number;
    course_id: number;
    intake: string;
    course: Course;
    student_id: number;
    created_at: string;
    updated_at: string;
}

export interface Application {
    id: number;
    status: "ONGOING" | "COMPLETED" | "PENDING"; // Adjust status as needed
    name: string;
    level: string;
    intake: string;
    subject: string;
    duration: string;
    awards: string[];
    tution_fee: number;
    requirements: string[];
    course_id: number;
    student_id: number;
    created_at: string;
    updated_at: string;
    course: Course;
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
    current_address?: current_address | null;
    permanent_address?: current_address | null;
    education: Education;
    referee_details: RefereeDetails[];
    work_details: WorkDetail[];
    travel_immigration: TravelImmigration;
    course_shortlist: CourseShortlist[];
    applications: Application[];
    partner: Partner;
}



export interface ApiResponse {
    data: Student;
}

const useGetByIdStudents = (): {
    studentsData: Student | null;
    errorMessage: string;
    loading: boolean;
    refetch: () => Promise<void>;
} => {
    const { StudentId } = useParams();

    const [loading, setLoading] = useState(false);
    const [studentsData, setStudentsData] = useState<Student | null>(null);
    const [errorMessage, setErrorMessage] = useState("");

    const loadStudents = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get<ApiResponse>(`/students/${StudentId}`);
            if (response.status === 200) {
                setStudentsData(response.data?.data || null);
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

    return { studentsData, errorMessage, loading, refetch: loadStudents };
};

export default useGetByIdStudents;
