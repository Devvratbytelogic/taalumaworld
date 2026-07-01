import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { Mutex } from 'async-mutex';
import Cookies from "js-cookie";
import { addToast } from '@heroui/react';
import { API_BASE_URL } from '@/utils/config';
import { isBrowserOnline, isFetchNetworkError, NETWORK_MESSAGES } from '@/utils/network';
import { hasAuthCookie, isUnauthorizedError, logoutAndRedirectToHome } from '@/utils/authCookies';

const mutex = new Mutex();
let isLoggingOut = false;

/** Clear session and redirect when an authenticated request returns 401 / invalid token. */
function handleUnauthorizedSession(message: string, status?: number): boolean {
    if (!hasAuthCookie() || !isUnauthorizedError(message, status)) return false;
    if (isLoggingOut) return true;
    isLoggingOut = true;
    logoutAndRedirectToHome();
    return true;
}

interface IAPIResponse<T = unknown> {
    http_status_code: number;
    status: boolean;
    data: T;
    timestamp: string;
    message: string;
}

interface IAPIError {
    data: {
        message?: unknown;
    };
    error?: string;
}

/** HeroUI toast descriptions must be strings — API errors may return nested objects. */
function toToastMessage(value: unknown, fallback = 'Unknown error'): string {
    if (typeof value === 'string' && value.trim()) return value;
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);
    if (value && typeof value === 'object') {
        const obj = value as Record<string, unknown>;
        for (const key of ['message', 'response', 'error', 'description']) {
            const extracted = toToastMessage(obj[key], '');
            if (extracted) return extracted;
        }
    }
    return fallback;
}

const REQUEST_TIMEOUT_MS = 30_000;

const baseQuery = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    timeout: REQUEST_TIMEOUT_MS,
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

    if (!isBrowserOnline()) {
        const message = NETWORK_MESSAGES.requestFailedOffline;
        return {
            error: {
                status: 'FETCH_ERROR',
                error: message,
            },
        };
    }

    try {
        const result = await baseQuery(args, api, extraOptions);
        const res = result.data as IAPIResponse;
        if (result.error) {
            const errorData = result.error as IAPIError & { status?: number; data?: { data?: { flow?: string }; message?: string; http_status_code?: number } };
            const status = errorData?.status ?? errorData?.data?.http_status_code;
            const responseData = errorData?.data;
            const message = toToastMessage(responseData?.message ?? responseData, 'Unknown API error');
            const httpStatus = typeof status === 'number' ? status : undefined;

            if (handleUnauthorizedSession(message, httpStatus)) {
                return {
                    error: {
                        status: 'CUSTOM_ERROR',
                        data: { message, httpStatus },
                        error: message,
                    },
                };
            }

            addToast({ title: 'Error', description: message, color: 'danger', timeout: 2000 });
            return {
                error: {
                    status: "CUSTOM_ERROR",
                    data: { message, httpStatus: status },
                    error: message,
                },
            };
        }

        if (res && hasAuthCookie() && isUnauthorizedError(res.message, res.http_status_code)) {
            handleUnauthorizedSession(res.message, res.http_status_code);
            return {
                error: {
                    status: 'CUSTOM_ERROR',
                    data: { message: res.message, httpStatus: res.http_status_code },
                    error: res.message,
                },
            };
        }

        return { data: res };

    } catch (error: unknown) {
        let errorResponse: FetchBaseQueryError;
        if (error instanceof Error) {
            errorResponse = {
                status: "CUSTOM_ERROR",
                data: { message: error.message },
                error: error.message,
            };

            addToast({
                title: 'Error',
                description: toToastMessage(errorResponse?.error, 'An unexpected error occurred'),
                color: 'danger',
                timeout: 2000,
            });
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
        'AdminSubscribers',
        'AdminBookOrders',
        'AdminBlueprintOrders',
        'AdminInstitutions',
        'AdminInstitutionUsage',
        'AdminRegistrationPrompt',
        'AdminRoles',
        'AdminPermissions',
        'AdminStaff',
    ],
    endpoints: () => ({}),
});