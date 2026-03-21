import { rtkQuerieSetup } from '../services/rtkQuerieSetup';


export const userAuthApi = rtkQuerieSetup.injectEndpoints({
    endpoints: (builder) => ({
        userLogin: builder.mutation({
            query: (body) => ({
                url: `/user/login`,
                method: 'POST',
                body,
            }),
        }),
        userRegister: builder.mutation({
            query: (body) => ({
                url: `/user/register`,
                method: 'POST',
                body,
            }),
        }),
        userForgotPassword: builder.mutation({  
            query: (body) => ({
                url: `/user/forgot-password`,
                method: 'POST',
                body,
            }),
        }),
        userResetPassword: builder.mutation({
            query: (body) => ({
                url: `/user/reset-password`,
                method: 'POST',
                body,
            }),
        }),
        userVerifyEmail: builder.mutation({ 
            query: (body) => ({
                url: `/user/verify`,
                method: 'POST',
                body,
            }),
        }),
        userResendVerificationEmail: builder.mutation({ 
            query: (body) => ({
                url: `/user/forgot-password`,
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const {
    useUserLoginMutation,
} = userAuthApi;
