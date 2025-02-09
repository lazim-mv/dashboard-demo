import { useEffect, useState } from "react";
import { ApiError } from "@/app/configs/errorTypes";
import { axiosInstance } from "@/app/configs/axios";
import { useParams } from "next/navigation";

export interface Lead {
    id: number;
    url_id: string;
    name: string;
    phone_no: string;
    email: string;
    company: string;
    lead_status: string;
    source_id: string | null;
    created_at: string;
    updated_at: string;
}

export interface ApiResponse {
    data: Lead;
}

const useGetByIdLeads = (): {
    leadData: Lead | null;
    errorMessage: string;
    loading: boolean;
    refetch: () => Promise<void>;
} => {
    const { LeadId } = useParams() as { LeadId: string };

    const [loading, setLoading] = useState(false);
    const [leadData, setLeadData] = useState<Lead | null>(null);
    const [errorMessage, setErrorMessage] = useState("");

    const fetchLeadData = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get<ApiResponse>(`/partners/leads/${LeadId}`);
            if (response.status === 200) {
                setLeadData(response.data?.data || null);
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
                        setErrorMessage("No Permission.");
                        break;
                    case 404:
                        setErrorMessage("No Data Found.");
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
        if (LeadId) {
            fetchLeadData();
        }
    }, [LeadId]);

    return { leadData, errorMessage, loading, refetch: fetchLeadData };
};

export default useGetByIdLeads;
