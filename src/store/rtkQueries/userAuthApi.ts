import { rtkQuerieSetup } from '../services/rtkQuerieSetup';

export const userAuthApi = rtkQuerieSetup.injectEndpoints({
    endpoints: builder => ({
        userLogin: builder.mutation({
            query: (userData) => ({
                url: `/user/login`,
                method: "POST",
                body: userData,
            }),
        }),
        userRegister: builder.mutation({
            query: (userData) => ({
                url: `/user/register`,
                method: "POST",
                body: userData,
            }),
        }),
        userForgotPassword: builder.mutation({
            query: (userData) => ({
                url: `/admin/forgot-password`,
                method: "POST",
                body: userData,
            }),
        }),
        userResetPassword: builder.mutation({
            query: ({ payload }) => ({
                url: `/admin/forgot-password-change`,
                method: "POST",
                body: payload,
                // headers: { Authorization: `Bearer ${token}` },
            }),
        }),
        userVerifyOtp: builder.mutation({
            query: (userData) => ({
                url: `/admin/verify`,
                method: "POST",
                body: userData,
            }),
        }),
        userResendOtp: builder.mutation({
            query: (userData) => ({
                url: `/admin/resend-otp`,
                method: "POST",
                body: userData,
            }),
        }),
        userChangePassword: builder.mutation({
            query: (userData) => ({
                url: `/admin/change-password`,
                method: "POST",
                body: userData,
            }),
            invalidatesTags: ['UserProfile'],
        }),
        userUpdateProfile: builder.mutation({
            query: (userData) => ({
                url: `/user/update-profile`,
                method: "POST",
                body: userData,
            }),
            invalidatesTags: ['UserProfile'],
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
    useUserUpdateProfileMutation,
} = userAuthApi;