import { useEffect, useState } from "react";
import { ApiError } from "@/app/configs/errorTypes";
import { axiosInstance } from "@/app/configs/axios";
import { useParams } from "next/navigation";

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

export interface ApiResponse {
    data: Partner;
}

const useGetByIdPartners = (): {
    partnerData: Partner | null;
    errorMessage: string;
    loading: boolean;
    refetch: () => Promise<void>;
} => {
    const { PartnerId } = useParams() as { PartnerId: string };

    const [loading, setLoading] = useState(false);
    const [partnerData, setPartnerData] = useState<Partner | null>(null);
    const [errorMessage, setErrorMessage] = useState("");

    const fetchPartnerData = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get<ApiResponse>(`/partners/${PartnerId}`);
            if (response.status === 200) {
                setPartnerData(response.data?.data || null);
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
            fetchPartnerData();
        }
    }, [PartnerId]);

    return { partnerData, errorMessage, loading, refetch: fetchPartnerData };
};

export default useGetByIdPartners;
