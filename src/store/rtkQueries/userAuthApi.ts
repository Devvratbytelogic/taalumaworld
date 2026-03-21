import { rtkQuerieSetup } from '../services/rtkQuerieSetup';

export interface LoginPayload {
    email: string;
    password: string;
}

// Pass as FormData — fields: name, email, password, password_confirmation, profile_pic (File)
export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    profile_pic?: File;
}

export interface ForgotPasswordPayload {
    user_id: string;
}

export interface ResetPasswordPayload {
    email: string;
    code: string;
    password: string;
    password_confirmation: string;
}

export interface ResetPasswordArg {
    email: string;
    code: string;
    password: string;
    password_confirmation: string;
    token: string;
}

// type: "account" → verify a newly registered user
// type: "verify"  → verify for password-reset / other flows
export interface VerifyOtpPayload {
    email: string;
    code: string;
    type: "account" | "verify";
}

export interface ResendOtpPayload {
    email: string;
}

export interface ChangePasswordPayload {
    current_password: string;
    password: string;
    password_confirmation: string;
}

export const userAuthApi = rtkQuerieSetup.injectEndpoints({
    endpoints: builder => ({
        userLogin: builder.mutation<unknown, LoginPayload>({
            query: (userData) => ({
                url: `/user/login`,
                method: "POST",
                body: userData,
            }),
        }),

        // Sends multipart/form-data — pass a FormData instance as userData
        userRegister: builder.mutation<unknown, FormData>({
            query: (userData) => ({
                url: `/user/register`,
                method: "POST",
                body: userData,
            }),
        }),

        userForgotPassword: builder.mutation<unknown, ForgotPasswordPayload>({
            query: (userData) => ({
                url: `/user/forgot-password`,
                method: "POST",
                body: userData,
            }),
        }),

        userResetPassword: builder.mutation({
            query: ({ token, payload }) => ({
                url: `/user/new-password`,
                method: "POST",
                body: payload,
                headers: { Authorization: `Bearer ${token}` },
            }),
        }),

        userVerifyOtp: builder.mutation<unknown, VerifyOtpPayload>({
            query: (userData) => ({
                url: `/user/verify`,
                method: "POST",
                body: userData,
            }),
        }),

        userResendOtp: builder.mutation<unknown, ResendOtpPayload>({
            query: (userData) => ({
                url: `/user/resend-code`,
                method: "POST",
                body: userData,
            }),
        }),

        userChangePassword: builder.mutation<unknown, ChangePasswordPayload>({
            query: (userData) => ({
                url: `/user/change-password`,
                method: "POST",
                body: userData,
            }),
        }),
    }),
});

export const {
    useUserLoginMutation,
    useUserRegisterMutation,
    useUserForgotPasswordMutation,
    useUserResetPasswordMutation,
    useUserVerifyOtpMutation,
    useUserResendOtpMutation,
    useUserChangePasswordMutation,
} = userAuthApi;