import { useEffect, useState } from "react";
import { ApiError } from "@/app/configs/errorTypes";
import { axiosInstance } from "@/app/configs/axios";
import { useParams } from "next/navigation";

export interface Partner {
    pan_card_url: string;
    gst_spice_letter_url: string;
    cancelled_cheque_url: string;
}

// export interface ApiResponse {
//     data: Partner;
// }

const useGetByIdPartnersDocs = (): {
    partnerDocs: Partner | null;
    errorMessage: string;
    loading: boolean;
    refetch: () => Promise<void>;
} => {
    const { PartnerId } = useParams() as { PartnerId: string };

    const [loading, setLoading] = useState(false);
    const [partnerDocs, setPartnerDocs] = useState<Partner | null>(null);
    const [errorMessage, setErrorMessage] = useState("");

    const fetchPartnerDoc = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.post<Partner>(`/partners/${PartnerId}/get-docs-url`);
            if (response.status === 201) {
                setPartnerDocs(response.data || null);
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
        if (PartnerId) {
            fetchPartnerDoc();
        }
    }, [PartnerId]);

    return { partnerDocs, errorMessage, loading, refetch: fetchPartnerDoc };
};

export default useGetByIdPartnersDocs;
