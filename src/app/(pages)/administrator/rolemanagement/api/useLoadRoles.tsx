import { useEffect, useState } from "react";
import { axiosInstance } from "@/app/configs/axios";
import { ApiError } from "@/app/configs/errorTypes";

export interface Permission {
    id: number;
    type: string;
    resource: string;
    actions: string[];
    created_at: string;
    updated_at: string;
    role_id: number;
}

interface UserRoles {
    id: number;
    name: string;
    permissions: Permission[];
    partner_id: number;
}

interface UseLoadPartnersResult {
    rolesData: UserRoles[];
    errorMessage: string;
    loading: boolean;
}

const useLoadRoles = (): UseLoadPartnersResult => {
    const [loading, setLoading] = useState(false);
    const [rolesData, setrolesData] = useState<UserRoles[]>([]);
    const [errorMessage, setErrorMessage] = useState("");

    const loadPartners = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get("/partners/administration/roles");
            if (response.status === 200) {
                setrolesData(response?.data?.data || []);
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
        loadPartners();
    }, [])

    return { rolesData, errorMessage, loading };
};

export default useLoadRoles;