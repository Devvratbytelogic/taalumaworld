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
        adminForgotPassword: builder.mutation({
            query: (userData) => ({
                url: `/admin/forgot-password`,
                method: "POST",
                body: userData,
            }),
        }),
        adminResetPassword: builder.mutation({
            query: ({ token, payload }) => ({
                url: `/admin/new-password`,
                method: "POST",
                body: payload,
                headers: { Authorization: `Bearer ${token}` },
            }),
        }),
        adminVerifyOtp: builder.mutation({
            query: (userData) => ({
                url: `/admin/verify`,
                method: "POST",
                body: userData,
            }),
        }),
        adminResendOtp: builder.mutation({
            query: (userData) => ({
                url: `/admin/resend-code`,
                method: "POST",
                body: userData,
            }),
        }),
        adminChangePassword: builder.mutation({
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
    useAdminForgotPasswordMutation,
    useAdminResetPasswordMutation,
    useAdminVerifyOtpMutation,
    useAdminResendOtpMutation,
    useAdminChangePasswordMutation,
} = adminAuthApi;
