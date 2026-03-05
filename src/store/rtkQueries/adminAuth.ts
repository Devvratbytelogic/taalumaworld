import { rtkQuerieSetup } from '../services/rtkQuerieSetup';


export const adminAuthApi = rtkQuerieSetup.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (body) => ({
                url: `/admin/login`,
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const {
    useLoginMutation,
} = adminAuthApi;
