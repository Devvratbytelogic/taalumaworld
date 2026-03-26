import { rtkQuerieSetup } from '../services/rtkQuerieSetup';


export const adminAuthApi = rtkQuerieSetup.injectEndpoints({
    endpoints: (builder) => ({
        adminLogin: builder.mutation({
            query: (body) => ({
                url: `/admin/login`,
                method: 'POST',
                body,
            }),
        }),
        authorRegister: builder.mutation({
            query: (userData) => ({
                url: `/admin/register`,
                method: "POST",
                body: userData,
            }),
        }),
        authorForgotPassword: builder.mutation({
            query: (userData) => ({
                url: `/admin/forgot-password`,
                method: "POST",
                body: userData,
            }),
        }),
        authorResetPassword: builder.mutation({
            query: ({ token, payload }) => ({
                url: `/admin/new-password`,
                method: "POST",
                body: payload,
                headers: { Authorization: `Bearer ${token}` },
            }),
        }),
        authorVerifyOtp: builder.mutation({
            query: (userData) => ({
                url: `/admin/verify`,
                method: "POST",
                body: userData,
            }),
        }),
        authorResendOtp: builder.mutation({
            query: (userData) => ({
                url: `/admin/resend-code`,
                method: "POST",
                body: userData,
            }),
        }),
        authorChangePassword: builder.mutation({
            query: (userData) => ({
                url: `/user/change-password`,
                method: "POST",
                body: userData,
            }),
        }),
    }),
});

export const {
    useAdminLoginMutation,
    useAuthorRegisterMutation,
    useAuthorForgotPasswordMutation,
    useAuthorResetPasswordMutation,
    useAuthorVerifyOtpMutation,
    useAuthorResendOtpMutation,
    useAuthorChangePasswordMutation, 
} = adminAuthApi;
