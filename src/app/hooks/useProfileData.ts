import { useEffect, useState } from "react";
import { axiosInstance } from "../configs/axios";

interface UserRole {
    name: string;
    permissions: string[];
}

interface ProfileData {
    id: number;
    email: string;
    parent_role: string;
    partner_id: number | null;
    user_roles: UserRole[];
}

export const useProfileData = () => {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem("access_token");
                if (!token) {
                    setError("No access token found");
                    setLoading(false);
                    return;
                }

                const response = await axiosInstance.get<ProfileData>("/auth/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                setProfile(response.data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    return { profile, loading, error };
};
