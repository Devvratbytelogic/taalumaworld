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
        /** Sign in / sign up with Google (frontend sends the Google ID token it gets from the Sign in with Google button) */
        userGoogleLogin: builder.mutation({
            query: (body) => ({
                url: `/user/auth/google`,
                method: "POST",
                body: body,
            }),
        }),
        /** Sign in / sign up with LinkedIn (frontend sends the one-time OAuth code; the API exchanges it) */
        userLinkedInLogin: builder.mutation({
            query: (body) => ({
                url: `/user/auth/linkedin`,
                method: "POST",
                body: body,
            }),
        }),
        /** Sign in / sign up with Facebook / Meta (JS SDK access token, or OAuth code) */
        userMetaLogin: builder.mutation({
            query: (body) => ({
                url: `/user/auth/meta`,
                method: "POST",
                body: body,
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
                url: `/admin/update-profile`,
                method: "POST",
                body: userData,
            }),
            invalidatesTags: ['UserProfile'],
        }),
    }),
});

export const {
    useUserLoginMutation,
    useUserGoogleLoginMutation,
    useUserLinkedInLoginMutation,
    useUserMetaLoginMutation,
    useUserRegisterMutation,
    useUserForgotPasswordMutation,
    useUserResetPasswordMutation,
    useUserVerifyOtpMutation,
    useUserResendOtpMutation,
    useUserChangePasswordMutation,
    useUserUpdateProfileMutation,
} = userAuthApi;