import { useEffect, useState } from "react";
import { axiosInstance } from "@/app/configs/axios";import { ApiError } from "@/app/configs/errorTypes";

interface UserDataType {
    id: number;
    email: string;
    name: string;
    user_roles: { role: { name: string } }[];
}

interface UseLoadPartnersResult {
    userData: UserDataType[];
    errorMessage: string;
    loading: boolean;
}

const useLoadPartners = (): UseLoadPartnersResult => {
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState<UserDataType[]>([]);
    const [errorMessage, setErrorMessage] = useState("");

    const loadPartners = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get("/partners/administration/users");
            if (response.status === 200) {
                setUserData(response?.data?.data || []);
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

    return { userData, errorMessage, loading };
};

export default useLoadPartners;