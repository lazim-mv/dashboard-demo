import { useEffect, useState, useCallback } from "react";
import { axiosInstance } from "@/app/configs/axios";import { ApiError } from "@/app/configs/errorTypes";

export interface University {
    id: number;
    university_name: string;
    country: string;
    location: string;
    description: string;
    document_url?: string | null;
    logo_url?: string | null;
    created_at?: string;
    updated_at?: string;
}

interface Universities {
    data: University[];
}

const useLoadUniversities = () => {
    const [loading, setLoading] = useState(false);
    const [universityData, setUniversitiesData] = useState<University[]>([]);
    const [errorMessage, setErrorMessage] = useState("");

    const loadUniversities = useCallback(async () => {
        setLoading(true);
        setErrorMessage("");

        try {
            const response = await axiosInstance.get<Universities>("/university");
            if (response.status === 200) {
                setUniversitiesData(response?.data?.data || []);
            }
        } catch (error) {
            const apiError = error as ApiError;

            const errorMessages: Record<number, string> = {
                401: "Unauthorized access. Please log in.",
                403: "No Permission",
                404: "No Data Found",
            };

            if (apiError.response) {
                const { status } = apiError.response;
                setErrorMessage(
                    errorMessages[status] ||
                    apiError.response.data?.message ||
                    "An unexpected error occurred."
                );
            } else if (apiError.request) {
                setErrorMessage("No response from the server. Please try again.");
            } else {
                setErrorMessage("Failed to load data. Please try again.");
            }

            setUniversitiesData([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUniversities();
    }, [loadUniversities]);

    return {
        universityData,
        errorMessage,
        loading,
        refetch: loadUniversities
    };
};

export default useLoadUniversities;