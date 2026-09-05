import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { Mutex } from 'async-mutex';
import Cookies from "js-cookie";
import { addToast } from '@heroui/react';
import { API_BASE_URL } from '@/utils/config';
import { isBrowserOnline, NETWORK_MESSAGES } from '@/utils/network';
import { AUTH_COOKIE_NAME, hasAuthCookie } from '@/utils/authCookies';
import {
    endSessionAfterRefreshFailure,
    isSessionEnding,
    refreshAccessToken,
    shouldSkipTokenRefresh,
} from '@/utils/refreshSession';

const mutex = new Mutex();

function isPendingApprovalError(message: string, status?: number): boolean {
    return status === 403 && (message || '').toLowerCase().includes('pending approval');
}

function getRequestUrl(args: string | FetchArgs): string {
    return typeof args === 'string' ? args : args.url ?? '';
}

function unauthorizedQueryError(message: string, httpStatus?: number): FetchBaseQueryError {
    return {
        status: 'CUSTOM_ERROR',
        data: { message, httpStatus },
        error: message,
    };
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
    credentials: 'include',
    prepareHeaders: async (headers) => {
        const token = Cookies.get(AUTH_COOKIE_NAME) || null
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


function getErrorMeta(result: { error?: unknown; data?: unknown }): { message: string; httpStatus?: number } {
    const errorData = result.error as IAPIError & {
        status?: number | string;
        originalStatus?: number;
        data?: { message?: string; http_status_code?: number };
    } | undefined;
    const rawStatus = errorData?.status;
    const status = typeof rawStatus === 'number'
        ? rawStatus
        : (errorData?.originalStatus ?? errorData?.data?.http_status_code);
    const responseData = errorData?.data;
    const message = toToastMessage(responseData?.message ?? responseData, 'Unknown API error');
    const httpStatus = typeof status === 'number' ? status : undefined;
    return { message, httpStatus };
}

function isHttpUnauthorized(status?: number): boolean {
    return status === 401;
}

function shouldAttemptRefresh(httpStatus: number | undefined, url: string): boolean {
    if (isSessionEnding() || shouldSkipTokenRefresh(url)) return false;
    if (!hasAuthCookie()) return false;
    return isHttpUnauthorized(httpStatus);
}

async function refreshAndRetry(
    args: string | FetchArgs,
    api: Parameters<typeof baseQuery>[1],
    extraOptions: Parameters<typeof baseQuery>[2],
    url: string,
): Promise<Awaited<ReturnType<typeof baseQuery>> | 'session-ended' | 'refresh-unavailable'> {
    if (mutex.isLocked()) {
        await mutex.waitForUnlock();
        if (isSessionEnding()) return 'session-ended';
        return baseQuery(args, api, extraOptions);
    }

    const release = await mutex.acquire();
    try {
        const token = await refreshAccessToken(url);
        if (!token) {
            endSessionAfterRefreshFailure();
            return 'session-ended';
        }
        return baseQuery(args, api, extraOptions);
    } catch {
        return 'refresh-unavailable';
    } finally {
        release();
    }
}

//  with all response data
const baseQueryWithAuth: BaseQueryFn<
    string | FetchArgs,
    IAPIResponse,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    await mutex.waitForUnlock();

    if (isSessionEnding()) {
        return { error: unauthorizedQueryError('Session ended') };
    }

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
        let result = await baseQuery(args, api, extraOptions);
        const url = getRequestUrl(args);

        const errorMeta = result.error ? getErrorMeta(result) : null;
        const body = result.data as IAPIResponse | undefined;
        const refreshStatus = errorMeta?.httpStatus ?? body?.http_status_code;
        if (shouldAttemptRefresh(refreshStatus, url)) {
            const retried = await refreshAndRetry(args, api, extraOptions, url);
            if (retried === 'session-ended') {
                return { error: unauthorizedQueryError(errorMeta?.message ?? body?.message ?? '', refreshStatus) };
            }
            if (retried !== 'refresh-unavailable') {
                result = retried;
            }
        }

        if (result.error) {
            const { message, httpStatus } = getErrorMeta(result);

            if (isSessionEnding()) {
                return { error: unauthorizedQueryError(message, httpStatus) };
            }

            if (isHttpUnauthorized(httpStatus) && !hasAuthCookie() && !shouldSkipTokenRefresh(url)) {
                return { error: unauthorizedQueryError(message, httpStatus) };
            }

            if (!isPendingApprovalError(message, httpStatus)) {
                addToast({ title: 'Error', description: message, color: 'danger', timeout: 2000 });
            }
            return {
                error: {
                    status: "CUSTOM_ERROR",
                    data: { message, httpStatus: httpStatus },
                    error: message,
                },
            };
        }

        const res = result.data as IAPIResponse;

        if (res && isPendingApprovalError(res.message, res.http_status_code)) {
            return {
                error: unauthorizedQueryError(res.message, res.http_status_code),
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
        'Wishlist',
        'FollowedMentors',
        'Reviews',
        'UserOrders',
        'UserProfile',
        'AdminProfile',
        'MyChapters',
        'ReadingHistory',
        'AdminUsers',
        'AdminTestimonials',
        'AdminFAQs',
        'GlobalSettings',
        'AdminSubscribers',
        'AdminOrders',
        'AdminContactUs',
        'AdminInstitutions',
        'AdminInstitutionUsage',
        'AdminInstitutionAccess',
        'AdminInstituteMessages',
        'AdminRegistrationPrompt',
        'AdminRoles',
        'AdminPermissions',
        'AdminStaff',
        'AdminAgreementTypes',
        'AdminAgreements',
        'AdminAgreementSentences',
        'UserAgreementSentences',
        'AdminUserConsentStatus',
        'AdminConsentRecords',
        'AdminMentorTiers',
        'AdminMentorApplications',
        'AdminMentorTierUpgradeApplications',
        'MyMentorTierUpgradeApplication',
        'AdminVerifiedMentorApplications',
        'MyVerifiedMentorApplication',
        'AdminFollowers',
        'AdminCoupons',
        'AdminTaxes',
        'Address',
        'WithdrawalLedger',
        'ReferralWalletLedger',
        'WithdrawalRequests',
        'AdminWithdrawals',
        'AdminAuditLogs',
        'AdminReviews',
        'AffiliateReferal',
        'AdminNotifications',
    ],
    endpoints: () => ({}),
});