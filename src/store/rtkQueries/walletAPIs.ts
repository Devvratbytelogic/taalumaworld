import { IMentorLedgerWalletAPIResponse, IWithdrawalAPIResponse } from '@/types/wallet';
import { rtkQuerieSetup } from '../services/rtkQuerieSetup';


export const walletAPIs = rtkQuerieSetup.injectEndpoints({
    endpoints: (builder) => ({
        /** Create a withdrawal request — Mentor */
        createWithdrawal: builder.mutation({
            query: (body) => ({
                url: `/admin/withdrawals`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['WithdrawalRequests', 'WithdrawalLedger', 'AdminWithdrawals'],
        }),

        /** Wallet ledger entries — Mentor */
        getWithdrawalLedger: builder.query<IMentorLedgerWalletAPIResponse, { page?: number, limit?: number, type?: 'credit' | 'debit', status?: 'pending' | 'completed' | 'rejected', fromDate?: string, toDate?: string }>({
            query: (params) => ({
                url: `/admin/withdrawals/ledger`,
                method: 'GET',
                params: params ? { ...params } : {},
            }),
            providesTags: ['WithdrawalLedger'],
        }),

        /** All withdrawal requests — Admin */
        getAllWithdrawals: builder.query<IWithdrawalAPIResponse, { page?: number, limit?: number, status?: 'pending' | 'approved' | 'rejected', wallet_type?: 'mentor' | 'affiliate', search?: string }>({
            query: (params) => ({
                url: `/admin/withdrawals`,
                method: 'GET',
                params: params ? { ...params } : {},
            }),
            providesTags: ['AdminWithdrawals'],
        }),

        /** Approve / reject a withdrawal request — Admin */
        reviewWithdrawal: builder.mutation({
            query: ({ id, values }) => ({
                url: `/admin/withdrawals/${id}/review`,
                method: 'PUT',
                body: values,
            }),
            invalidatesTags: ['AdminWithdrawals', 'WithdrawalRequests', 'WithdrawalLedger'],
        }),
    }),
});

export const {
    useCreateWithdrawalMutation,
    useGetWithdrawalLedgerQuery,
    useGetAllWithdrawalsQuery,
    useReviewWithdrawalMutation,
} = walletAPIs;
