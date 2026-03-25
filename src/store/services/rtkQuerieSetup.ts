import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { Mutex } from 'async-mutex';
import Cookies from "js-cookie";
import { addToast } from '@heroui/react';
import { API_BASE_URL } from '@/utils/config';

const mutex = new Mutex();

interface IAPIResponse<T = unknown> {
    http_status_code: number;
    status: boolean;
    data: T;
    timestamp: string;
    message: string;
}

interface IAPIError {
    data: {
        message?: string;
    };
    error?: string;
}

const baseQuery = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: async (headers) => {
        const token = Cookies.get("auth_token") || null
        const deviceId = Cookies.get("device") || ''
        const userId = Cookies.get("userID") || ''
        // headers.set('clientid', API_CLIENT_ID);
        // headers.set('clientsecret', API_CLIENT_SECRET);
        headers.set('device', deviceId);
        headers.set('userID', userId);
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});


//  with all response data
const baseQueryWithAuth: BaseQueryFn<
    string | FetchArgs,
    IAPIResponse,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    await mutex.waitForUnlock();
    try {
        const result = await baseQuery(args, api, extraOptions);
        const res = result.data as IAPIResponse;
        if (result.error) {
            const errorData = result.error as IAPIError & { status?: number; data?: { data?: { flow?: string }; message?: string } };
            const status = errorData?.status;
            const responseData = errorData?.data;
            const message = (responseData as { message?: string })?.message || "Unknown API error";
            // Suppress silent background errors (401, 403, 404) but show all other errors to the user
            // const SILENT_STATUSES = [401, 403, 404];
            // const shouldShowToast = !status || !SILENT_STATUSES.includes(status);
            // if (shouldShowToast) {
                addToast({ title: "Error", description: responseData?.message ?? "Unknown error", color: "danger", timeout: 2000 });
            // }
            return {
                error: {
                    status: "CUSTOM_ERROR",
                    data: { message, httpStatus: status },
                    error: message,
                },
            };
        } else {
            return { data: res };
        }

    } catch (error: unknown) {
        let errorResponse: FetchBaseQueryError;
        if (error instanceof Error) {
            errorResponse = {
                status: "CUSTOM_ERROR",
                data: { message: error.message },
                error: error.message,
            };

            addToast({ title: "Error", description: errorResponse?.error ?? "An unexpected error occurred", color: "danger", timeout: 2000 })
        } else {
            errorResponse = {
                status: "CUSTOM_ERROR",
                data: { message: "An unexpected error occurred" },
                error: "Unknown error",
            };
        }

        return { error: errorResponse };
    }
};



export const rtkQuerieSetup = createApi({
    reducerPath: 'RTKServices',
    baseQuery: baseQueryWithAuth,
    tagTypes: [
        'AdminCategories',
        'AdminAuthorLeaders',
        'AdminBooks',
        'AdminChapters',
        'SingleChapter',
        'AllChapters',
        'Cart',
        'UserProfile',
        'AdminProfile',
        'MyChapters',
        'ReadingHistory',
        'AdminUsers',
        'AdminTestimonials',
        'AdminFAQs',
        'GlobalSettings',
    ],
    endpoints: () => ({}),
});