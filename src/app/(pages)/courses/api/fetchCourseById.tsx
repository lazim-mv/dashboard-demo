"use client"
import { useState, useEffect, useCallback } from 'react';
import { axiosInstance } from '@/app/configs/axios';
import { AxiosError } from 'axios';

export interface Course {
    id: number;
    name: string;
    level: string;
    intake: string[];
    subject: string;
    duration: string;
    awards: string[];
    document_url: string | null;
    tution_fee: string;
    requirements: string[];
    university_id: number;
    created_at: string;
    updated_at: string;
}

export interface ApiError {
    message: string;
    status?: number;
    code?: string;
}

export const useCourseById = (courseId?: string) => {
    const [course, setCourse] = useState<Course | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<ApiError | null>(null);

    const fetchCourse = useCallback(async () => {
        // Reset states before fetching
        setIsLoading(true);
        setError(null);

        // Early return if no courseId
        if (!courseId) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await axiosInstance.get<{
                statusCode: number;
                message: string;
                data: Course;
            }>(`/course/${courseId}`);

            if (response.data.statusCode !== 200) {
                throw new Error(response.data.message || "Failed to fetch course");
            }

            setCourse(response.data.data);
        } catch (err) {
            let apiError: ApiError;

            if (err instanceof AxiosError) {
                apiError = {
                    message: err.response?.data?.message || err.message,
                    status: err.response?.status,
                    code: err.code,
                };
            } else {
                apiError = {
                    message: err instanceof Error ? err.message : "An unknown error occurred"
                };
            }

            setError(apiError);
            console.error("Course fetch error:", apiError);
        } finally {
            setIsLoading(false);
        }
    }, [courseId]);

    // Use useCallback to memoize refetch function
    const refetch = useCallback(() => {
        fetchCourse();
    }, [fetchCourse]);

    // Use effect with proper dependencies
    useEffect(() => {
        fetchCourse();
    }, [fetchCourse]);

    return {
        course,
        isLoading,
        error,
        refetch
    };
};

// Uncomment and modify for server-side fetching if needed
export async function fetchCourseServer(courseId: string) {
    try {
        const response = await axiosInstance.get<{
            statusCode: number;
            message: string;
            data: Course;
        }>(`/course/${courseId}`);

        if (response.data.statusCode !== 200) {
            throw new Error(response.data.message || "Failed to fetch course");
        }

        return response.data.data;
    } catch (error) {
        console.error('Server-side course fetch error:', error);
        return null;
    }
}