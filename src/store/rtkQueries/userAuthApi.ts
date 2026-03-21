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
    }),
});

export const {
    useUserLoginMutation,
} = userAuthApi;
