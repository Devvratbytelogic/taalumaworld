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
        registerMentor: builder.mutation({
            query: (userData) => ({
                url: `/admin/register-mentor`,
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
                url: `/admin/forgot-password-change`,
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
                url: `/admin/resend-otp`,
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
    useRegisterMentorMutation,
    useAdminForgotPasswordMutation,
    useAdminResetPasswordMutation,
    useAdminVerifyOtpMutation,
    useAdminResendOtpMutation,
    useAdminChangePasswordMutation,
} = adminAuthApi;
